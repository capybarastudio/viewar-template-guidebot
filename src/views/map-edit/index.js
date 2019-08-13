import { withRouter } from 'react-router';
import viewarApi from 'viewar-api';
import {
  compose,
  withState,
  withHandlers,
  withProps,
  lifecycle,
} from 'recompose';
import { waitForUiUpdate, getUiConfigPath } from '../../utils';
import {
  authManager,
  appState,
  storage,
  graphController,
  poiPlacement,
  sceneDirector,
  config,
  waypointPlacement,
} from '../../services';
import {
  MODE_NONE,
  MODE_WAYPOINT_PLACEMENT,
} from '../../services/scene-director/modes';

import render from './template.jsx';

export const goTo = ({ history }) => route => history.push(route);

export const saveProject = ({
  setDeleteVisible,
  showToast,
  setUndoVisible,
  updateTrackingMapProgress,
  setTrackingMapMessage,
  setTrackingMapProgressVisible,
  setTrackingMapProgress,
}) => async () => {
  const tracker = viewarApi.tracker;
  await waypointPlacement.stop();

  setTrackingMapProgress(0);
  setTrackingMapMessage('TrackingMapSaveInProgress');
  setTrackingMapProgressVisible(true);
  tracker.on('trackingMapSaveProgress', updateTrackingMapProgress);
  await storage.activeProject.save();
  tracker.off('trackingMapSaveProgress', updateTrackingMapProgress);
  setTrackingMapProgressVisible(false);

  await waypointPlacement.start();
  setUndoVisible(false);
  setDeleteVisible(!!graphController.selectedWaypoint);
  showToast('AdminProjectSaved', 2000);
};

export const goBack = ({ history }) => async () => {
  if (getUiConfigPath('app.showFeatures')) {
    await viewarApi.cameras.arCamera.hidePointCloud();
  }

  history.push(appState.editBackPath || '/map-view');
};

export const showPrompt = ({
  setPromptVisible,
  setPromptText,
  setPromptAction,
  setPromptButton,
}) => (text, button, action) => {
  setPromptText(text);
  setPromptVisible(true);
  setPromptAction(action);
  setPromptButton(button);
};

export const closePrompt = ({
  goBack,
  promptAction,
  setPromptVisible,
}) => () => {
  switch (promptAction) {
    case 'back':
      goBack();
      break;
  }

  setPromptVisible(false);
};

export const showEdit = ({ setEditVisible }) => () => setEditVisible(true);

export const hideEdit = ({ setEditVisible }) => () => setEditVisible(false);

export const cancelEdit = ({ setEditVisible }) => () => setEditVisible(false);

export const showDialog = ({ setWaitDialogText }) => async text => {
  setWaitDialogText(text);
  await waitForUiUpdate();
};
export const hideDialog = ({ setWaitDialogText }) => async () => {
  setWaitDialogText('');
  await waitForUiUpdate();
};

export const showToast = ({ setToastText }) => (text, timeout) => {
  setToastText(text);
  if (timeout) {
    setTimeout(() => setToastText(''), timeout);
  }
};

export const hideToast = ({ setToastText }) => () => setToastText('');

export const toggleHelp = ({
  helpVisible,
  setHelpVisible,
  setInitialHelp,
}) => visible => {
  const visibility = typeof visible === 'boolean' ? visible : !helpVisible;
  setHelpVisible(visibility);
  setInitialHelp(false);
};

export const updateTracking = ({
  setTrackingLost,
  initialHelp,
  setHelpVisible,
}) => async () => {
  const tracker = viewarApi.tracker;
  let tracking = true;
  if (tracker.loadTrackingMap) {
    tracking = tracker.targets.filter(
      target => target.type === 'map' && target.tracked
    ).length;
  }

  if (tracker.name === 'Quuppa') {
    tracking = tracker.tracking;
  }

  setTrackingLost(!tracking);

  if (tracking) {
    if (appState.showHelp && initialHelp) {
      appState.showHelp = false;
      setHelpVisible(true);
    }
    await sceneDirector.setMode(MODE_WAYPOINT_PLACEMENT);
  } else {
    await sceneDirector.setMode(MODE_NONE);
  }
};

export const deleteWaypoint = ({ setDeleteVisible, setUndoVisible }) => () => {
  graphController.removeObject(graphController.selectedWaypoint);
  setUndoVisible(graphController.canUndo);
  setDeleteVisible(!!graphController.selectedWaypoint);
};

export const updateTrackingMapProgress = ({
  setTrackingMapProgress,
}) => progress => {
  setTrackingMapProgress(progress * 100);
};

export const recordWaypoint = ({
  setDeleteVisible,
  setPlacePoiVisible,
  setSaveVisible,
  setUndoVisible,
  showDialog,
  hideDialog,
}) => async () => {
  await showDialog('Please wait...');

  const initial = graphController.waypoints.length;
  await waypointPlacement.addWaypoint();
  const actual = graphController.waypoints.length;

  if (actual > initial) {
    setPlacePoiVisible(true);
  }
  setUndoVisible(graphController.canUndo);
  await viewarApi.sceneManager.clearSelection();
  setSaveVisible(Object.keys(graphController.waypoints).length);
  await hideDialog();

  setDeleteVisible(!!graphController.selectedWaypoint);
};

