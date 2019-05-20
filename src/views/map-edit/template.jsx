import React, { Fragment } from 'react';
import styles from './styles.scss';
import {
  Logo,
  MainToolBar,
  PoiEdit,
  HeaderBar,
  HelpOverlay,
  IconButton,
  PleaseWaitDialog,
  Toast,
  PromptPopup,
  TrackingLost,
  TargetNotification,
  TrackingMapProgress,
} from '../../components';

const MapEditHeaderBar = ({
  headerBarHidden,
  toggleHelp,
  goBack,
  ...props
}) => (
  <HeaderBar hidden={headerBarHidden} {...props} className={styles.headerBar}>
    <IconButton
      onClick={() => goBack()}
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
  helpVisible,
  deleteWaypoint,
  deleteVisible,
  saveVisible,
  undoVisible,
  editVisible,
  undo,
  mapInfoVisible,
  recordWaypoint,
  recordPoi,
  goTo,
  placePoiVisible,
  trackingLost,
  saveProject,
  trackingMapProgress,
  trackingMapProgressVisible,
  trackingMapMessage,
  ...props
}) => (
  <Fragment>
    <MapEditHeaderBar {...props} />
    <PleaseWaitDialog {...props} />
    <Toast {...props} />
    <Logo admin />
    <PoiEdit visible={editVisible} {...props} close />
    <HelpOverlay
      hidden={!helpVisible}
      type={'map-edit'}
      deleteVisible={deleteVisible}
      saveVisible={saveVisible}
      undoVisible={undoVisible}
      placePoiVisible={placePoiVisible}
      {...props}
    />
    <TrackingLost hidden={!trackingLost} />
    <PromptPopup {...props} />

    <IconButton
      icon="save"
      onClick={() => saveProject()}
      className={styles.buttonSave}
      hidden={!saveVisible || trackingLost}
    />

    <TrackingMapProgress
      progress={trackingMapProgress}
      visible={trackingMapProgressVisible}
      message={trackingMapMessage}
    />

    <MainToolBar
      {...props}
      position="right"
      className={styles.toolBar}
      hidden={trackingLost}
    >
      <IconButton
        icon="delete"
        onClick={deleteWaypoint}
        className={styles.button}
        hidden={!deleteVisible}
      />
      <IconButton
        icon="undo"
        onClick={() => undo()}
        className={styles.button}
        hidden={!undoVisible}
      />
      <IconButton
        icon="placepoi"
        onClick={() => recordPoi()}
        className={styles.button}
        hidden={!placePoiVisible}
      />
      <IconButton
        icon="placewaypoint"
        onClick={() => recordWaypoint()}
        className={styles.button}
      />
    </MainToolBar>

    <TargetNotification />
  </Fragment>
);
