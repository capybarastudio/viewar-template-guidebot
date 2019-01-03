import isEqual from 'lodash/isEqual';

import generateId from '../../utils/generate-id';
import { findPointsInRadius, calculateEdgePose } from '../../math/math';
import {
  GRAPH_CONTAINER_ID,
  INTERACTION,
  NO_INTERACTION,
  GRAPH_REDRAW_DELAY,
} from '../../constants';
import appState from '../../services/app-state';

const selected = { state: 'selected' };
const normal = { state: 'normal' };

import {
  MODE_WAYPOINT_PLACEMENT,
  MODE_POI_PLACEMENT,
  MODE_NAVIGATION,
} from '../scene-director/modes';

import config from '../../services/config';

//======================================================================================================================

const instancesByModel = new Map();

const getInstancesOf = model => {
  if (!instancesByModel.has(model)) {
    instancesByModel.set(model, new Set());
  }
  return instancesByModel.get(model);
};

const getInstanceOf = model => {
  const set = getInstancesOf(model);
  if (set.size) {
    const id = set.values().next().value;
    set.delete(id);
    return id;
  } else {
    return generateId();
  }
};

const storeId = (modelId, id) => getInstancesOf(modelId).add(id);
const getId = modelId => getInstanceOf(modelId);

//======================================================================================================================

