import React from 'react';
import { withRouter } from 'react-router';
import {
  compose,
  lifecycle,
  withState,
  withProps,
  withHandlers,
} from 'recompose';
import viewarApi from 'viewar-api';
import appState from '../../services/app-state';
import storage from '../../services/storage';

import render from './template.jsx';

export default compose(
  withRouter,
  withState('deviceType', 'setDeviceType', null),
  withProps({
    viewarApi,
    appState,
    storage,
  }),
  withHandlers({
    updateTracking: ({
      tracker,
      history,
      appState,
      viewarApi: { trackers },
      storage,
    }) => async () => {
      const tracker = Object.values(viewarApi.trackers)[0];

      if (tracker.tracking) {
        let nextView;
        const hasQrCodes =
          tracker.targets &&
          !!tracker.targets.filter(target => target.type === 'image').length;

        if (tracker.loadTrackingMap || !hasQrCodes) {
          await tracker.confirmGroundPosition();
          nextView = appState.qrScanPath || '/navigate';
        } else {
          nextView = 'film-qr-code';
        }
        history.push(nextView);
      }
    },
    goBack: ({ history, appState }) => () => {
      history.push(appState.navigateBackPath || appState.editBackPath || '/');
    },
  }),
  lifecycle({
    async componentDidMount() {
      const {
        history,
        updateTracking,
        setDeviceType,
        viewarApi: { trackers, appConfig },
        storage,
      } = this.props;
      const { deviceType } = appConfig;

      setDeviceType(deviceType);

      const tracker = Object.values(trackers)[0];
      if (tracker) {
        tracker.on('trackingTargetStatusChanged', updateTracking);
        await tracker.reset();
      } else {
        history.push(appState.qrScanPath || '/navigate');
      }
    },
    componentWillUnmount() {
      const {
        updateTracking,
        viewarApi: { trackers },
      } = this.props;

      const tracker = Object.values(trackers)[0];
      tracker && tracker.off('trackingTargetStatusChanged', updateTracking);
    },
  })
)(render);
