import React from 'react';
import cx from 'classnames';
import { translate } from '../../services/translations';
import styles from './styles.css';
import globalStyles from '../../../css/global.css';

export default ({ active, onClick, label, className }) => (
  <button
    className={cx(
      styles.button,
      active && styles.isActive,
      className,
      globalStyles.ButtonColor,
      globalStyles.CustomFont1
    )}
    onClick={onClick}
  >
    {translate(label)}
  </button>
);
