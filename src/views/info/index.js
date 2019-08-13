import { withRouter } from 'react-router';
import { compose, withHandlers, withProps } from 'recompose';
import viewarApi from 'viewar-api';
import { getUiConfigPath } from '../../utils';

import render from './template.jsx';

export const goTo = ({ history }) => route => history.push(route);

export const openUrl = ({}) => async url => {
  viewarApi.appUtils.openUrl(url);
};

export default compose(
  withRouter,
  withProps(() => ({
    infoText: getUiConfigPath('app.infoText'),
  })),
  withHandlers({
    goTo,
    openUrl,
  })
)(render);
