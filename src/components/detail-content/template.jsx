import React from 'react';
import cx from 'classnames';

import styles from './styles.scss';

export default ({ className, children }) => (
  <div className={cx(styles.container, className)}>{children}</div>
);
