import React from 'react';
import classNames from 'classnames';

import styles from './styles.css';

export default ({ className, children }) => (
  <div className={classNames(styles.container, className)}>{children}</div>
);
