import React from 'react';
import classNames from 'classnames';

import styles from './styles.css';

export default ({ className, children, gap }) => (
  <div
    className={classNames(
      styles.container,
      gap && styles[`gap-${gap}`],
      className
    )}
  >
    {children}
  </div>
);
