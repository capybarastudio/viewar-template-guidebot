import { withRouter } from 'react-router';
import { compose, lifecycle, withState, withHandlers } from 'recompose';
import viewarApi from 'viewar-api';
import { appState } from '../../services';

import render from './template.jsx';

const init = ({ history, setNextView, updateTracking }) => () => {
  const nextView = appState.qrScanPath || '/mode-selection';
  setNextView(nextView);

  if (viewarApi.tracker) {
    viewarApi.tracker.on('trackingTargetStatusChanged', updateTracking);
  } else {
    history.push(nextView);
  }
};

const destroy = ({ updateTracking }) => () => {
  if (viewarApi.tracker) {
    viewarApi.tracker.off('trackingTargetStatusChanged', updateTracking);
  }
};

const updateTracking = ({ history, nextView }) => target => {
  if (target && target.tracked) {
    history.push(nextView);
  }
};

export default compose(
  withRouter,
  withState('nextView', 'setNextView', '/mode-selection'),
  withHandlers({
    updateTracking,
  }),
  withHandlers({
    init,
    destroy,
  }),
  lifecycle({
    componentDidMount() {
      this.props.init();
    },
    componentWillUnmount() {
      this.props.destroy();
    },
  })
)(render);
