import React from 'react';
import classNames from 'classnames';

import styles from './styles.css';

export default ({ className, messages }) => (
  <div className={classNames(styles.console, className)}>
    {messages.map((entry, id) => (
      <div
        className={classNames(styles.entry, styles[`type-${entry.type}`])}
        key={id}
      >
        <div className={styles.time}>{entry.time}</div>
        <div className={styles.message}>{entry.message}</div>
      </div>
    ))}
  </div>
);
