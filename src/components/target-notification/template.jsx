import React from 'react';
import classNames from 'classnames';

import styles from './styles.css';

import config from '../../services/config';

export default ({ children, className, target }) => (
  <div
    className={classNames(
      styles.targetNotification,
      className,
      (!config.app.showTargetNotification || !target) && styles.isHidden
    )}
  >
    {target}
  </div>
);
