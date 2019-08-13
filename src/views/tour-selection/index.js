import { withRouter } from 'react-router';
import { compose, withHandlers, withState, lifecycle } from 'recompose';
import { getUiConfigPath } from '../../utils';

import render from './template.jsx';
import { appState, storage } from '../../services';

export const init = ({ setTours }) => () => {
  setTours(storage.activeProject.tours);
};

export const selectTour = ({ history }) => tour => {
  history.push(`/tour/${tour.id}`);
};

export const goBack = ({ history }) => () => {
  if (
    getUiConfigPath('app.manualDisabled') &&
    getUiConfigPath('app.voiceDisabled')
  ) {
    history.push(appState.modeBackPath || '/');
  } else {
    history.push('/mode-selection');
  }
};

export default compose(
  withRouter,
  withState('tours', 'setTours', []),
  withHandlers({
    selectTour,
    goBack,
    init,
  }),
  lifecycle({
    componentWillMount() {
      this.props.init();
    },
  })
)(render);
