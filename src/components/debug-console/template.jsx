import React from 'react';
import cx from 'classnames';

import styles from './styles.scss';

export default ({ className, messages }) => (
  <div className={cx(styles.console, className)}>
    {messages.map((entry, id) => (
      <div className={cx(styles.entry, styles[`type-${entry.type}`])} key={id}>
        <div className={styles.time}>{entry.time}</div>
        <div className={styles.message}>{entry.message}</div>
      </div>
    ))}
  </div>
);
