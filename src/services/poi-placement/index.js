import {
  arCamera,
  modelManager,
  sceneManager,
  vrCamera,
  screenshotManager,
} from 'viewar-api';
import config from '../config';
import createPoiCapture from './poi-placement';
import graphController from '../graph-controller';
import createObjectProxy from '../object-proxy';
import generateId from '../../utils/generate-id';
import camera from '../camera';
import { translate } from '../translations';

let counter = 1;

const getSelection = () =>
  sceneManager.selection &&
  graphController.pois.find(poi => poi.id === sceneManager.selection.id);
const clearSelection = () => sceneManager.clearSelection();

const findNearestWaypointToCamera = () =>
  graphController.getNearestWaypoint(camera);

const addPoiAtCameraPose = async (nearestWaypoint, customInfo) => {
  const name = translate('PoiDefaultName', false) + counter++;
  const description = translate('PoiDefaultDescription', false) + name + '.';

  const poseInFrontOfCamera = await camera.getPoseInViewingDirection(200);

  const modelId = config.models.poi;
  const model =
    modelManager.findModelById(modelId) ||
    modelManager.findModelByForeignKey(modelId) ||
    (await modelManager.getModelFromRepository(config.fallbackModels.poi));

  const poi = createObjectProxy({
    $id: generateId(),
    model: model,
    pose: {
      position: poseInFrontOfCamera.position,
      orientation: { w: 1, x: 0, y: 0, z: 0 },
      scale: { x: 0.25, y: 0.25, z: 0.25 },
    },
    data: {
      name,
      description,
      ...customInfo,
    },
  });

  graphController.addPoi(poi, nearestWaypoint);

  return poi;
};

const removePoi = poi => graphController.removePoi(poi);

export default createPoiCapture({
  addPoiAtCameraPose,
  removePoi,
  findNearestWaypointToCamera,
  getSelection,
  clearSelection,
});
