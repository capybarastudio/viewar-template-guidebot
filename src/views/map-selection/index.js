import { withRouter } from 'react-router';
import {
  compose,
  withState,
  withHandlers,
  withProps,
  lifecycle,
} from 'recompose';
import { waitForUiUpdate, getUiConfigPath } from '../../utils';
import viewarApi from 'viewar-api';
import {
  authManager,
  storage,
  appState,
  config,
  sceneDirector,
} from '../../services';

import render from './template.jsx';

const sortByName = projects =>
  Object.values(projects).sort((a, b) => {
    const aName = (a.info.name || a.id).toUpperCase();
    const bName = (b.info.name || b.id).toUpperCase();
    return aName < bName ? -1 : aName > bName ? 1 : 0;
  });

export const goTo = ({ history }) => route => history.push(route);

export const goBack = ({ history }) => route => history.push('/');

export const loadProject = ({
  showDialog,
  hideDialog,
  userId,
  history,
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

export const createNewProject = ({ history }) => async () => {
  appState.showHelp = true;
  storage.activeProject && (await storage.activeProject.close());
  history.push('/map-creation');
};

export const showDialog = ({ setWaitDialogText }) => async text => {
  setWaitDialogText(text);
  await waitForUiUpdate();
};

export const hideDialog = ({ setWaitDialogText }) => async () => {
  setWaitDialogText('');
  await waitForUiUpdate();
};

export const init = ({
  userId,
  setProjects,
  setProjectId,
  sortByName,
}) => async () => {
  const tracker = viewarApi.tracker;

  tracker && (await tracker.deactivate());
  let projects = await storage.fetchProjectIndexFor(userId);
  projects = sortByName(projects);
  setProjects(projects);

  let activeProjectId = getUiConfigPath('app.initialProject');
  if (
    projects.length &&
    (!activeProjectId ||
      projects.findIndex(project => project.id === activeProjectId) === -1)
  ) {
    activeProjectId = projects[0].id;
  }
  setProjectId(activeProjectId);

  await sceneDirector.stop();
};

export default compose(
  withRouter,
  withState('waitDialogText', 'setWaitDialogText', ''),
  withState('projects', 'setProjects', []),
  withState('projectId', 'setProjectId', ''),
  withProps(() => ({
    userId: authManager.user.username,
    loadDialogVisible: true,
    sortByName,
  })),
  withHandlers({
    goTo,
    goBack,
    showDialog,
    hideDialog,
  }),
  withHandlers({
    loadProject,
    createNewProject,
    init,
  }),
  lifecycle({
    async componentDidMount() {
      this.props.init();
    },
  })
)(render);
