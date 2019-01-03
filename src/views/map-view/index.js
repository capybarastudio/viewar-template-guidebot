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
import camera from '../../services/camera';
import waitForUiUpdate from '../../utils/wait-for-ui-update';
import authManager from '../../services/auth-manager';
import appState from '../../services/app-state';
import storage from '../../services/storage';
import graphController from '../../services/graph-controller';
import graphVisualizer from '../../services/graph-visualizer';
import sceneDirector from '../../services/scene-director';
import poiPlacement from '../../services/poi-placement';
import { translate } from '../../services/translations';
import config from '../../services/config';
import {
  MODE_POI_PLACEMENT,
  MODE_NONE,
} from '../../services/scene-director/modes';

import render from './template.jsx';

export const goTo = ({ history }) => route => history.push(route);
export const goBack = ({ history }) => route => history.push('/map-selection');

export const deletePoi = ({
  viewarApi: { sceneManager },
  poiPlacement,
  savePoi,
}) => async () => {
  await poiPlacement.removeSelectedPoi();
  await sceneManager.select(null);
  await savePoi();
};

export const deleteProject = ({
  history,
  storage,
  showDialog,
  hideDialog,
}) => async () => {
  await showDialog('Please wait...');
  await storage.activeProject.remove();
  await hideDialog();
  history.push('/map-selection');
};

export const activateProject = ({
  showToast,
  appState,
  storage,
  viewarApi: { http, appConfig },
  showDialog,
  hideDialog,
}) => async () => {
  await showDialog('Please wait...');
  appState.activeProject = storage.activeProject.id;

  const uiConfig = appConfig.uiConfig;
  uiConfig.initialProject = storage.activeProject.id;
  const result = JSON.parse(
    await http.post(
      'http://dev2.viewar.com/templates/custom/guidebot/action:ajaxUpdateUiConfig',
      {
        token: authManager.user.token,
        id: appConfig.pkId,
        uiConfig: JSON.stringify(uiConfig),
      }
    )
  );
  if (result.status === 'ok') {
    await showToast('Map set to active.', 2000);
  } else {
    await showToast(result.error || 'AdminActivateError', 2000);
  }

  await hideDialog();
};

export const goToNavigate = ({
  storage,
  showDialog,
  hideDialog,
  sceneDirector,
  appState,
  history,
}) => async () => {
  appState.qrScanPath = '/navigate';
  appState.navigateBackPath = `/map-view`;
  await showDialog('Please wait...');
  await hideDialog();

  if (storage.activeProject.trackingMap) {
    history.push('/navigate');
  } else {
    await sceneDirector.setMode(MODE_NONE);
    history.push('/init-tracker');
  }
};

export const goToMapEdit = ({
  showDialog,
  hideDialog,
  sceneDirector,
  storage,
  appState,
  history,
}) => async () => {
  appState.qrScanPath = '/map-edit';
  appState.editBackPath = `/map-view`;
  await showDialog('Please wait...');
  await hideDialog();

  if (storage.activeProject.trackingMap) {
    history.push('/map-edit');
  } else {
    await sceneDirector.setMode(MODE_NONE);
    history.push('/init-tracker');
  }
};

