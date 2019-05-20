import React from 'react';
import styles from './styles.scss';
import { translate } from '../../services';
import {
  Logo,
  HeaderBar,
  IconButton,
  TrackingNotification,
  CalibrationInstruction,
  AdvancedHint,
} from '../../components';

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

export default ({ deviceType, advancedInitHint, ...props }) => (
  <div className={styles.container}>
    <InitTrackerBar {...props} />
    <Logo />

    <div className={styles.animationWrapper}>
      <AdvancedHint
        icon="hint"
        text={advancedInitHint}
        hidden={!advancedInitHint}
      />
      <CalibrationInstruction deviceType={deviceType} />
      <TrackingNotification>
        {translate('TrackingNotification')}
      </TrackingNotification>
    </div>
  </div>
);
