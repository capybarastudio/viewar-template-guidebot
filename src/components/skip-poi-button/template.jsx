import React from 'react';
import cx from 'classnames';
import { translate } from '../../services';
import styles from './styles.scss';
import global from '../../../css/global.scss';

export default ({ poi, label, onClick, className }) => (
  <button
    className={cx(
      styles.button,
      className,
      global.ButtonColor,
      global.CustomFont1
    )}
    onClick={onClick}
  >
    <div className={styles.label}>{translate(label, false)}</div>
    <div className={styles.nextPoi}>{poi.data.name}</div>
  </button>
);
