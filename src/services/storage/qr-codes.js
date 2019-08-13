import viewarApi, { coreInterface } from 'viewar-api';
import authManager from '../auth-manager';
import { getQrCodeType } from '../../utils';
import { trackingTargets } from '../../services';

const appConfig = viewarApi.appConfig;

export const uploadLearnedQrCodes = async () => {
  const learnedQrCodes = await getLearnedQrCodes();

  const { pkId } = appConfig;

  const payload = new FormData();
  payload.append('QRCodes', JSON.stringify(learnedQrCodes));
  payload.append('id', pkId);
  payload.append('token', authManager.user.token);

  if (navigator.onLine) {
    await fetch(
      'http://dev2.viewar.com/templates/custom/guidebot/action:saveQRCodes/',
      {
        method: 'post',
        body: payload,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );
  }
};

export const setCustomTrackingTargets = async qrCodes => {
  if (
    viewarApi.tracker &&
    (viewarApi.tracker.name === 'ARKit' || viewarApi.tracker.name === 'ARCore')
  ) {
    const targets = trackingTargets.getTargets(qrCodes);
    await viewarApi.tracker.setTrackingTargets(targets);
  }
};

export const setOriginalTrackingTargets = async () => {
  if (
    viewarApi.tracker.name === 'ARKit' ||
    viewarApi.tracker.name === 'ARCore'
  ) {
    const tracker = appConfig.trackerList.find(
      tracker => tracker.name === 'ARKit' || tracker.name === 'ARCore'
    );
    if (tracker) {
      await viewarApi.tracker.setTrackingTargets(tracker.targets);
    }
  }
};

export const getLearnedQrCodes = async () => {
  const qrCodes =
    (coreInterface.platform === 'iOS' && viewarApi.tracker.name === 'ARKit') ||
    (coreInterface.platform === 'Android' &&
      viewarApi.tracker.name === 'ARCore')
      ? await coreInterface.call(
          'customTrackingCommand',
          viewarApi.tracker.name,
          'getLearnedTargets',
          ''
        )
      : [];

  return qrCodes.filter(
    ({
      pose: {
        position: { x, y, z },
      },
    }) => x && y && z
  );
};
