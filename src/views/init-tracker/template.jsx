import React, { Fragment } from 'react';
import styles from './styles.css';
import { translate } from '../../services/translations';
import Logo from '../../components/logo';
import HeaderBar from '../../components/header-bar';
import IconButton from '../../components/icon-button';
import TrackingNotification from '../../components/tracking-notification';
import CalibrationInstruction from '../../components/calibration-instruction';

const InitTrackerBar = ({ toggleHelp, goBack, headerBarHidden, ...props }) => (
  <HeaderBar hidden={headerBarHidden} {...props} className={styles.headerBar}>
    <IconButton
      onClick={() => goBack()}
      size="small"
      icon="back"
      className={styles.headerBarButton}
    />
  </HeaderBar>
);

export default ({ deviceType, ...props }) => (
  <Fragment>
    <InitTrackerBar {...props} />
    <Logo />
    <CalibrationInstruction deviceType={deviceType} />
    <TrackingNotification>
      {translate('TrackingNotification')}
    </TrackingNotification>
  </Fragment>
);