export default compose(
  withRouter,
  withState('promptVisible', 'setPromptVisible', false),
  withState('promptAction', 'setPromptAction', ''),
  withState('promptText', 'setPromptText', ''),
  withState('promptButton', 'setPromptButton', ''),
  withState('waitDialogText', 'setWaitDialogText', ''),
  withState('toastText', 'setToastText', ''),
  withState('editVisible', 'setEditVisible', ''),
  withState('poiListVisible', 'setPoiListVisible', false),
  withState('poi', 'setPoi', ''),
  withState('lastMode', 'setLastMode', ''),
  withProps({
    viewarApi,
    appState,
    config,
    graphController,
    poiPlacement,
    storage,
    camera,
    graphVisualizer,
    sceneDirector,
    authManager,
  }),
  withProps(({ config, authManager, storage }) => ({
    activateMapEnabled: !config.app.demo,
    userId: authManager.user.username,
    projectId: storage.activeProject,
  })),
  withHandlers({
    goTo,
    goBack,
    togglePoiList: ({ poiListVisible, setPoiListVisible }) => () =>
      setPoiListVisible(!poiListVisible),
    showEdit: ({ setEditVisible }) => () => setEditVisible(true),
    hideEdit: ({ setEditVisible }) => () => setEditVisible(false),
    cancelEdit: ({ setEditVisible }) => () => setEditVisible(false),
    showPrompt: ({
      setPromptVisible,
      setPromptText,
      setPromptAction,
      setPromptButton,
    }) => (text, button = 'confirm', action = '') => {
      setPromptText(text);
      setPromptVisible(true);
      setPromptAction(action);
      setPromptButton(button);
    },
    closePrompt: ({ setPromptVisible }) => () => setPromptVisible(false),
  }),
  withHandlers({
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
  }),
  withHandlers({
    activatePoiPlacement: ({
      sceneDirector,
      showDialog,
      hideDialog,
    }) => async () => {
      await showDialog('Please wait...');
      await sceneDirector.setMode(MODE_POI_PLACEMENT);
      await hideDialog();
    },
    savePoi: ({ storage, showDialog, hideDialog }) => async () => {
      await showDialog('Please wait...');
      await storage.activeProject.save();
      await hideDialog();
    },
    editPoi: ({ setPoi, setEditVisible, setPoiListVisible }) => item => {
      setPoi(item);
      setPoiListVisible(false);
      setEditVisible(true);
    },
  }),
  withHandlers({
    deleteProject,
    activateProject,
    goToNavigate,
    goToMapEdit,
    deletePoi,
  }),
  withHandlers({
    openActivatePrompt: ({ showPrompt }) => () =>
      showPrompt(
        translate('AdminActivateConfirmation', false),
        translate('AdminActivate', false),
        'activate'
      ),
    openDeletePrompt: ({ showPrompt }) => () =>
      showPrompt(
        translate('AdminDeleteConfirmation', false),
        translate('AdminDelete', false),
        'delete'
      ),
    openDeletePoiPrompt: ({ showPrompt }) => () =>
      showPrompt(
        translate('AdminDeletePoiConfirmation', false),
        translate('AdminDelete', false),
        'deletePoi'
      ),
    onPromptConfirm: ({
      promptAction,
      closePrompt,
      deletePoi,
      deleteProject,
      activateProject,
    }) => async () => {
      closePrompt();
      switch (promptAction) {
        case 'delete':
          await deleteProject();
          break;
        case 'activate':
          await activateProject();
          break;
        case 'deletePoi':
          await deletePoi();
          break;
      }
    },
    updateSelection: ({ setPoi, graphController }) => newSelection => {
      setPoi(null);

      if (newSelection) {
        const selection =
          graphController.pois.find(poi => poi.id === newSelection.id) || null;
        if (selection) {
          setPoi(selection);
        }
      }
    },
  }),
  lifecycle({
    async componentDidMount() {
      const {
        showDialog,
        hideDialog,
        updateSelection,
        setLastMode,
        camera,
        viewarApi: { sceneManager },
        sceneDirector,
        graphVisualizer,
      } = this.props;
      await showDialog('Please wait...');
      setLastMode(camera.mode);

      await camera.setMode('Perspective');
      graphVisualizer.clipping = false;
      graphVisualizer.selectable = false;
      await sceneDirector.start(MODE_POI_PLACEMENT);
      graphVisualizer.zoomOutAfterRender();
      updateSelection(sceneManager.selection);
      sceneManager.on('selectionChanged', updateSelection);
      await hideDialog();
    },
    async componentWillUnmount() {
      const {
        graphVisualizer,
        sceneDirector,
        updateSelection,
        viewarApi: { sceneManager },
        camera,
        lastMode,
      } = this.props;
      await camera.setMode(lastMode);
      graphVisualizer.clipping = true;
      graphVisualizer.selectable = true;
      sceneManager.off('selectionChanged', updateSelection);
    },
  })
)(render);
