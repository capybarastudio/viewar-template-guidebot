import React from 'react';
import classNames from 'classnames';

import styles from './styles.css';
import globalStyles from '../../../css/global.css';

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
    className={classNames(
      styles.button,
      styles.buttonImage,
      inactive && styles.inactive,
      icon && styles[`icon-${icon}`],
      size && styles[`size-${size}`],
      active && styles.active,
      hidden && styles.hidden,
      className,
      globalStyles.ButtonColor
    )}
    onClick={e => !inactive && onClick && onClick(e)}
  />
);
