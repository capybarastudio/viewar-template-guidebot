import axios from 'axios';
import viewarApi, { coreInterface } from 'viewar-api';
import authManager from '../auth-manager';
import storage from '../storage';

const appConfig = viewarApi.appConfig;

export const uploadLearnedQrCodes = async () => {
  const learnedQrCodes = await getLearnedQrCodes();

  const { pkId } = appConfig;

  const payload = new FormData();
  payload.append('QRCodes', JSON.stringify(learnedQrCodes));
  payload.append('id', pkId);
  payload.append('token', authManager.user.token);

  if (navigator.onLine) {
    await axios.post(
      'http://dev2.viewar.com/templates/custom/guidebot/action:saveQRCodes/',
      payload,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );
  }
};

export const setCustomTrackingTargets = async qrCodes => {
  if (Object.keys(viewarApi.trackers)[0] === 'ARKit') {
    const { trackerList } = appConfig;

    const customTrackingConfig = JSON.parse(JSON.stringify(trackerList));
    const customTracker = customTrackingConfig.find(
      tracker => tracker.name === 'ARKit'
    );

    if (customTracker) {
      for (let qrCode of qrCodes) {
        const target = customTracker.targets.find(
          target => target.name === qrCode.name
        );
        if (target) {
          // Adapt existing target.
          target.pose = qrCode.pose;
          target.learn = false;
        } else {
          // Create new target
          customTracker.targets.push({
            name: qrCode.name,
            type: 'image',
            size: 390,
            handling: 'camera',
            useTimeout: true,
            targetTimeout: 0,
            forceYUp: true,
            pose: {
              position: qrCode.pose.position,
              orientation: qrCode.pose.orientation,
            },
          });
        }
      }

      await viewarApi.trackers.ARKit.setTrackingTargets(customTracker.targets);
    }
  }
};

export const setOriginalTrackingTargets = async () => {
  if (Object.keys(viewarApi.trackers)[0] === 'ARKit') {
    const tracker = appConfig.trackerList.find(
      tracker => tracker.name === 'ARKit'
    );
    if (tracker) {
      await viewarApi.trackers.ARKit.setTrackingTargets(tracker.targets);
    }
  }
};

export const getLearnedQrCodes = async () => {
  const qrCodes =
    coreInterface.platform === 'iOS' &&
    Object.keys(viewarApi.trackers)[0] === 'ARKit'
      ? await coreInterface.call(
          'customTrackingCommand',
          'ARKit',
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
