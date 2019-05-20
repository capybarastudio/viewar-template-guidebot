import React from 'react';
import cx from 'classnames';
import { translate } from '../../services';
import styles from './styles.scss';
import global from '../../../css/global.scss';

export default ({ children, className, hidden }) => (
  <div
    className={cx(
      styles.trackingLost,
      hidden && styles.isHidden,
      global.ButtonColor,
      className
    )}
  >
    {translate('TrackingLost')}
  </div>
);
