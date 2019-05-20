import React from 'react';
import cx from 'classnames';

import styles from './styles.scss';

export default ({ children, className }) => (
  <div className={cx(styles.trackingNotification, className)}>{children}</div>
);
