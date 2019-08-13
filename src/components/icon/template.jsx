import React from 'react';
import cx from 'classnames';

import styles from './styles.scss';
import global from '../../../css/global.scss';

export default ({ icon, className, size }) => (
  <div
    className={cx(
      styles.container,
      size && styles[`size-${size}`],
      icon && styles[`icon-${icon}`],
      className
    )}
  />
);
