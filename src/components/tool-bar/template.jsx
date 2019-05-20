import React from 'react';
import cx from 'classnames';
import styles from './styles.scss';

export default ({ children, hidden, className }) => (
  <div className={cx(styles.toolBar, hidden && styles.isHidden, className)}>
    {children}
  </div>
);
