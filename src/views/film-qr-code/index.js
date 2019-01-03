import React from 'react';
import { withRouter } from 'react-router';
import { compose, lifecycle, withState } from 'recompose';
import viewarApi from 'viewar-api';
import appState from '../../services/app-state';

import render from './template.jsx';

export default compose(
  withRouter,
  withState('nextView', 'setNextView', '/navigate'),
  lifecycle({
    async componentDidMount() {
      const { history, setNextView } = this.props;

      const nextView = appState.qrScanPath || '/navigate';
      setNextView(nextView);
      if (viewarApi.trackers.ARKit) {
        viewarApi.trackers.ARKit.once(
          'trackingTargetStatusChanged',
          target => target.tracked && history.push(nextView)
        );
      } else {
        history.push(nextView);
      }
    },
  })
)(render);
