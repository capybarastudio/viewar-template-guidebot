import React from 'react';
import cx from 'classnames';
import { translate } from '../../services';
import styles from './styles.scss';
import global from '../../../css/global.scss';

export default ({ className, enabled, hidden }) => (
  <div
    className={cx(
      styles.nearbyQrCode,
      (!enabled || hidden) && styles.isHidden,
      global.ButtonColor,
      className
    )}
  >
    {translate('NavigationFilmNearQrCode')}
  </div>
);
