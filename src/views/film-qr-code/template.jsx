import React, { Fragment } from 'react';
import styles from './styles.scss';
import global from '../../../css/global.scss';
import cx from 'classnames';
import { Logo, IconButton, TrackingNotification } from '../../components';
import { translate } from '../../services';

export default ({ history, nextView }) => (
  <div className={styles.container}>
    <Logo />
    <div className={cx(styles.qrScanArea, global.ButtonColor)} />
    <div className={cx(styles.qrScanAreaInlay, global.ButtonColor)} />
    <IconButton
      onClick={() => history.push(nextView)}
      size="small"
      icon="skip"
      className={styles.skipButton}
    />
    <TrackingNotification>
      {translate('QRCodeNotification')}
    </TrackingNotification>
  </div>
);
