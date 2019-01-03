import React from 'react';
import cx from 'classnames';
import { translate } from '../../services/translations';
import styles from './styles.css';
import globalStyles from '../../../css/global.css';

export default ({ children, className, hidden }) => (
  <div
    className={cx(
      styles.trackingLost,
      hidden && styles.isHidden,
      globalStyles.ButtonColor,
      className
    )}
  >
    {translate('TrackingLost')}
  </div>
);
