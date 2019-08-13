import React, { Fragment } from 'react';
import styles from './styles.scss';

import {
  MainToolBar,
  NavigationToolBar,
  ReplayToolBar,
  HeaderBar,
  IconButton,
  HelpOverlay,
  TrackingLost,
  Logo,
  PleaseWaitDialog,
  Gallery,
  Chat,
  PromptPopup,
  NearbyQrCodeHint,
  TrackingMapProgress,
  DebugStateMachine,
} from '../../components';

const MainHeaderBar = ({
  headerBarHidden,
  helpButtonHidden,
  toggleHelp,
  goBack,
  ...props
}) => (
  <HeaderBar hidden={headerBarHidden} {...props} className={styles.headerBar}>
    <IconButton
      onClick={goBack}
      size="small"
      icon="back"
      className={styles.headerBarButton}
    />
    {!helpButtonHidden && (
      <IconButton
        onClick={() => toggleHelp(true)}
        size="small"
        icon="help"
        className={styles.headerBarButton}
      />
    )}
  </HeaderBar>
);

export default ({
  admin,
  hasQrCodes,
  trackingLost,
  requestGuide,
  dismissGuide,
  guideRequested,
  navigationActive,
  helpVisible,
  trackingMapProgress,
  trackingMapProgressVisible,
  trackingMapMessage,
  ...props
}) => (
  <Fragment>
    <Logo admin={admin} />
    <HelpOverlay hidden={!helpVisible} type={'voice'} {...props} />
    <MainHeaderBar {...props} />
    <PleaseWaitDialog {...props} />
    <TrackingLost hidden={!trackingLost} />
    <PromptPopup {...props} />

    <TrackingMapProgress
      progress={trackingMapProgress}
      visible={trackingMapProgressVisible}
      message={trackingMapMessage}
    />

    <DebugStateMachine />

    <MainToolBar
      {...props}
      hidden={guideRequested || trackingLost || helpVisible}
      className={styles.toolBar}
      position="right"
    >
      <IconButton icon="poi" className={styles.button} onClick={requestGuide} />
    </MainToolBar>

    <NearbyQrCodeHint enabled={hasQrCodes && !helpVisible} />
    <MainToolBar
      {...props}
      hidden={!guideRequested || trackingLost}
      position="right"
    >
      <IconButton icon="abort" onClick={dismissGuide} />
    </MainToolBar>

    <ReplayToolBar />
    <Gallery {...props} />
    <Chat
      className={styles.chat}
      active={guideRequested && !trackingLost && !helpVisible}
    />
  </Fragment>
);
