import isEqual from 'lodash/isEqual';
import throttle from 'lodash/throttle';
import {
  MODE_NAVIGATION,
  MODE_WAYPOINT_PLACEMENT,
} from '../scene-director/modes';
import { QR_CODES_HIGHLIGHT_TIME } from '../../constants';
import { appState } from '../../services';

export default ({
  insertContainer,
  getInitialQrCodes,
  getLearnedQrCodes,
  getTrackedQrCodes,
  insertVisualization,
  isEnabled,
  removeVisualization,
  onTrackingChanged,
  offTrackingChanged,
  hasQRCodeCapability,
}) => {
  let running = false;
  let container = null;
  let updating = false;
  let targetsChanged = false;
  let instances = {};
  let oldQrCodeState = {};
  let lastUpdate = null;
  let initialQrCodes = [];

  let qrCodesTimeout = {};

  const updateQrCodes = async () => {
    const learnedQrCodes = targetsChanged ? await getLearnedQrCodes() : [];
    const qrCodes = JSON.parse(JSON.stringify(initialQrCodes));

    for (let qrCode of learnedQrCodes) {
      const found = qrCodes.find(code => code.name === qrCode.name);
      if (found) {
        found.pose = qrCode.pose;
      }
    }

    for (let name of Object.keys(qrCodesTimeout)) {
      qrCodesTimeout[name]--;
      if (qrCodesTimeout[name] <= 0) {
        delete qrCodesTimeout[name];
      }
    }

    const trackedQrCodes = getTrackedQrCodes();

    const qrCodeState = getQrCodeState(qrCodes, trackedQrCodes);
    updateHighlights(qrCodeState);

    await visualizeQrCodes(qrCodeState, container);
  };

  const updateHighlights = qrCodeState => {
    const now = Date.now();
    const elapsed = now - lastUpdate;

    for (let name of Object.keys(qrCodeState)) {
      if (qrCodeState[name].tracked) {
        qrCodeState[name].highlighted = true;
        qrCodesTimeout[name] = QR_CODES_HIGHLIGHT_TIME;
      } else if (qrCodesTimeout[name]) {
        qrCodesTimeout[name] -= elapsed;
        if (qrCodesTimeout[name] <= 0) {
          qrCodeState[name].highlighted = false;
          delete qrCodesTimeout[name];
        } else {
          qrCodeState[name].highlighted = true;
        }
      } else {
        qrCodeState[name].highlighted = false;
      }
    }

    lastUpdate = now;
  };

  const getQrCodeState = (qrCodes, trackedQrCodes) => {
    const state = {};

    for (let qrCode of qrCodes) {
      const { pose, size, name } = qrCode;

      if (pose) {
        const { position, orientation } = pose;
        state[name] = {
          name,
          pose: {
            position,
            orientation,
            scale: {
              x: size / 10,
              y: size / 100,
              z: size / 10,
            },
          },
          tracked: trackedQrCodes.indexOf(name) !== -1,
        };
      }
    }

    return state;
  };

  const visualizeQrCodes = (qrCodeState, container) =>
    (appState.sceneStateMutex = appState.sceneStateMutex.then(
      () => visualizeQrCodesFn(qrCodeState, container),
      () => visualizeQrCodesFn(qrCodeState, container)
    ));
  const visualizeQrCodesFn = async (qrCodeState, container) => {
    for (let qrCode of Object.values(qrCodeState)) {
      const instance = (instances[qrCode.name] =
        instances[qrCode.name] ||
        (await insertVisualization(qrCode, container)));
      await updateQrCodeInstance(qrCode, instance);
    }
  };

  const updateQrCodeInstance = async (qrCode, instance) => {
    const oldQrCode = oldQrCodeState[qrCode.name] || {};
    if (!isEqual(qrCode, oldQrCode)) {
      if (!isEqual(qrCode.pose, oldQrCode.pose)) {
        await instance.setPose(qrCode.pose);
      }

      if (qrCode.highlighted !== oldQrCode.highlighted) {
        await setColor(instance, qrCode.highlighted);
      }

      if (qrCode.tracked !== oldQrCode.tracked) {
        await setAnimation(instance, qrCode.tracked);
      }
      oldQrCodeState[qrCode.name] = qrCode;
    }
  };

  const setAnimation = async (instance, playing) => {
    const animation =
      Object.keys(instance.animations).length &&
      Object.values(instance.animations)[0];

    if (animation) {
      if (playing) {
        animation.state !== 'playing' && (await animation.start());
      } else {
        animation.state !== 'stopped' && (await animation.stop());
      }
    }
  };

  const setColor = async (instance, highlighted) => {
    const propertyValues = {};
    for (let property of Object.values(instance.properties)) {
      if (property.values.length) {
        propertyValues[property.name] = highlighted
          ? property.values[1].name
          : property.values[0].name;
      }
    }
    await instance.setPropertyValues(propertyValues);
  };

  const hideQrCodes = () =>
    (appState.sceneStateMutex = appState.sceneStateMutex.then(
      () => hideQrCodesFn(),
      () => hideQrCodesFn()
    ));
  const hideQrCodesFn = async () => {
    for (let child of container.children) {
      await removeVisualization(child);
    }
    instances = {};
    await container.setVisible(false);
  };

  const showQrCodes = () =>
    (appState.sceneStateMutex = appState.sceneStateMutex.then(
      () => showQrCodesFn(),
      () => showQrCodesFn()
    ));
  const showQrCodesFn = async () => {
    container = container || (await insertContainer());
    await container.setVisible(true);
  };

  const start = async () => {
    if (!running && isEnabled()) {
      initialQrCodes = getInitialQrCodes();
      running = true;
      targetsChanged = true;
      oldQrCodeState = {};
      onTrackingChanged(trackingChanged);
      lastUpdate = Date.now();
      await showQrCodes();
    }
  };

  const trackingChanged = () => (targetsChanged = true);

  const stop = async () => {
    if (running) {
      running = false;
      offTrackingChanged(trackingChanged);
      await hideQrCodes();
    }
  };

  const processTick = throttle(async () => {
    if (running && !updating) {
      updating = true;
      try {
        await updateQrCodes();
      } catch (e) {
        console.error(e.message);
      } finally {
        updating = false;
      }
    }
  }, 1000);

  const runsInMode = mode => {
    return (hasQRCodeCapability()
      ? [MODE_NAVIGATION, MODE_WAYPOINT_PLACEMENT]
      : []
    ).includes(mode);
  };

  const init = async () => {};

  return {
    init,
    start,
    stop,
    processTick,
    get running() {
      return running;
    },
    runsInMode,
  };
};
