import React from 'react';
import cx from 'classnames';

import styles from './styles.scss';

import config from '../../services/config';

export default ({ children, className, target }) => (
  <div
    className={cx(
      styles.targetNotification,
      className,
      (!config.app.showTargetNotification || !target) && styles.isHidden
    )}
  >
    {target}
  </div>
);
