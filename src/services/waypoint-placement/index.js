import createWaypointPlacement from './waypoint-placement';
import graphController from '../graph-controller';
import { coreInterface, modelManager, sceneManager } from 'viewar-api';
import config from '../config';
import appState from '../../services/app-state';
import camera from '../camera';

const showReticule = reticuleInstance =>
  (appState.sceneStateMutex = appState.sceneStateMutex.then(
    () => showReticuleFn(reticuleInstance),
    () => showReticuleFn(reticuleInstance)
  ));
const hideReticule = reticuleInstance =>
  (appState.sceneStateMutex = appState.sceneStateMutex.then(
    () => hideReticuleFn(reticuleInstance),
    () => hideReticuleFn(reticuleInstance)
  ));

const showReticuleFn = async reticuleInstance => {
  if (reticuleInstance) {
    await reticuleInstance.setVisible(true);
    return reticuleInstance;
  } else {
    const modelId = config.models.reticule;
    const model =
      modelManager.findModelById(modelId) ||
      modelManager.findModelByForeignKey(modelId) ||
      (await modelManager.getModelFromRepository(
        config.fallbackModels.reticule
      ));
    return (
      model &&
      (await sceneManager.insertModel(model, { id: 'TrackingReticule' }))
    );
  }
};

const hideReticuleFn = reticuleInstance =>
  reticuleInstance && reticuleInstance.setVisible(false);

const getPose = object => coreInterface.call('getInstancePose', object.id);

const addWaypointAtReticule = async reticuleInstance => {
  //TODO: remove once the core is patched
  const pose = await getPose(reticuleInstance);
  await graphController.addWaypoint(pose);
};

const addWaypointAtFeaturePoint = async () => {
  const hits = await sceneManager.simulateTouchRay(0.5, 0.5, 500);
  if (hits.featurePoints.length) {
    const pose = {
      position: hits.featurePoints[0].intersection,
    };
    await graphController.addWaypoint(pose);
    return true;
  }

  return false;
};

const getCameraHeight = () => camera.pose.position.y;

const getSelection = () =>
  sceneManager.selection && graphController.findById(sceneManager.selection.id);
const clearSelection = () => sceneManager.clearSelection();

const removeSelection = () => graphController.removeObject(getSelection());

export default createWaypointPlacement({
  showReticule,
  hideReticule,
  getPose,
  getCameraHeight,
  addWaypointAtFeaturePoint,
  addWaypointAtReticule,
  removeSelection,
  clearSelection,
});
