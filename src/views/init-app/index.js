import React from 'react';
import { withRouter } from 'react-router';
import {
  compose,
  lifecycle,
  withState,
  withHandlers,
  withProps,
} from 'recompose';
import guide from 'viewar-guide';
import viewarApi from 'viewar-api';
import {
  appState,
  authManager,
  objectAnimation,
  sceneDirector,
  storage,
  camera,
  graphController,
  config,
} from '../../services';
import { MODE_NAVIGATION } from '../../services/scene-director/modes';
import {
  getUiConfigPath,
  waitForUiUpdate,
  queueSceneUpdate,
  resolveModel,
} from '../../utils';

import render from './template.jsx';

export const goTo = ({ history }) => route => history.push(route);

export const goToLogin = ({ history }) => () =>
  history.push(getUiConfigPath('app.demo') ? '/map-selection' : '/login');

export const showErrorDialog = ({ setErrorDialogText }) => async text => {
  setErrorDialogText(text);
  await waitForUiUpdate();
};

export const showDialog = ({ setWaitDialogText }) => async text => {
  setWaitDialogText(text);
  await waitForUiUpdate();
};

export const hideDialog = ({ setWaitDialogText }) => async () => {
  setWaitDialogText('');
  await waitForUiUpdate();
};

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

export const onPromptConfirm = ({ closePrompt }) => closePrompt;

export const loadProject = ({
  showPrompt,
  showDialog,
  hideDialog,
  userId,
  history,
}) => async () => {
  await showDialog('Please wait...', true);
  const index = await storage.fetchProjectIndexFor(userId);

  let project;
  if (appState.activeProject) {
    if (Object.keys(index).indexOf(appState.activeProject) > -1) {
      project = await storage.fetchProject(userId, appState.activeProject);
    } else {
      await hideDialog();
      showPrompt('HomeInvalidProject', 'OK');
      return;
    }
  } else {
    if (Object.keys(index).length) {
      project = await storage.fetchProject(userId, Object.keys(index)[0]);
    }
  }

  if (project) {
    await project.open();
    await hideDialog();

    if (project.trackingMap) {
      history.push('/mode-selection');
    } else {
      history.push('/init-tracker');
    }
  } else {
    await hideDialog();
    showPrompt('HomeNoProjects', 'OK');
  }
};

export const downloadModels = ({ setProgress }) => async ids => {
  const models = [];

  for (let { id, fallback } of ids) {
    const model =
      (await resolveModel(id)) || (fallback && (await resolveModel(fallback)));
    if (model) {
      models.push(model);
    }
  }

  const count = {
    total: models.length,
    current: 0,
  };

  const updateProgress = (id, progress) => {
    if (!isNaN(parseFloat(progress))) {
      const totalProgress =
        (count.current / count.total + (1 / count.total) * (progress / 100)) *
        100;
      setProgress(totalProgress);
    }
  };

  viewarApi.modelManager.on('transferProgress', updateProgress);
  for (let model of models) {
    setProgress((count.current / count.total) * 100);
    await model.download();
    count.current++;
  }
  setProgress((count.current / count.total) * 100);
  viewarApi.modelManager.off('transferProgress', updateProgress);
};

export const init = ({
  setLoading,
  downloadModels,
  showErrorDialog,
}) => async () => {
  const validTrackers = [
    'Placenote',
    'ARKit',
    'ARCore',
    'Quuppa',
    'SixDegrees',
  ];

  // Show error message if every tracker from the list is not existing.
  if (viewarApi.coreInterface.platform !== 'Emscripten') {
    if (validTrackers.every(trackerName => !viewarApi.trackers[trackerName])) {
      await showErrorDialog('ERROR: No valid tracker found.');
      return;
    }
  }

  const models = Object.entries(getUiConfigPath('models'))
    .map(([key, id]) => ({
      id,
      fallback: config.fallbackModels[key],
    }))
    .filter(({ id }) => typeof id === 'string' && !!id);

  for (let model of objectAnimation.models) {
    models.push({ id: model });
  }

  await downloadModels(models);

  await viewarApi.cameras.perspectiveCamera.setBackgroundMaterial('o6zutucoff');

  if (viewarApi.coreInterface.platform === 'Emscripten') {
    await camera.init('VR');
  } else {
    await camera.init('AR');
  }

  await sceneDirector.stop();
  guide.setup({
    viewarApi,
    // queueSceneUpdate,
    getPois: () => graphController.pois,
    useExternalUpdateLoop: true,
    modes: [MODE_NAVIGATION],
    config: JSON.parse(JSON.stringify(config)),
    findPath: graphController.findPath,
  });

  await guide.init();
  await objectAnimation.init();

  appState.qrScanPath = null;
  appState.modeBackPath = null;

  if (storage.activeProject) {
    await storage.activeProject.close();
  }

  setLoading(false);
};

export default compose(
  withRouter,
  withProps(() => ({
    userId: authManager.user.username,
  })),
  withState('errorDialogText', 'setErrorDialogText', ''),
  withState('waitDialogText', 'setWaitDialogText', ''),
  withState('progress', 'setProgress', 0),
  withState('loading', 'setLoading', true),
  withState('promptVisible', 'setPromptVisible', false),
  withState('promptAction', 'setPromptAction', ''),
  withState('promptText', 'setPromptText', ''),
  withState('promptButton', 'setPromptButton', ''),
  withHandlers({
    goTo,
    showErrorDialog,
    showDialog,
    hideDialog,
    showPrompt,
    closePrompt,
    goToLogin,
  }),
  withHandlers({
    onPromptConfirm,
    loadProject,
    downloadModels,
  }),
  withHandlers({
    init,
  }),
  lifecycle({
    componentDidMount() {
      this.props.init();
    },
  })
)(render);
