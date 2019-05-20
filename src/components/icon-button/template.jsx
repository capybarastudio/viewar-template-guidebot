import React from 'react';
import cx from 'classnames';

import styles from './styles.scss';
import global from '../../../css/global.scss';

export default ({
  onClick,
  icon,
  className,
  size,
  active,
  hidden,
  inactive,
}) => (
  <div
    className={cx(
      styles.button,
      styles.buttonImage,
      inactive && styles.inactive,
      icon && styles[`icon-${icon}`],
      size && styles[`size-${size}`],
      active && styles.active,
      hidden && styles.hidden,
      className,
      global.ButtonColor
    )}
    onClick={e => !inactive && onClick && onClick(e)}
  />
);
