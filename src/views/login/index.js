import React from 'react';
import { withRouter } from 'react-router';
import {
  compose,
  withHandlers,
  withProps,
  lifecycle,
  withState,
} from 'recompose';
import viewarApi from 'viewar-api';
import { waitForUiUpdate, getUiConfigPath } from '../../utils';
import { authManager } from '../../services';

import render from './template.jsx';

export const FILE_CREDENTIALS = 'credentials.json';

export const goTo = ({ history }) => route => history.push(route);

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

export const saveCredentials = ({ username, password }) => async () => {
  if (getUiConfigPath('app.persistLogin')) {
    await viewarApi.storage.local.write(
      FILE_CREDENTIALS,
      JSON.stringify({ username, password })
    );
  }
};

export const loadCredentials = ({ setUsername, setPassword }) => async () => {
  if (getUiConfigPath('app.persistLogin')) {
    const credentials = await viewarApi.storage.local.read(FILE_CREDENTIALS);
    if (credentials) {
      const { username, password } = credentials;
      setUsername(username);
      setPassword(password);
    }
  }
};

export const login = ({
  showDialog,
  hideDialog,
  showToast,
  history,
  saveCredentials,
  username,
  password,
}) => async e => {
  e.preventDefault();
  await showDialog('Please wait...');
  const result = await authManager.authenticate({ username, password });
  await hideDialog();

  if (result.success) {
    await saveCredentials();
    history.push('/map-selection');
  } else {
    showToast(result.error, 2000);
  }
};

export default compose(
  withRouter,
  withState('username', 'setUsername', ''),
  withState('password', 'setPassword', ''),
  withState('waitDialogText', 'setWaitDialogText', ''),
  withState('toastText', 'setToastText', ''),
  withHandlers({
    showDialog,
    hideDialog,
    showToast,
    hideToast,
    saveCredentials,
    loadCredentials,
  }),
  withHandlers({
    goTo,
    login,
  }),
  lifecycle({
    componentDidMount() {
      this.props.loadCredentials();
    },
  })
)(render);
