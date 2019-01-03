import React from 'react';
import { withRouter } from 'react-router';
import { compose, withHandlers, withProps, withState } from 'recompose';
import waitForUiUpdate from '../../utils/wait-for-ui-update';
import viewarApi from 'viewar-api';
import authManager from '../../services/auth-manager';
import storage from '../../services/storage';
import appState from '../../services/app-state';

import render from './template.jsx';

export const goTo = ({ history }) => route => history.push(route);

export const goBack = ({ history }) => route => history.push('/map-selection');

export const onMapInfoChanged = ({
  appState,
  history,
  setProject,
  setMapInfoVisible,
  userId,
  storage,
  showDialog,
  hideDialog,
}) => async name => {
  await showDialog('Please wait...');
  const project = storage.createNewProject(userId, { name });
  await project.open();
  appState.qrScanPath = '/map-edit';
  appState.editBackPath = `/map-selection`;
  await hideDialog();

  history.push('/init-tracker');
};

export default compose(
  withRouter,
  withProps({
    authManager,
    viewarApi,
    storage,
    appState,
    userId: authManager.user.username,
  }),
  withState('waitDialogText', 'setWaitDialogText', ''),
  withHandlers({
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
    goTo,
    goBack,
    onMapInfoChanged,
  })
)(render);
