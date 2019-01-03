import React from 'react';
import classNames from 'classnames';

import styles from './styles.css';

export default ({ children, className }) => (
  <div className={classNames(styles.trackingNotification, className)}>
    {children}
  </div>
);
