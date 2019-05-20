import React from 'react';
import cx from 'classnames';

import styles from './styles.scss';

export default ({ hidden, className, children }) => (
  <div className={cx(styles.headerBar, hidden && styles.isHidden, className)}>
    {children}
  </div>
);
