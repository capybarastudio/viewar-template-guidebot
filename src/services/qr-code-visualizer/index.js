import throttle from 'lodash/throttle';
import viewarApi, {
  sceneManager,
  coreInterface,
  modelManager,
} from 'viewar-api';
import storage from '../storage';

import { QR_CODES_CONTAINER_ID, NO_INTERACTION } from '../../constants';
import { config, trackingTargets } from '../../services';
import createQrCodeVisualizer from './qr-code-visualizer';
import { getQrCodeType } from '../../utils';

const insertContainer = async () => {
  const newContainer = {
    id: QR_CODES_CONTAINER_ID,
    grouped: false,
    interaction: NO_INTERACTION,
    children: [],
  };
  return await sceneManager.insertContainer(newContainer);
};

const insertVisualization = async ({ name, pose }, parent) => {
  const modelId = config.models.qr;
  const model =
    modelManager.findModelById(modelId) ||
    modelManager.findModelByForeignKey(modelId) ||
    (await modelManager.getModelFromRepository(config.fallbackModels.qr));

  return await sceneManager.insertModel(model, {
    id: name,
    pose,
    parent,
  });
};

export const isEnabled = () => config.app.visualizeQrCodes;

const getInitialQrCodes = () => {
  const targets = trackingTargets.getTargets(
    storage.activeProject && storage.activeProject.qrCodes
  );
  return JSON.parse(
    JSON.stringify(targets.filter(target => target.type === getQrCodeType()))
  );
};

const getTrackedQrCodes = () =>
  viewarApi.tracker
    ? viewarApi.tracker.targets
        .filter(target => target.tracked)
        .reduce((targets, target) => {
          targets.push(target.name);
          return targets;
        }, [])
    : [];

const getLearnedQrCodes = throttle(async () => {
  let qrCodes = (storage.activeProject && storage.activeProject.qrCodes) || [];

  if (coreInterface.platform === 'iOS') {
    let learnedQrCodes = await coreInterface.call(
      'customTrackingCommand',
      viewarApi.tracker.name,
      'getLearnedTargets',
      ''
    );
    learnedQrCodes = learnedQrCodes.filter(
      ({
        pose: {
          position: { x, y, z },
        },
      }) => x && y && z
    );
    qrCodes = qrCodes.concat(learnedQrCodes);
  }

  return qrCodes;
}, 1000);

const removeVisualization = sceneManager.removeNode;

const onTrackingChanged = listener => {
  const { coreInterface, tracker } = viewarApi;
  if (
    coreInterface.platform === 'iOS' ||
    coreInterface.platform === 'Android'
  ) {
    tracker.on('trackingTargetStatusChanged', listener);
  }
};

const offTrackingChanged = listener => {
  const { coreInterface, tracker } = viewarApi;
  if (
    coreInterface.platform === 'iOS' ||
    coreInterface.platform === 'Android'
  ) {
    tracker.off('trackingTargetStatusChanged', listener);
  }
};

const hasQRCodeCapability = () =>
  viewarApi.tracker &&
  (viewarApi.tracker.name === 'ARKit' || viewarApi.tracker.name === 'ARCore');

export default createQrCodeVisualizer({
  insertContainer,
  getInitialQrCodes,
  getLearnedQrCodes,
  getTrackedQrCodes,
  insertVisualization,
  removeVisualization,
  isEnabled,
  onTrackingChanged,
  offTrackingChanged,
  hasQRCodeCapability,
});
