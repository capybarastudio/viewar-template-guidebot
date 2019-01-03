import React from 'react';
import { withRouter } from 'react-router';
import {
  compose,
  withHandlers,
  withProps,
  lifecycle,
  withState,
} from 'recompose';
import waitForUiUpdate from '../../utils/wait-for-ui-update';
import viewarApi from 'viewar-api';
import authManager from '../../services/auth-manager';

import render from './template.jsx';

export const goTo = ({ history }) => route => history.push(route);

export const FILE_CREDENTIALS = 'credentials.json';

export default compose(
  withRouter,
  withProps({
    authManager,
    viewarApi,
    FILE_CREDENTIALS,
  }),
  withState('username', 'setUsername', ''),
  withState('password', 'setPassword', ''),
  withState('waitDialogText', 'setWaitDialogText', ''),
  withState('toastText', 'setToastText', ''),
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
    saveCredentials: ({
      viewarApi: { storage, appConfig },
      FILE_CREDENTIALS,
      username,
      password,
    }) => async () => {
      if ((appConfig.uiConfig || {}).persistLogin) {
        await storage.local.write(
          FILE_CREDENTIALS,
          JSON.stringify({ username, password })
        );
      }
    },
    loadCredentials: ({
      viewarApi: { storage, appConfig },
      FILE_CREDENTIALS,
      setUsername,
      setPassword,
    }) => async () => {
      if ((appConfig.uiConfig || {}).persistLogin) {
        const credentials = await storage.local.read(FILE_CREDENTIALS);
        if (credentials) {
          const { username, password } = credentials;
          setUsername(username);
          setPassword(password);
        }
      }
    },
  }),
  withHandlers({
    goTo,
    login: ({
      showDialog,
      hideDialog,
      showToast,
      history,
      authManager,
      saveCredentials,
      username,
      password,
    }) => async () => {
      await showDialog('Please wait...');
      const result = await authManager.authenticate({ username, password });
      await hideDialog();
      if (result.success) {
        await saveCredentials();
        history.push('/map-selection');
      } else {
        showToast(result.error, 2000);
      }
    },
  }),
  lifecycle({
    async componentDidMount() {
      await this.props.loadCredentials();
    },
  })
)(render);
