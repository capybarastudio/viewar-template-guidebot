import React, { Fragment } from 'react';
import styles from './styles.scss';

import {
  MainToolBar,
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
  SkipPoiButton,
  TourToolbar,
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
  tourToolBarActive,
  toggleTourToolBar,
  requestGuide,
  dismissGuide,
  navigationActive,
  helpVisible,
  trackingMapProgress,
  trackingMapProgressVisible,
  trackingMapMessage,
  skipPoi,
  nextPoi,
  selectPoi,
  poiIndex,
  pois,
  tourName,
  resetGuidePosition,
  goToPerspective,
  poi,
  ...props
}) => (
  <Fragment>
    <Logo admin={admin} />
    <HelpOverlay hidden={!helpVisible} type={'tour'} {...props} />
    <MainHeaderBar {...props} />
    <PleaseWaitDialog {...props} />
    <TrackingLost hidden={!trackingLost || helpVisible} />
    <TourToolbar
      title={tourName}
      visible={tourToolBarActive}
      pois={pois}
      onSelect={selectPoi}
    />
    <PromptPopup {...props} />

    <TrackingMapProgress
      progress={trackingMapProgress}
      visible={trackingMapProgressVisible}
      message={trackingMapMessage}
    />

    <DebugStateMachine />

    <MainToolBar
      {...props}
      hidden={trackingLost || helpVisible}
      className={styles.toolBar}
      position="right"
    >
      <IconButton
        icon="menu"
        className={styles.button}
        onClick={toggleTourToolBar}
        active={tourToolBarActive}
      />
    </MainToolBar>

    <MainToolBar
      {...props}
      hidden={trackingLost || helpVisible || tourToolBarActive}
      className={styles.toolBar}
      position="left"
    >
      <IconButton
        icon="pause"
        className={styles.button}
        onClick={goToPerspective}
      />
      {/* <IconButton
        icon="reset"
        className={styles.button}
        onClick={resetGuidePosition}
      /> */}
    </MainToolBar>

    <NearbyQrCodeHint enabled={hasQrCodes && !helpVisible} />
    <ReplayToolBar />
    <Gallery {...props} />
    <Chat
      className={styles.chat}
      active={!trackingLost && !helpVisible && !tourToolBarActive}
    />

    {nextPoi && !helpVisible && (
      <SkipPoiButton
        onClick={skipPoi}
        poi={nextPoi}
        label={poiIndex === -1 ? 'TourStart' : 'TourSkipPoi'}
      />
    )}
  </Fragment>
);
