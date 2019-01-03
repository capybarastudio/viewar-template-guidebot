import React from 'react';
import { withRouter } from 'react-router';
import { compose, withState, withHandlers, withProps } from 'recompose';
import viewarApi from 'viewar-api';
import config from '../../services/config';

import render from './template.jsx';

export const goTo = ({ history }) => route => history.push(route);

export const openUrl = ({ viewarApi }) => async url => {
  viewarApi.appUtils.openUrl(url);
};

export default compose(
  withRouter,
  withProps({
    viewarApi,
    config,
  }),
  withProps(({ config }) => ({
    infoText: config.app.infoText,
  })),
  withHandlers({
    goTo,
    openUrl,
  })
)(render);
