import React from 'react';
import cx from 'classnames';

import styles from './styles.scss';

export default ({ versionInfo, className }) => (
  <div className={cx(styles.VersionInfo, className)}>
    {Object.entries(versionInfo).map(([key, value]) => (
      <div key={key} className={styles.VersionEntry}>
        <div className={styles.VersionKey}>{key}:</div>
        <div className={styles.VersionValue}>{value}</div>
      </div>
    ))}
  </div>
);