export default function createGraphVisualizer({
  getSceneState,
  setSceneState,
  graphController,
  zoomToFit,
  camera,
  getSelection,
}) {
  let running = false;
  let updating = false;
  let selection = undefined;
  let oldSelectedWaypointPose = undefined;
  let oldObjectsById = {};
  let previouslyVisible = new Set();
  let clipping = true;
  let zoomOut = false;
  let selectable = true;
  let updateCounter = undefined;
  let firstRun = false;
  let lastUpdatedPoses = {};
  let lastUpdate = null;

  const getGraphContainer = sceneState => {
    const existingContainer = sceneState.children.find(
      child => child.id === GRAPH_CONTAINER_ID
    );
    if (existingContainer) {
      return existingContainer;
    } else {
      const newContainer = {
        id: GRAPH_CONTAINER_ID,
        type: 'ungrouped',
        children: [],
      };
      sceneState.children.push(newContainer);
      return newContainer;
    }
  };

  const hideGraph = () =>
    (appState.sceneStateMutex = appState.sceneStateMutex.then(
      () => hideGraphFn(),
      () => hideGraphFn()
    ));
  const hideGraphFn = async () => {
    const sceneState = await getSceneState();

    getGraphContainer(sceneState).children.forEach(child => {
      storeId(child.model.id, child.id);
      child.visible = false;
    });

    Object.values(oldObjectsById).forEach(object => (object.visible = false));

    oldObjectsById = {};
    previouslyVisible = new Set();
    await setSceneState(sceneState);
  };

  const processObjects = (visible, previouslyVisible, updatedPoses) => {
    const children = {};

    for (const object of previouslyVisible) {
      if (!visible.has(object)) {
        children[object.id] = {
          id: object.id,
          model: object.model,
          pose: updatedPoses[object.$id] || object.pose,
          visible: false,
        };
        storeId(object.model.id, object.id);
      }
    }

    for (const object of visible) {
      object.id = !previouslyVisible.has(object)
        ? getId(object.model.id)
        : object.id;

      children[object.id] = {
        id: object.id,
        model: object.model,
        propertyValues: {
          ...normal,
          ...(object === selection && selected),
        },
        pose: updatedPoses[object.$id] || object.pose,
        visible: true,
        interaction: selectable ? INTERACTION : NO_INTERACTION,
      };
    }

    return children;
  };

  const getVisibleObjects = camera => {
    let visibleWaypoints;
    if (clipping) {
      visibleWaypoints = findPointsInRadius(
        camera,
        graphController.waypoints,
        config.app.viewDistance
      );
    } else {
      visibleWaypoints = new Set(graphController.waypoints);
    }

    const visible = new Set(visibleWaypoints);

    for (const waypoint of visibleWaypoints) {
      for (const path of graphController.getPathsFrom(waypoint)) {
        if (!visible.has(path)) {
          const [w1, w2] = graphController.getWaypointsOf(path);
          if (visibleWaypoints.has(w1) && visibleWaypoints.has(w2)) {
            visible.add(path);
          }
        }
      }

      graphController.getPoisOf(waypoint).forEach(poi => visible.add(poi));
    }

    return visible;
  };

  const updateScene = (updatedPoses, visibleObjects) =>
    (appState.sceneStateMutex = appState.sceneStateMutex.then(
      () => updateSceneFn(updatedPoses, visibleObjects),
      () => updateSceneFn(updatedPoses, visibleObjects)
    ));
  const updateSceneFn = async (updatedPoses, visibleObjects) => {
    const objectsById = processObjects(
      visibleObjects,
      previouslyVisible,
      updatedPoses
    );
    previouslyVisible = visibleObjects;

    const sceneState = await getSceneState();
    if (!isEqual(objectsById, oldObjectsById)) {
      oldObjectsById = objectsById;
      getGraphContainer(sceneState).children = Object.values(objectsById);
      await setSceneState(sceneState);
    }

    if (zoomOut) {
      await zoomToFit();
      zoomOut = false;
    }
  };

  const getPoseUpdates = () => {
    const poses = {};
    let waypoints = [];

    if (firstRun) {
      waypoints = graphController.waypoints;
      graphController.waypoints.forEach(
        waypoint => (poses[waypoint.$id] = waypoint.pose)
      );
    } else if (
      selection &&
      graphController.containsWaypoint(selection) &&
      !isEqual(oldSelectedWaypointPose, selection.pose)
    ) {
      waypoints = [selection];
      oldSelectedWaypointPose = selection.pose;
    }

    for (let waypoint of waypoints) {
      graphController
        .getPathsFrom(waypoint)
        .forEach(
          path =>
            (poses[path.$id] = calculateEdgePose(
              ...graphController.getWaypointsOf(path)
            ))
        );
    }

    return poses;
  };

  const processTick = async () => {
    if (running && !updating) {
      updating = true;

      const oldSelection = selection;
      selection = graphController.selectedWaypoint;
      const updatedPoses = getPoseUpdates();

      try {
        /**
         * Only redraw when:
         *    a) xx seconds after last pose change (to update edges)
         *    b) selection has changed (for materials and for new waypoints)
         *    c) visible object count changed
         *
         * This prevents flickering on some device when setting the scene state while dragging a waypoint.
         */

        const now = Date.now();
        const elapsed = now - lastUpdate;
        lastUpdate = now;

        if (updateCounter !== undefined) {
          updateCounter -= elapsed;
        }

        const hasPoseUpdates = Object.keys(updatedPoses).length;
        const visibleObjects = getVisibleObjects(camera);

        if (updateCounter !== undefined && updateCounter <= 0) {
          const poses = hasPoseUpdates ? updatedPoses : lastUpdatedPoses;
          await updateScene(poses, visibleObjects);
          updateCounter = undefined;
        } else if (visibleObjects.size !== previouslyVisible.size) {
          await updateScene(updatedPoses, visibleObjects);
        } else if (!hasPoseUpdates && selection !== oldSelection) {
          await updateScene(updatedPoses, visibleObjects);
        }

        if (Object.keys(updatedPoses).length) {
          lastUpdatedPoses = updatedPoses;
          updateCounter = GRAPH_REDRAW_DELAY;
        }

        firstRun = false;
      } catch (e) {
        console.error(e);
      } finally {
        updating = false;
      }
    }
  };

  const start = async () => {
    if (!running) {
      running = true;
      firstRun = true;
      updateCounter = undefined;
      lastUpdatedPoses = {};
      lastUpdate = Date.now();
    }
  };

  const stop = async () => {
    if (running) {
      running = false;
      await hideGraph();
    }
  };

  const zoomOutAfterRender = () => {
    zoomOut = true;
  };

  const runsInMode = mode => {
    return [
      MODE_WAYPOINT_PLACEMENT,
      MODE_POI_PLACEMENT,
      config.debug.showGraphDuringNavigation && MODE_NAVIGATION,
    ].includes(mode);
  };

  const init = async () => {};

  return {
    get selectable() {
      return selectable;
    },
    set selectable(newSelectable) {
      selectable = newSelectable;
    },
    get clipping() {
      return clipping;
    },
    set clipping(newClipping) {
      clipping = newClipping;
    },
    zoomOutAfterRender,

    init,
    start,
    stop,
    processTick,
    get running() {
      return running;
    },
    runsInMode,
  };
}
