import React from 'react';
import cx from 'classnames';
import { translate } from '../../services';
import styles from './styles.scss';
import global from '../../../css/global.scss';

export default ({ active, onClick, label, className }) => (
  <button
    className={cx(
      styles.button,
      active && styles.isActive,
      className,
      global.ButtonColor,
      global.CustomFont1
    )}
    onClick={onClick}
  >
    {translate(label)}
  </button>
);
