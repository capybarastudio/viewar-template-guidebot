import { withRouter } from 'react-router';
import viewarApi from 'viewar-api';
import {
  compose,
  withState,
  withHandlers,
  withProps,
  lifecycle,
} from 'recompose';
import {
  camera,
  authManager,
  appState,
  storage,
  graphController,
  graphVisualizer,
  sceneDirector,
  poiPlacement,
  config,
} from '../../services';
import { waitForUiUpdate, getUiConfigPath } from '../../utils';
import {
  MODE_POI_PLACEMENT,
  MODE_NONE,
} from '../../services/scene-director/modes';

import render from './template.jsx';

export const goTo = ({ history }) => route => history.push(route);

export const goBack = ({ history }) => route => history.push('/map-selection');

export const deletePoi = ({ savePoi }) => async () => {
  await poiPlacement.removeSelectedPoi();
  await viewarApi.sceneManager.select(null);
  await savePoi();
};

export const deleteProject = ({
  history,
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
  showDialog,
  hideDialog,
}) => async () => {
  await showDialog('Please wait...');
  appState.activeProject = storage.activeProject.id;

  const uiConfig = viewarApi.appConfig.uiConfig;
  uiConfig.initialProject = storage.activeProject.id;
  const result = JSON.parse(
    await viewarApi.http.post(
      'http://dev2.viewar.com/templates/custom/guidebot/action:ajaxUpdateUiConfig',
      {
        token: authManager.user.token,
        id: viewarApi.appConfig.pkId,
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
  showDialog,
  hideDialog,
  history,
}) => async () => {
  appState.qrScanPath = '/mode-selection';
  appState.modeBackPath = `/map-view`;
  await showDialog('Please wait...');
  await hideDialog();

  if (storage.activeProject.trackingMap) {
    history.push('/mode-selection');
  } else {
    await sceneDirector.setMode(MODE_NONE);
    history.push('/init-tracker');
  }
};

export const goToMapEdit = ({
  showDialog,
  hideDialog,
  history,
}) => async () => {
  appState.qrScanPath = '/map-edit';
  appState.editBackPath = `/map-view`;
  appState.showHelp = true;
  await showDialog('Please wait...');
  await hideDialog();

  if (
    storage.activeProject.trackingMap &&
    viewarApi.tracker.name !== 'SixDegrees'
  ) {
    history.push('/map-edit');
  } else {
    await sceneDirector.setMode(MODE_NONE);
    history.push('/init-tracker');
  }
};

export const togglePoiList = ({ poiListVisible, setPoiListVisible }) => () =>
  setPoiListVisible(!poiListVisible);

export const showEdit = ({ setEditVisible }) => () => setEditVisible(true);

export const hideEdit = ({ setEditVisible }) => () => setEditVisible(false);

export const cancelEdit = ({ setEditVisible }) => () => setEditVisible(false);

export const showPrompt = ({
  setPromptVisible,
  setPromptText,
  setPromptAction,
  setPromptButton,
}) => (text, button = 'confirm', action = '') => {
  setPromptText(text);
  setPromptVisible(true);
  setPromptAction(action);
  setPromptButton(button);
};

export const closePrompt = ({ setPromptVisible }) => () =>
  setPromptVisible(false);

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

export const activatePoiPlacement = ({
  showDialog,
  hideDialog,
}) => async () => {
  await showDialog('Please wait...');
  await sceneDirector.setMode(MODE_NONE);
  await sceneDirector.setMode(MODE_POI_PLACEMENT);
  await hideDialog();
};

export const savePoi = ({ showDialog, hideDialog }) => async () => {
  await showDialog('Please wait...');
  await storage.activeProject.save();
  await hideDialog();
};

export const editPoi = ({
  setPoi,
  setEditVisible,
  setPoiListVisible,
}) => item => {
  setPoi(item);
  setPoiListVisible(false);
  setEditVisible(true);
};

export const openActivatePrompt = ({ showPrompt }) => () =>
  showPrompt('AdminActivateConfirmation', 'AdminActivate', 'activate');

export const openDeletePrompt = ({ showPrompt }) => () =>
  showPrompt('AdminDeleteConfirmation', 'AdminDelete', 'delete');

export const openDeletePoiPrompt = ({ showPrompt }) => () =>
  showPrompt('AdminDeletePoiConfirmation', 'AdminDelete', 'deletePoi');

export const onPromptConfirm = ({
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
};

export const updateSelection = ({ setPoi }) => newSelection => {
  setPoi(null);

  if (newSelection) {
    const selection =
      graphController.pois.find(poi => poi.id === newSelection.id) || null;
    if (selection) {
      setPoi(selection);
    }
  }
};

export const init = ({
  showDialog,
  hideDialog,
  updateSelection,
  setLastMode,
}) => async () => {
  await showDialog('Please wait...');
  setLastMode(camera.mode);

  await camera.setMode('Perspective');
  graphVisualizer.clipping = false;
  graphVisualizer.selectable = false;

  await sceneDirector.start(MODE_POI_PLACEMENT);
  graphVisualizer.zoomOutAfterRender();

  updateSelection(viewarApi.sceneManager.selection);
  viewarApi.sceneManager.on('selectionChanged', updateSelection);

  await hideDialog();
};

export const destroy = ({ updateSelection, lastMode }) => async () => {
  await camera.setMode(lastMode);
  graphVisualizer.clipping = true;
  graphVisualizer.selectable = true;
  viewarApi.sceneManager.off('selectionChanged', updateSelection);
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
  withProps(() => ({
    activateMapEnabled: !getUiConfigPath('app.demo'),
    userId: authManager.user.username,
    projectId: storage.activeProject,
  })),
  withHandlers({
    goTo,
    goBack,
    togglePoiList,
    showEdit,
    hideEdit,
    cancelEdit,
    showPrompt,
    closePrompt,
  }),
  withHandlers({
    showDialog,
    hideDialog,
    showToast,
    hideToast,
  }),
  withHandlers({
    activatePoiPlacement,
    savePoi,
    editPoi,
  }),
  withHandlers({
    deleteProject,
    activateProject,
    goToNavigate,
    goToMapEdit,
    deletePoi,
  }),
  withHandlers({
    openActivatePrompt,
    openDeletePrompt,
    openDeletePoiPrompt,
    onPromptConfirm,
    updateSelection,
  }),
  withHandlers({
    init,
    destroy,
  }),
  lifecycle({
    componentDidMount() {
      this.props.init();
    },
    componentWillUnmount() {
      this.props.destroy();
    },
  })
)(render);
