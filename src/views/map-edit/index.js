import React from 'react';
import { withRouter } from 'react-router';
import viewarApi from 'viewar-api';
import {
  compose,
  withState,
  withHandlers,
  withProps,
  lifecycle,
} from 'recompose';
import waitForUiUpdate from '../../utils/wait-for-ui-update';
import authManager from '../../services/auth-manager';
import appState from '../../services/app-state';
import storage from '../../services/storage';
import graphController from '../../services/graph-controller';
import poiPlacement from '../../services/poi-placement';
import sceneDirector from '../../services/scene-director';
import config from '../../services/config';
import waypointPlacement from '../../services/waypoint-placement';
import {
  MODE_NONE,
  MODE_WAYPOINT_PLACEMENT,
  MODE_POI_PLACEMENT,
} from '../../services/scene-director/modes';

import render from './template.jsx';

export const goTo = ({ history }) => route => history.push(route);

export const saveProject = ({
  setDeleteVisible,
  graphController,
  waypointPlacement,
  showToast,
  viewarApi: { tracker },
  storage,
  setUndoVisible,
  updateTrackingMapProgress,
  setTrackingMapMessage,
  setTrackingMapProgressVisible,
  setTrackingMapProgress,
}) => async () => {
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

export const goBack = ({ config, history, appState }) => async () => {
  if (config.app.showFeatures) {
    await viewarApi.cameras.arCamera.hidePointCloud();
  }

  history.push(appState.editBackPath || '/map-view');
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
  withProps({
    config,
    viewarApi,
    waypointPlacement,
    appState,
    storage,
    poiPlacement,
    graphController,
    sceneDirector,
    userId: authManager.user.username,
  }),
  withHandlers({
    goBack,
  }),
  withState('promptVisible', 'setPromptVisible', false),
  withState('promptText', 'setPromptText', ''),
  withState('promptButton', 'setPromptButton', false),
  withState('promptAction', 'setPromptAction', ''),
  withHandlers({
    showPrompt: ({
      setPromptVisible,
      setPromptText,
      setPromptAction,
      setPromptButton,
    }) => (text, button, action) => {
      setPromptText(text);
      setPromptVisible(true);
      setPromptAction(action);
      setPromptButton(button);
    },
    closePrompt: ({ goBack, promptAction, setPromptVisible }) => () => {
      switch (promptAction) {
        case 'back':
          goBack();
          break;
      }

      setPromptVisible(false);
    },
  }),
  withHandlers({
    showEdit: ({ setEditVisible }) => () => setEditVisible(true),
    hideEdit: ({ setEditVisible }) => () => setEditVisible(false),
    cancelEdit: ({ setEditVisible }) => () => setEditVisible(false),
    showDialog: ({ setWaitDialogText }) => async text => {
      setWaitDialogText(text);
      await waitForUiUpdate();
    },
    hideDialog: ({ setWaitDialogText }) => async () => {
      setWaitDialogText('');
      await waitForUiUpdate();
    },
    showToast: ({ setToastText }) => (text, timeout) => {
      setToastText(text);
      if (timeout) {
        setTimeout(() => setToastText(''), timeout);
      }
    },
    hideToast: ({ setToastText }) => () => setToastText(''),
    toggleHelp: ({
      helpVisible,
      setHelpVisible,
      setInitialHelp,
    }) => visible => {
      const visibility = typeof visible === 'boolean' ? visible : !helpVisible;
      setHelpVisible(visibility);
      setInitialHelp(false);
    },
    updateTracking: ({
      setTrackingLost,
      viewarApi: { tracker },
      initialHelp,
      setHelpVisible,
    }) => async () => {
      let tracking = true;
      if (tracker.loadTrackingMap) {
        tracking = tracker.targets.filter(
          target => target.type === 'map' && target.tracked
        ).length;
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
    },
    deleteWaypoint: ({
      setDeleteVisible,
      setUndoVisible,
      graphController,
    }) => () => {
      graphController.removeObject(graphController.selectedWaypoint);
      setUndoVisible(graphController.canUndo);
      setDeleteVisible(!!graphController.selectedWaypoint);
    },
    updateTrackingMapProgress: ({ setTrackingMapProgress }) => progress => {
      setTrackingMapProgress(progress * 100);
    },
  }),
  withHandlers({
    goTo,
    saveProject,
    recordWaypoint: ({
      setDeleteVisible,
      setPlacePoiVisible,
      setSaveVisible,
      graphController,
      setUndoVisible,
      sceneDirector,
      showDialog,
      hideDialog,
      viewarApi: { sceneManager },
      waypointPlacement,
      appState,
    }) => async () => {
      await showDialog('Please wait...');

      const initial = graphController.waypoints.length;
      await waypointPlacement.addWaypoint();
      const actual = graphController.waypoints.length;

      if (actual > initial) {
        setPlacePoiVisible(true);
      }
      setUndoVisible(graphController.canUndo);
      await sceneManager.clearSelection();
      setSaveVisible(Object.keys(graphController.waypoints).length);
      await hideDialog();

      setDeleteVisible(!!graphController.selectedWaypoint);
    },
    recordPoi: ({ history }) => async () => {
      history.push('/poi-capture');
    },
    undo: ({
      setPlacePoiVisible,
      setDeleteVisible,
      setSaveVisible,
      graphController,
      setUndoVisible,
      appState,
    }) => async () => {
      await graphController.undo();
      setUndoVisible(graphController.canUndo);
      setSaveVisible(Object.keys(graphController.waypoints).length);
      setPlacePoiVisible(Object.keys(graphController.waypoints).length);
      setDeleteVisible(!!graphController.selectedWaypoint);
    },
    resetTracking: ({ history }) => () => history.push('/init-tracker'),
  }),
  lifecycle({
    async componentDidMount() {
      const {
        config,
        setDeleteVisible,
        setPlacePoiVisible,
        setSaveVisible,
        sceneDirector,
        viewarApi: { tracker },
        storage,
        setProject,
        graphController,
        setUndoVisible,
        updateTracking,
        updateTrackingMapProgress,
        setTrackingMapMessage,
        setTrackingMapProgressVisible,
        setTrackingMapProgress,
        showPrompt,
      } = this.props;

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
          await tracker.reset();

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
          if (config.app.showFeatures) {
            await viewarApi.cameras.arCamera.showPointCloud();
          }
        }
        updateTracking();
      }
    },
    async componentWillUnmount() {
      const {
        waypointPlacement,
        viewarApi: { tracker },
        updateTracking,
      } = this.props;

      tracker && tracker.off('trackingTargetStatusChanged', updateTracking);

      await waypointPlacement.stop();
    },
  })
)(render);
