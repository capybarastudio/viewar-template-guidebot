import React, { Fragment } from 'react';
import styles from './styles.css';
import globalStyles from '../../../css/global.css';
import cx from 'classnames';
import Logo from '../../components/logo';
import IconButton from '../../components/icon-button';
import TrackingNotification from '../../components/tracking-notification';
import { translate } from '../../services/translations';

export default ({ history, nextView }) => (
  <div className={styles.container}>
    <Logo />
    <div className={cx(styles.qrScanArea, globalStyles.ButtonColor)} />
    <div className={cx(styles.qrScanAreaInlay, globalStyles.ButtonColor)} />
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
