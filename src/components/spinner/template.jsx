import React from 'react';
import styles from './styles.scss';
import { translate } from '../../services';

export default ({ waitDialogText }) => (
  <div className={styles.loadingSpinner}>
    <div className={styles.doubleBounce1} />
    <div className={styles.doubleBounce2} />
    <div className={styles.Message}>{translate(waitDialogText)}</div>
  </div>
);
