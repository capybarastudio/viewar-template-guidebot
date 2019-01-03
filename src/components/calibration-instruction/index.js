import React from 'react';
import styles from './calibration-instruction.css';

import PhoneLandscapeIcon from '../../../assets/animations/tracking_animation_phone_landscape.gif';
import TabletLandscapeIcon from '../../../assets/animations/tracking_animation_tablet_landscape.gif';
import PhonePortraitIcon from '../../../assets/animations/tracking_animation_phone_portrait.gif';
import TabletPortraitIcon from '../../../assets/animations/tracking_animation_tablet_portrait.gif';

const landscapeDeviceTypeIcons = {
  phone: PhoneLandscapeIcon,
  tablet: TabletLandscapeIcon,
};

const portraitDeviceTypeIcons = {
  phone: PhonePortraitIcon,
  tablet: TabletPortraitIcon,
};

function getIcon(deviceType) {
  const isLandscape = window.innerHeight < window.innerWidth;

  if (isLandscape) {
    return landscapeDeviceTypeIcons[deviceType];
  } else {
    return portraitDeviceTypeIcons[deviceType];
  }
}

function getStyle(deviceType) {
  return {
    background: `url(${getIcon(deviceType)}) center / contain no-repeat`,
  };
}

export default ({ deviceType = 'tablet' }) => (
  <div className={styles.container}>
    <div style={getStyle(deviceType)} className={styles.devicePictogram} />
  </div>
);
