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
} from '../../components';

const MainHeaderBar = ({
  headerBarHidden,
  hideHelpButton,
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
    {!hideHelpButton && (
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
  speechDisabled,
  trackingLost,
  navigationToolBarActive,
  requestGuideWithToolBar,
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
    <HelpOverlay
      hidden={!helpVisible}
      speechDisabled={speechDisabled}
      type={'navigate'}
      {...props}
    />
    <MainHeaderBar hideHelpButton={guideRequested} {...props} />
    <PleaseWaitDialog {...props} />
    <TrackingLost hidden={!trackingLost} />
    <NavigationToolBar visible={navigationToolBarActive} {...props} />
    <PromptPopup {...props} />

    <TrackingMapProgress
      progress={trackingMapProgress}
      visible={trackingMapProgressVisible}
      message={trackingMapMessage}
    />

    <MainToolBar
      {...props}
      hidden={guideRequested || trackingLost || helpVisible}
      className={styles.toolBar}
      position="right"
    >
      <IconButton
        icon="menu"
        className={styles.button}
        onClick={requestGuideWithToolBar}
      />
      {!speechDisabled && (
        <IconButton
          icon="poi"
          className={styles.button}
          onClick={requestGuide}
        />
      )}
    </MainToolBar>
    <NearbyQrCodeHint enabled={hasQrCodes} />
    <MainToolBar
      {...props}
      hidden={!guideRequested || trackingLost}
      position="right"
    >
      <IconButton icon="abort" onClick={dismissGuide} />
    </MainToolBar>
    <ReplayToolBar />
    <Gallery {...props} />
    <Chat active={guideRequested && !trackingLost} />
  </Fragment>
);
