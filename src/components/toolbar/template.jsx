import React from 'react';
import classNames from 'classnames';
import styles from './styles.css';

export default ({ children, hidden, className }) => (
  <div
    className={classNames(styles.toolbar, hidden && styles.isHidden, className)}
  >
    {children}
  </div>
);
