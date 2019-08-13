import viewarApi from 'viewar-api';
import { getQrCodeType } from '../utils';

/**
 * Service to get the active tracking config.
 */
const createTrackingTargets = () => {
  /**
   * Get tracking targets.
   */
  const getTargets = (qrCodes = null) => {
    if (qrCodes) {
      return getProjectTrackingConfigTargets(qrCodes);
    } else {
      return getTrackingConfigTargets();
    }
  };

  /**
   * Get targets from config.
   */
  const getTrackingConfigTargets = () => {
    const { trackerList } = viewarApi.appConfig;

    const trackingConfig = JSON.parse(JSON.stringify(trackerList)).find(
      tracker => tracker.name === 'ARKit' || tracker.name === 'ARCore'
    );

    return trackingConfig.targets;
  };

  /**
   * Get targets from project (merged with config targets).
   */
  const getProjectTrackingConfigTargets = qrCodes => {
    const { trackerList } = viewarApi.appConfig;

    const trackingConfig = JSON.parse(JSON.stringify(trackerList)).find(
      tracker => tracker.name === 'ARKit' || tracker.name === 'ARCore'
    );

    if (trackingConfig) {
      let inherits = null;
      const qrCodeType = getQrCodeType();

      // Find image target for 'inherits' property.
      const imageTarget = trackingConfig.targets.find(
        target => target.type === 'image'
      );

      if (imageTarget) {
        inherits = {
          type: 'image',
          name: imageTarget.name,
        };
      }

      const fallbackSize = trackingConfig.config.defaultQRCodeSize || 170;

      for (let qrCode of qrCodes) {
        const forceYUp = qrCode.forceYUp === undefined ? true : qrCode.forceYUp;

        let size = Number.parseInt(qrCode.size);
        if (!size) {
          size = fallbackSize;
        }

        const target = trackingConfig.targets.find(
          target => target.name === qrCode.name
        );

        if (target) {
          // Adapt existing target.
          Object.assign(target, {
            pose: qrCode.pose,
            learn: false,
            size,
            forceYUp,
          });
          target.pose = qrCode.pose;
          target.learn = false;
          target.size = size;
          target.forceYUp = forceYUp;
        } else {
          // Create new target
          trackingConfig.targets.push({
            name: qrCode.name,
            type: qrCodeType,
            size,
            handling: 'camera',
            useTimeout: true,
            learn: false,
            targetTimeout: 0,
            forceYUp,
            pose: {
              position: qrCode.pose.position,
              orientation: qrCode.pose.orientation,
            },
            inherits,
          });
        }
      }
    }

    return trackingConfig.targets;
  };

  return {
    getTargets,
  };
};

export default createTrackingTargets();
