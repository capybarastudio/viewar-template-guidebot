import React, { Fragment } from 'react';
import styles from './styles.css';
import MainToolbar from '../../components/main-toolbar';
import NavigationToolbar from '../../components/navigation-toolbar';
import ReplayToolbar from '../../components/replay-toolbar';
import HeaderBar from '../../components/header-bar';
import IconButton from '../../components/icon-button';
import HelpOverlay from '../../components/help-overlay';
import TrackingLost from '../../components/tracking-lost';
import Logo from '../../components/logo';
import PleaseWaitDialog from '../../components/please-wait-dialog';
import Gallery from '../../components/gallery';
import Chat from '../../components/chat';
import NearbyQrCodeHint from '../../components/nearby-qr-code-hint';

const MainHeaderBar = ({ headerBarHidden, toggleHelp, goBack, ...props }) => (
  <HeaderBar hidden={headerBarHidden} {...props} className={styles.headerBar}>
    <IconButton
      onClick={goBack}
      size="small"
      icon="back"
      className={styles.headerBarButton}
    />
    <IconButton
      onClick={() => toggleHelp(true)}
      size="small"
      icon="help"
      className={styles.headerBarButton}
    />
  </HeaderBar>
);

export default ({
  admin,
  hasQrCodes,
  speechDisabled,
  trackingLost,
  navigationToolbarActive,
  requestGuideWithToolbar,
  requestGuide,
  dismissGuide,
  guideRequested,
  navigationActive,
  helpVisible,
  ...props
}) => (
  <Fragment>
    <Logo admin={admin} />
    <HelpOverlay visible={helpVisible} {...props} />
    <MainHeaderBar {...props} />
    <PleaseWaitDialog {...props} />
    <TrackingLost hidden={!trackingLost} />
    <NavigationToolbar visible={navigationToolbarActive} {...props} />
    <MainToolbar
      {...props}
      hidden={guideRequested || trackingLost}
      position="right"
    >
      <IconButton icon="menu" onClick={requestGuideWithToolbar} />
      {!speechDisabled && <IconButton icon="poi" onClick={requestGuide} />}
    </MainToolbar>
    <NearbyQrCodeHint enabled={hasQrCodes} />
    <MainToolbar
      {...props}
      hidden={!guideRequested || trackingLost}
      position="right"
    >
      <IconButton icon="abort" onClick={dismissGuide} />
    </MainToolbar>
    <ReplayToolbar />
    <Gallery {...props} />
    <Chat active={guideRequested && !trackingLost} />
  </Fragment>
);
