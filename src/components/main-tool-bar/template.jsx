import React from 'react';
import cx from 'classnames';
import styles from './styles.scss';

export default ({ position, hidden, children, className }) => (
  <div
    className={cx(
      styles.mainToolBar,
      hidden && styles.isHidden,
      position && styles[`position-${position}`],
      className
    )}
  >
    {children}
  </div>
);
