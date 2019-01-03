import React from 'react';
import classNames from 'classnames';
import styles from './styles.css';

export default ({ position, hidden, children, className }) => (
  <div
    className={classNames(
      styles.mainToolbar,
      hidden && styles.isHidden,
      position && styles[`position-${position}`],
      className
    )}
  >
    {children}
  </div>
);
