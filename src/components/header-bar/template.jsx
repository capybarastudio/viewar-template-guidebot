import React from 'react';
import classNames from 'classnames';

import styles from './styles.css';

export default ({ hidden, className, children }) => (
  <div
    className={classNames(
      styles.headerBar,
      hidden && styles.isHidden,
      className
    )}
  >
    {children}
  </div>
);
