import React from 'react';
import cx from 'classnames';
import { translate } from '../../services';
import styles from './styles.scss';
import global from '../../../css/global.scss';

export default ({ toastText, className }) => (
  <div
    className={cx(
      styles.toast,
      toastText && styles.isVisible,
      global.ButtonColor,
      className
    )}
  >
    {translate(toastText)}
  </div>
);
