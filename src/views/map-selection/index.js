import React from 'react';
import { withRouter } from 'react-router';
import {
  compose,
  withState,
  withHandlers,
  withProps,
  lifecycle,
} from 'recompose';
import waitForUiUpdate from '../../utils/wait-for-ui-update';
import viewarApi from 'viewar-api';
import authManager from '../../services/auth-manager';
import storage from '../../services/storage';
import appState from '../../services/app-state';
import config from '../../services/config';
import sceneDirector from '../../services/scene-director';

import render from './template.jsx';

export const goTo = ({ history }) => route => history.push(route);
export const goBack = ({ history }) => route => history.push('/');

export const loadProject = ({
  showDialog,
  hideDialog,
  storage,
  userId,
  history,
  appState,
}) => async newProjectId => {
  await showDialog('Please wait...');

  await storage.fetchProjectIndexFor(userId);
  const project = await storage.fetchProject(userId, newProjectId);
  project && (await project.open());

  await hideDialog();
  appState.qrScanPath = `/map-view`;
  appState.editBackPath = '/map-view';
  history.push(`/map-view`);
};

export const createNewProject = ({
  storage,
  history,
  appState,
}) => async () => {
  storage.activeProject && (await storage.activeProject.close());
  history.push('/map-creation');
};

export default compose(
  withRouter,
  withState('waitDialogText', 'setWaitDialogText', ''),
  withState('projects', 'setProjects', []),
  withState('projectId', 'setProjectId', ''),
  withProps({
    storage,
    config,
    viewarApi,
    appState,
    sceneDirector,
    userId: authManager.user.username,
    loadDialogVisible: true,
    sortByName: projects =>
      Object.values(projects).sort((a, b) => {
        const aName = (a.info.name || a.id).toUpperCase();
        const bName = (b.info.name || b.id).toUpperCase();
        return aName < bName ? -1 : aName > bName ? 1 : 0;
      }),
  }),
  withHandlers({
    goTo,
    goBack,
    showDialog: ({ setWaitDialogText }) => async text => {
      setWaitDialogText(text);
      await waitForUiUpdate();
    },
    hideDialog: ({ setWaitDialogText }) => async () => {
      setWaitDialogText('');
      await waitForUiUpdate();
    },
  }),
  withHandlers({
    loadProject,
    createNewProject,
  }),
  lifecycle({
    async componentDidMount() {
      const {
        viewarApi: { appConfig, trackers },
        userId,
        storage,
        setProjects,
        setProjectId,
        sceneDirector,
        sortByName,
      } = this.props;

      const tracker = Object.values(trackers)[0];
      tracker && (await tracker.deactivate());
      let projects = await storage.fetchProjectIndexFor(userId);
      projects = sortByName(projects);
      setProjects(projects);

      let activeProjectId = (appConfig.uiConfig || {}).initialProject;
      if (
        projects.length &&
        (!activeProjectId ||
          projects.findIndex(project => project.id === activeProjectId) === -1)
      ) {
        activeProjectId = projects[0].id;
      }
      setProjectId(activeProjectId);
      await sceneDirector.stop();
    },
  })
)(render);
