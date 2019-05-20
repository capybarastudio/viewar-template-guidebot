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

let timeout;
export default compose(
  withRouter,
  withState('advancedInitHint', 'setAdvancedInitHint', false),
  withState('deviceType', 'setDeviceType', null),
  withProps({
    viewarApi,
    appState,
    storage,
  }),
  withHandlers({
    onTrackingTimeout: ({ setAdvancedInitHint }) => () => {
      setAdvancedInitHint('TrackerInitHint');
    },
  }),
  withHandlers({
    updateTracking: ({
      history,
      appState,
      viewarApi: { tracker },
    }) => async () => {
      if (tracker.tracking) {
        clearTimeout(timeout);
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
        viewarApi: { tracker, appConfig },
      } = this.props;
      const { deviceType } = appConfig;

      setDeviceType(deviceType);
      timeout = setTimeout(this.props.onTrackingTimeout, 10000);

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
        viewarApi: { tracker },
      } = this.props;
      clearTimeout(timeout);
      if (tracker) {
        tracker.off('trackingTargetStatusChanged', updateTracking);
      }
    },
  })
)(render);
