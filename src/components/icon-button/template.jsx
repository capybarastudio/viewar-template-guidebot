import React from 'react';
import cx from 'classnames';

import styles from './styles.scss';
import global from '../../../css/global.scss';

import { Icon } from '../';

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
      styles.container,
      size && styles[`size-${size}`],
      active && styles.active,
      inactive && styles.inactive,
      hidden && styles.hidden,
      className
    )}
    onClick={e => !inactive && onClick && onClick(e)}
  >
    <Icon
      className={cx(styles.icon, global.ButtonColor)}
      icon={active ? 'active' : icon}
    />
  </div>
);
