import React from 'react';
import cx from 'classnames';
import { translate } from '../../services/translations';
import styles from './styles.css';
import globalStyles from '../../../css/global.css';

export default ({ toastText, className, onClick }) => (
  <div
    className={cx(
      styles.toast,
      toastText && styles.isVisible,
      globalStyles.ButtonColor,
      className
    )}
  >
    {translate(toastText)}
  </div>
);
