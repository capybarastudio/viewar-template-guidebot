import React from 'react';
import cx from 'classnames';
import { translate } from '../../services';

import styles from './styles.scss';
import global from '../../../css/global.scss';

export default ({ className, progress, visible, message }) => (
  <div className={cx(styles.Container, !visible && styles.isHidden)}>
    <div className={styles.Progress}>
      <div className={styles.ProgressBar}>
        <div style={{ maxWidth: `${progress}%` }} />
      </div>
      <div className={styles.Message}>{translate(message)}</div>
    </div>
  </div>
);
