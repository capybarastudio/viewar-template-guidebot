import React, { Fragment } from 'react';
import styles from './styles.css';
import Logo from '../../components/logo';
import MainToolbar from '../../components/main-toolbar';
import PoiView from '../../components/poi-view';
import PoiEdit from '../../components/poi-edit';
import HeaderBar from '../../components/header-bar';
import HelpOverlay from '../../components/help-overlay';
import IconButton from '../../components/icon-button';
import PleaseWaitDialog from '../../components/please-wait-dialog';
import WalkControl from '../../components/walk-control';
import Toast from '../../components/toast';
import DebugConsole from '../../components/debug-console';
import PromptPopup from '../../components/prompt-popup';
import TrackingLost from '../../components/tracking-lost';
import TargetNotification from '../../components/target-notification';
import TrackingMapProgress from '../../components/tracking-map-progress/tracking-map-progress';

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
      visible={helpVisible}
      {...props}
      deleteVisible={deleteVisible}
      saveVisible={saveVisible}
      undoVisible={undoVisible}
      placePoiVisible={placePoiVisible}
      admin
    />
    <TrackingLost hidden={!trackingLost} />
    <PromptPopup {...props} />

    <IconButton
      icon="save"
      onClick={() => saveProject()}
      className={styles.buttonSave}
      hidden={!saveVisible}
    />

    <TrackingMapProgress
      progress={trackingMapProgress}
      visible={trackingMapProgressVisible}
      message={trackingMapMessage}
    />

    <MainToolbar {...props} position="right" className={styles.toolbar}>
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
    </MainToolbar>

    <TargetNotification />
  </Fragment>
);
