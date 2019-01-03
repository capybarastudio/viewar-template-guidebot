import React from 'react';
import styles from './styles.css';
import { translate } from '../../services/translations';

export default ({ waitDialogText }) => (
  <div className={styles.loadingSpinner}>
    <div className={styles.doubleBounce1} />
    <div className={styles.doubleBounce2} />
    <div className={styles.Message}>{translate(waitDialogText)}</div>
  </div>
);
