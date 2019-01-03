import { MODE_NAVIGATION } from '../scene-director/modes';
import Vector3 from '../../math/vector3';
import Quaternion from '../../math/quaternion';

class Pose {
  constructor({
    position = Vector3.ZERO,
    orientation = Quaternion.IDENTITY,
    scale = Vector3.UNIT_SCALE,
  } = {}) {
    this.position = Vector3.ZERO.copy(position);
    this.orientation = Quaternion.IDENTITY.copy(orientation);
    this.scale = Vector3.UNIT_SCALE.copy(scale);
  }

  copy(pose) {
    this.position.copy(pose.position);
    this.orientation.copy(pose.orientation);
    this.scale.copy(pose.scale);
  }
}

const NEXT_SHAPE_LOAD_TIME = 1000;

/**
 * Animates a object (model instance) to follow a specific shape path.
 */
export default ({
  getIsEnabled,
  getObjectDefinitions,
  addToPoseUpdateQueue,
  clearPoseUpdateQueue,
  getOrInsertObject,
}) => {
  let running = false;
  let updating = false;
  let lastUpdate = [];
  let instances = [];
  let objectDefinitions = [];
  let pathDefinitions = [];
  let currentShapes = [];

  //--------------------------------------------------------------------------------------------------------------------
  // PUBLIC METHODS
  //--------------------------------------------------------------------------------------------------------------------

  const start = async () => {
    if (!running) {
      running = true;
      const now = Date.now();

      objectDefinitions = getObjectDefinitions();
      for (let { id } of objectDefinitions) {
        lastUpdate[id] = now;
        currentShapes[id] = 0;
      }

      await showObjects();
      await loadPaths();
    }
  };

  const stop = async () => {
    if (running) {
      running = false;
      await hideObjects();
    }
  };

  const processTick = async () => {
    if (running && !updating) {
      updating = true;
      const now = Date.now();

      for (let { id, objectDefinition } of objectDefinitions) {
        const elapsedTime = now - lastUpdate[id];
        const timeToNextUpdate = await updateObject(
          id,
          objectDefinition,
          elapsedTime
        );
        if (timeToNextUpdate !== false) {
          lastUpdate[id] = now + timeToNextUpdate;
        }
      }
      try {
      } catch (e) {
        console.error(e.message);
      } finally {
        updating = false;
      }
    }
  };

  const runsInMode = mode => {
    return (getIsEnabled() ? [MODE_NAVIGATION] : []).includes(mode);
  };

  const init = async () => {
    objectDefinitions = getObjectDefinitions();

    for (let { id, objectDefinition } of objectDefinitions) {
      instances[id] = await getOrInsertObject(id, objectDefinition);
    }
  };

  //--------------------------------------------------------------------------------------------------------------------
  // PUBLIC METHODS
  //--------------------------------------------------------------------------------------------------------------------

  /**
   * Insert object if not inserted yet and set to visible.
   */
  const showObjects = async () => {
    for (let { id, objectDefinition } of objectDefinitions) {
      instances[id] = await getOrInsertObject(id, objectDefinition);
      await instances[id].children[0].setVisible(true);
    }
  };

  /**
   * Hides the object.
   */
  const hideObjects = async () => {
    for (let { id, objectDefinition } of objectDefinitions) {
      instances[id] = await getOrInsertObject(id, objectDefinition);
      await instances[id].children[0].setVisible(false);
      await clearPoseUpdateQueue(instances[id].id);
    }
  };

  /**
   * Checks if the current shape is finished and starts the path of the next shape (if existing).
   * Returns time to next shape if next shape is loaded or otherwise false.
   */
  const updateObject = async (id, objectDefinition, elapsedTime) => {
    const path = objectDefinition.paths[currentShapes[id]];

    if (path) {
      const { loop, durationInSeconds } = path;
      if (durationInSeconds * 1000 - NEXT_SHAPE_LOAD_TIME <= elapsedTime) {
        // Advance current shape only if the current shape is not looping.
        if (!loop) {
          currentShapes[id]++;
        }

        await loadPath(id, objectDefinition);

        const timeToNextUpdate = durationInSeconds * 1000 - elapsedTime;
        return timeToNextUpdate;
      }
    }

    return false;
  };

  const loadPaths = async () => {
    for (let { id, objectDefinition } of objectDefinitions) {
      loadPath(id, objectDefinition);
    }
  };

  /**
   * Start animations and fill pose update queue for the current shape.
   */
  const loadPath = async (id, objectDefinition) => {
    if (objectDefinition.paths[currentShapes[id]]) {
      currentShapes[id] = 0;
    }

    let definition = objectDefinition.paths[currentShapes[id]];
    const poseQueue = generatePoseQueueFromPath(definition);

    await startAnimations(id, definition);
    void addToPoseUpdateQueue(instances[id].id, poseQueue);
  };

  /**
   * Start all the animations defined for this shape. Stops all other animations first.
   */
  const startAnimations = async (id, definition) => {
    const instance = instances[id];
    if (instance.children[0].animations) {
      const { animations = [] } = definition;

      // Stop all animations.
      for (let animation of Object.values(instance.children[0].animations)) {
        await animation.stop();
      }

      // Start animations.
      for (let animation of animations) {
        if (instance.children[0].animations[animation]) {
          await instance.children[0].animations[animation].start({
            loop: true,
          });
        }
      }
    }
  };

  /**
   * Generate a pose queue from a given shape definition
   */
  const generatePoseQueueFromPath = shapeDefinition => {
    const { shape, durationInSeconds, definition } = shapeDefinition;
    let waypoints = [];

    // Generate waypoints.
    switch (shape) {
      case 'circle':
        waypoints = generateCircleWaypoints(definition);
        break;
    }

    const poseUpdateDuration = durationInSeconds / waypoints.length;
    const poseQueue = [];
    let i = 0;

    // Create pose queue.
    for (let waypoint of waypoints) {
      const pose = new Pose(waypoint);
      Object.assign(pose, {
        durationInSeconds: poseUpdateDuration,
      });
      poseQueue.push(pose);

      i++;
    }

    return poseQueue;
  };

  /**
   * Generates waypoints for a circle shape.
   */
  const generateCircleWaypoints = definition => {
    const {
      radius,
      resolution,
      direction = 'counterclockwise',
      center,
      startAngle,
    } = definition;

    const waypoints = [];

    const initialOrientation = new Quaternion({ w: 1, x: 0, y: 0, z: 0 });

    const initialAngle = (startAngle * Math.PI) / 180;
    const directionSign = direction === 'clockwise' ? -1 : 1;
    const angleOffset = ((2 * Math.PI) / resolution) * directionSign;
    for (let i = 0; i < resolution; i++) {
      // Calculate angle from zero.
      const angle = initialAngle + angleOffset * i;

      // Calculate point on the circle.
      const position = new Vector3(
        center.x + radius * Math.sin(angle),
        center.y,
        center.z + radius * Math.cos(angle)
      );

      // Adjust orientation for this angle position.
      const rotation = Quaternion.fromAxisAngle(Vector3.Y_AXIS, angle);
      const orientation = initialOrientation.clone().multiply(rotation);

      waypoints.push({
        position,
        orientation,
      });
    }

    return waypoints;
  };

  const getModels = () => {
    const models = [];

    if (getIsEnabled()) {
      for (let { objectDefinition } of getObjectDefinitions()) {
        models.push(objectDefinition.modelId);
      }
    }

    return models;
  };

  //--------------------------------------------------------------------------------------------------------------------
  // INTERFACE
  //--------------------------------------------------------------------------------------------------------------------

  return {
    init,
    start,
    stop,
    processTick,
    get running() {
      return running;
    },
    get models() {
      return getModels();
    },
    runsInMode,
  };
};
