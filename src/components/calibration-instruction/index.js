import React from 'react';
import cx from 'classnames';

import styles from './calibration-instruction.scss';

import capitalize from 'lodash/capitalize';

export default ({ deviceType = 'phone', hidden, className }) => (
  <div
    className={cx(
      styles.container,
      hidden && styles.isHidden,
      styles[`type${capitalize(deviceType)}`],
      className
    )}
  >
    <div className={styles.devicePictogram} />
  </div>
);
