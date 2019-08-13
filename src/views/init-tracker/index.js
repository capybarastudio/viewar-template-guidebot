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
import { appState, storage } from '../../services';

import render from './template.jsx';
import { getQrCodeType } from '../../utils';

export const onTrackingTimeout = ({ setAdvancedInitHint }) => () => {
  setAdvancedInitHint('TrackerInitHint');
};

export const updateTracking = ({ history }) => async () => {
  const tracker = viewarApi.tracker;

  if (tracker.tracking) {
    clearTimeout(timeout);
    let nextView;
    const hasQrCodes =
      tracker.targets &&
      !!tracker.targets.filter(target => target.type === getQrCodeType())
        .length;

    if (tracker.loadTrackingMap || !hasQrCodes) {
      await tracker.confirmGroundPosition();
      nextView = appState.qrScanPath || '/mode-selection';
    } else {
      nextView = 'film-qr-code';
    }
    history.push(nextView);
  }
};

export const goBack = ({ history }) => () => {
  history.push(appState.modeBackPath || appState.editBackPath || '/');
};

export const init = ({
  history,
  updateTracking,
  setDeviceType,
  onTrackingTimeout,
}) => async () => {
  const tracker = viewarApi.tracker;

  setDeviceType(viewarApi.appConfig.deviceType);
  timeout = setTimeout(onTrackingTimeout, 10000);

  if (tracker) {
    tracker.on('trackingTargetStatusChanged', updateTracking);
    await tracker.reset();
  } else {
    history.push(appState.qrScanPath || '/mode-selection');
  }
};

export const destroy = ({ updateTracking }) => () => {
  const tracker = viewarApi.tracker;

  clearTimeout(timeout);
  if (tracker) {
    tracker.off('trackingTargetStatusChanged', updateTracking);
  }
};

let timeout;
export default compose(
  withRouter,
  withState('advancedInitHint', 'setAdvancedInitHint', false),
  withState('deviceType', 'setDeviceType', null),
  withHandlers({
    onTrackingTimeout,
  }),
  withHandlers({
    updateTracking,
    goBack,
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
