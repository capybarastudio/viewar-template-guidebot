import React from 'react';
import cx from 'classnames';

import styles from './styles.scss';

export default ({ className, dark, children }) => (
  <div className={cx(styles.container, dark && styles.isDark, className)}>
    {children}
  </div>
);
