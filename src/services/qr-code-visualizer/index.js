import throttle from 'lodash/throttle';
import viewarApi, {
  sceneManager,
  coreInterface,
  modelManager,
} from 'viewar-api';
import storage from '../storage';

import { QR_CODES_CONTAINER_ID, NO_INTERACTION } from '../../constants';
import config from '../../services/config';
import createQrCodeVisualizer from './qr-code-visualizer';

const insertContainer = async () => {
  const newContainer = {
    id: QR_CODES_CONTAINER_ID,
    type: 'grouped',
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
  const tracker = viewarApi.appConfig.trackerList.find(
    tracker => tracker.name === 'ARKit'
  );
  if (tracker) {
    return JSON.parse(
      JSON.stringify(tracker.targets.filter(target => target.type === 'image'))
    );
  } else {
    return [];
  }
};

const getTrackedQrCodes = () =>
  viewarApi.trackers.ARKit
    ? viewarApi.trackers.ARKit.targets
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
      'ARKit',
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
  const { coreInterface, trackers } = viewarApi;
  if (coreInterface.platform === 'iOS') {
    trackers.ARKit.on('trackingTargetStatusChanged', listener);
  }
};

const offTrackingChanged = listener => {
  const { coreInterface, trackers } = viewarApi;
  if (coreInterface.platform === 'iOS') {
    trackers.ARKit.off('trackingTargetStatusChanged', listener);
  }
};

const hasQRCodeCapability = () => viewarApi.trackers.name === 'ARKit';

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
