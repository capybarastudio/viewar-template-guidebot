import React from 'react';
import { withRouter } from 'react-router';
import waitForUiUpdate from '../../utils/wait-for-ui-update';
import {
  compose,
  lifecycle,
  withState,
  withHandlers,
  withProps,
} from 'recompose';
import viewarApi, {
  sceneManager,
  modelManager,
  arCamera,
  vrCamera,
  coreInterface,
} from 'viewar-api';
import appState from '../../services/app-state';
import authManager from '../../services/auth-manager';
import objectAnimation from '../../services/object-animation';
import sceneDirector from '../../services/scene-director';
import storage from '../../services/storage';
import guide from 'viewar-guide';
import { translate } from '../../services/translations';
import camera from '../../services/camera';
import config from '../../services/config';
import queueSceneUpdate from '../../utils/queue-scene-update';
import graphController from '../../services/graph-controller';
import { MODE_NAVIGATION } from '../../services/scene-director/modes';

import resolveModel from '../../utils/resolve-model';

import render from './template.jsx';

export const goTo = ({ history }) => route => history.push(route);
export const goToLogin = ({ history, config }) => () =>
  history.push(config.app.demo ? '/map-selection' : '/login');

export default compose(
  withRouter,
  withProps({
    viewarApi,
    appState,
    authManager,
    userId: authManager.user.username,
    storage,
    guide,
    config,
  }),
  withState('waitDialogText', 'setWaitDialogText', ''),
  withState('progress', 'setProgress', 0),
  withState('loading', 'setLoading', true),
  withState('promptVisible', 'setPromptVisible', false),
  withState('promptAction', 'setPromptAction', ''),
  withState('promptText', 'setPromptText', ''),
  withState('promptButton', 'setPromptButton', ''),
  withHandlers({
    goTo,
    showDialog: ({ setWaitDialogText }) => async text => {
      setWaitDialogText(text);
      await waitForUiUpdate();
    },
    hideDialog: ({ setWaitDialogText }) => async () => {
      setWaitDialogText('');
      await waitForUiUpdate();
    },
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
    goToLogin,
  }),
  withHandlers({
    onPromptConfirm: ({ closePrompt }) => closePrompt,
    loadProject: ({
      showPrompt,
      viewarApi: { modelManager, coreInterface },
      showDialog,
      hideDialog,
      userId,
      initialProject,
      appState,
      storage,
      history,
    }) => async () => {
      await showDialog('Please wait...', true);
      const index = await storage.fetchProjectIndexFor(userId);

      let project;
      if (
        appState.activeProject &&
        Object.keys(index).indexOf(appState.activeProject) > -1
      ) {
        project = await storage.fetchProject(userId, appState.activeProject);
      } else {
        if (Object.keys(index).length) {
          project = await storage.fetchProject(userId, Object.keys(index)[0]);
        }
      }

      if (project) {
        await project.open();
        await hideDialog();

        if (project.trackingMap) {
          history.push('/navigate');
        } else {
          history.push('/init-tracker');
        }
      } else {
        await hideDialog();
        showPrompt(translate('HomeNoProjects', false), translate('OK', false));
      }
    },
    downloadModels: ({ setProgress }) => async ids => {
      const models = [];

      for (let { id, fallback } of ids) {
        const model =
          (await resolveModel(id)) ||
          (fallback && (await resolveModel(fallback)));
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
            (count.current / count.total +
              (1 / count.total) * (progress / 100)) *
            100;
          setProgress(totalProgress);
        }
      };

      modelManager.on('transferProgress', updateProgress);
      for (let model of models) {
        setProgress((count.current / count.total) * 100);
        await model.download();
        count.current++;
      }
      setProgress((count.current / count.total) * 100);
      modelManager.off('transferProgress', updateProgress);
    },
  }),
  lifecycle({
    async componentDidMount() {
      const {
        setLoading,
        downloadModels,
        viewarApi,
        guide,
        config,
      } = this.props;
      const { cameras, coreInterface } = viewarApi;

      const models = Object.entries(config.models)
        .map(([key, id]) => ({
          id,
          fallback: config.fallbackModels[key],
        }))
        .filter(({ id }) => typeof id === 'string' && !!id);

      for (let model of objectAnimation.models) {
        models.push({ id: model });
      }

      await downloadModels(models);

      await cameras.perspectiveCamera.setBackgroundMaterial('o6zutucoff');

      if (coreInterface.platform === 'Emscripten') {
        await camera.init('VR');
      } else {
        await camera.init('AR');
      }

      await sceneDirector.stop();
      guide.setup({
        viewarApi,
        queueSceneUpdate,
        getPois: () => graphController.pois,
        useExternalUpdateLoop: true,
        modes: [MODE_NAVIGATION],
        config: JSON.parse(JSON.stringify(config)),
        findPath: graphController.findPath,
      });

      await guide.init();
      await objectAnimation.init();

      // const element = document.getElementById('app-root');
      // document.body.removeChild(element);
      // await api.sceneManager.insertModel(api.modelManager.getModelFromRepository('20'))
      // await objectAnimation.start();
      // setTimeout(() => api.cameras.perspectiveCamera.zoomToFit(), 1000);

      appState.qrScanPath = null;
      appState.navigateBackPath = null;
      if (storage.activeProject) {
        await storage.activeProject.close();
      }

      setLoading(false);
    },
  })
)(render);