export const recordPoi = ({ history }) => async () => {
  history.push('/poi-capture');
};

export const undo = ({
  setPlacePoiVisible,
  setDeleteVisible,
  setSaveVisible,
  setUndoVisible,
}) => async () => {
  await graphController.undo();
  setUndoVisible(graphController.canUndo);
  setSaveVisible(Object.keys(graphController.waypoints).length);
  setPlacePoiVisible(Object.keys(graphController.waypoints).length);
  setDeleteVisible(!!graphController.selectedWaypoint);
};

export const resetTracking = ({ history }) => () =>
  history.push('/init-tracker');

export const init = ({
  setDeleteVisible,
  setPlacePoiVisible,
  setSaveVisible,
  setProject,
  setUndoVisible,
  updateTracking,
  updateTrackingMapProgress,
  setTrackingMapMessage,
  setTrackingMapProgressVisible,
  setTrackingMapProgress,
  showPrompt,
}) => async () => {
  const tracker = viewarApi.tracker;

  if (storage.activeProject) {
    setProject(storage.activeProject);
    setSaveVisible(Object.keys(graphController.waypoints).length);
    setPlacePoiVisible(Object.keys(graphController.waypoints).length);
  }

  setUndoVisible(graphController.canUndo);
  setDeleteVisible(!!graphController.selectedWaypoint);

  await sceneDirector.start(MODE_WAYPOINT_PLACEMENT);

  if (tracker) {
    tracker.on('trackingTargetStatusChanged', updateTracking);
    if (storage.activeProject.trackingMap) {
      if (tracker.name !== 'SixDegrees') {
        // 6d already did a ground confirmation.
        await tracker.reset();
      }

      setTrackingMapProgress(0);
      setTrackingMapMessage('TrackingMapLoadInProgress');
      setTrackingMapProgressVisible(true);
      tracker.on('trackingMapLoadProgress', updateTrackingMapProgress);
      const success = await storage.activeProject.loadTrackingMap();
      tracker.off('trackingMapLoadProgress', updateTrackingMapProgress);
      setTrackingMapProgressVisible(false);

      if (!success) {
        showPrompt('NavigationTrackingMapNotFound', false, 'back');
        return;
      }
    } else {
      if (getUiConfigPath('app.showFeatures')) {
        await viewarApi.cameras.arCamera.showPointCloud();
      }
    }
    updateTracking();
  }
};

export const destroy = ({ updateTracking }) => async () => {
  const tracker = viewarApi.tracker;
  tracker && tracker.off('trackingTargetStatusChanged', updateTracking);

  await waypointPlacement.stop();
};

export default compose(
  withRouter,
  withState('waitDialogText', 'setWaitDialogText', ''),
  withState('toastText', 'setToastText', ''),
  withState('project', 'setProject', null),
  withState('editVisible', 'setEditVisible', ''),
  withState('poi', 'setPoi', ''),
  withState('saveVisible', 'setSaveVisible', false),
  withState('undoVisible', 'setUndoVisible', false),
  withState('placePoiVisible', 'setPlacePoiVisible', false),
  withState('trackingLost', 'setTrackingLost', false),
  withState('helpVisible', 'setHelpVisible', false),
  withState('initialHelp', 'setInitialHelp', true),
  withState('deleteVisible', 'setDeleteVisible', false),
  withState(
    'trackingMapMessage',
    'setTrackingMapMessage',
    'TrackingMapSaveInProgress'
  ),
  withState(
    'trackingMapProgressVisible',
    'setTrackingMapProgressVisible',
    false
  ),
  withState('trackingMapProgress', 'setTrackingMapProgress', 0),
  withState('promptVisible', 'setPromptVisible', false),
  withState('promptText', 'setPromptText', ''),
  withState('promptButton', 'setPromptButton', false),
  withState('promptAction', 'setPromptAction', ''),
  withProps(() => ({
    userId: authManager.user.username,
  })),
  withProps(({ helpVisible, trackingLost, saveVisible }) => ({
    headerBarHidden: helpVisible,
    mainToolbarHidden: trackingLost || helpVisible,
    saveButtonHidden: !saveVisible || trackingLost || helpVisible,
    helpButtonHidden: trackingLost,
  })),
  withHandlers({
    goBack,
  }),
  withHandlers({
    showPrompt,
    closePrompt,
  }),
  withHandlers({
    showEdit,
    hideEdit,
    cancelEdit,
    showDialog,
    hideDialog,
    showToast,
    hideToast,
    toggleHelp,
    updateTracking,
    deleteWaypoint,
    updateTrackingMapProgress,
  }),
  withHandlers({
    goTo,
    saveProject,
    recordWaypoint,
    recordPoi,
    undo,
    resetTracking,
  }),
  withHandlers({
    init,
    destroy,
  }),
  lifecycle({
    async componentDidMount() {
      this.props.init();
    },
    async componentWillUnmount() {
      this.props.destroy();
    },
  })
)(render);
