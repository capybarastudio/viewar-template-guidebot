import React from 'react';
import viewarApi from 'viewar-api';
import { withRouter } from 'react-router';
import { compose, withHandlers, withProps, withState } from 'recompose';
import { waitForUiUpdate } from '../../utils';
import { authManager, storage, appState } from '../../services';

import render from './template.jsx';

export const goTo = ({ history }) => route => history.push(route);

export const goBack = ({ history }) => route => history.push('/map-selection');

export const onMapInfoChanged = ({
  history,
  userId,
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

export const showDialog = ({ setWaitDialogText }) => async text => {
  setWaitDialogText(text);
  await waitForUiUpdate();
};

export const hideDialog = ({ setWaitDialogText }) => async () => {
  setWaitDialogText('');
  await waitForUiUpdate();
};

export default compose(
  withRouter,
  withProps(() => ({
    userId: authManager.user.username,
  })),
  withState('waitDialogText', 'setWaitDialogText', ''),
  withHandlers({
    showDialog,
    hideDialog,
  }),
  withHandlers({
    goTo,
    goBack,
    onMapInfoChanged,
  })
)(render);
