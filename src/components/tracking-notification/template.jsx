import React from 'react';
import cx from 'classnames';

import styles from './styles.scss';
import global from '../../../css/global.scss';

export default ({ children, className }) => (
  <div
    className={cx(styles.trackingNotification, global.CustomFont2, className)}
  >
    {children}
  </div>
);
