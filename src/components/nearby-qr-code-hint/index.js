import {
  compose,
  withState,
  withProps,
  withPropsOnChange,
  withHandlers,
  lifecycle,
} from 'recompose';
import viewarApi from 'viewar-api';
import render from './template.jsx';
import config from '../../services/config';

const UPDATE_INTERVAL = 500;

const update = ({ viewarApi, trackedTargets, config, setHidden }) => () => {
  const { trackers, cameras } = viewarApi;
  const tracker = Object.values(trackers)[0];
  const maxSquaredDistance = config.app.qrCodeNearDistance ** 2;
  const cameraPosition = cameras.arCamera.pose.position;

  const qrCodes = (tracker || {}).targets
    .filter(target => target.type === 'image')
    .filter(target => !trackedTargets.includes(target.name));

  for (let qrCode of qrCodes) {
    if (qrCode._info && qrCode._info.pose) {
      const position = qrCode._info.pose.position;
      const cameraToQrCode = {
        x: cameraPosition.x - position.x,
        y: cameraPosition.y - position.y,
        z: cameraPosition.z - position.z,
      };

      const squaredDistance = cameraToQrCode.x ** 2 + cameraToQrCode.z ** 2;
      if (squaredDistance < maxSquaredDistance) {
        setHidden(false);
        return;
      }
    }
  }

  setHidden(true);
};

const updateTracking = ({ setTrackedTargets, trackedTargets }) => target => {
  if (
    target.type === 'image' &&
    target.tracked &&
    !trackedTargets.includes(target.name)
  ) {
    trackedTargets.push(target.name);
    setTrackedTargets(trackedTargets);
  }
};

const startUpdate = ({
  viewarApi,
  update,
  setTrackedTargets,
  setHidden,
  updateTracking,
}) => () => {
  if (!interval) {
    const { trackers } = viewarApi;
    const tracker = Object.values(trackers)[0];

    if (tracker) {
      tracker.on('trackingTargetStatusChanged', updateTracking);
      setTrackedTargets(
        tracker.targets
          .filter(target => target.tracked && target.type === 'image')
          .map(target => target.name)
      );
      interval = setInterval(update, UPDATE_INTERVAL);
    }
    setHidden(true);
  }
};

const stopUpdate = ({ viewarApi, update, updateTracking }) => () => {
  if (interval) {
    const { trackers } = viewarApi;
    const tracker = Object.values(trackers)[0];
    tracker.off('trackingTargetStatusChanged', updateTracking);

    clearInterval(interval);
    interval = 0;
  }
};

let interval = 0;
export default compose(
  withState('hidden', 'setHidden', true),
  withState('trackedTargets', 'setTrackedTargets', []),
  withProps({
    viewarApi,
    config,
  }),
  withHandlers({
    update,
    updateTracking,
  }),
  withHandlers({
    startUpdate,
    stopUpdate,
  }),
  withPropsOnChange(['enabled'], ({ enabled, startUpdate, stopUpdate }) => {
    if (enabled) {
      startUpdate();
    } else {
      stopUpdate();
    }
  }),
  lifecycle({
    componentDidMount() {
      const { enabled, startUpdate } = this.props;
      if (enabled) {
        startUpdate();
      }
    },
    componentWillUnmount() {
      const { stopUpdate } = this.props;
      stopUpdate();
    },
  })
)(render);
