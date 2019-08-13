import {
  setDisplayName,
  compose,
  withHandlers,
  withProps,
  withState,
} from 'recompose';
import viewarApi from 'viewar-api';

import { camera, config } from '../../services';

import render from './template.jsx';
import { getUiConfigPath } from '../../utils';

const loadReplayFromStorage = async () => {
  return viewarApi.storage.cloud.read(
    `/public/${config.app.defaultUser}/replays/guidebot-replay.json`
  );
};

const saveReplayToStorage = async captureData => {
  return viewarApi.storage.cloud.write(
    `/public/${config.app.defaultUser}/replays/guidebot-replay.json`,
    JSON.stringify(captureData)
  );
};

const toggleCapture = ({ capturing, startCapture, stopCapture }) => () =>
  capturing ? stopCapture() : startCapture();

const toggleReplay = ({ replaying, startReplay, stopReplay }) => () =>
  replaying ? stopReplay() : startReplay();

export const startCapture = ({
  replaying,
  capturing,
  setCapturing,
}) => async () => {
  if (!replaying && !capturing) {
    camera.startCapture();
    setCapturing(true);
  }
};

export const stopCapture = ({
  capturing,
  setCapturing,
  setCaptureData,
}) => async () => {
  if (capturing) {
    const captureData = camera.stopCapture();
    setCaptureData(captureData);
    setCapturing(false);
  }
};

export const startReplay = ({
  captureData,
  capturing,
  replaying,
  setReplaying,
}) => async () => {
  if (!capturing && !replaying && captureData) {
    camera.startReplay(captureData);
    setReplaying(true);
  }
};

export const stopReplay = ({ replaying, setReplaying }) => async () => {
  if (replaying) {
    camera.stopReplay();
    setReplaying(false);
  }
};

export const loadCapture = ({
  loadReplayFromStorage,
  setCaptureData,
}) => async () => setCaptureData(await loadReplayFromStorage());

export const saveCapture = ({
  saveReplayToStorage,
  captureData,
}) => async () => {
  await saveReplayToStorage(captureData);
  alert('Saved.');
};

export default compose(
  setDisplayName('DisplayToolBar'),
  withProps(() => ({
    visible: getUiConfigPath('debug.showReplayControls'),
    loadReplayFromStorage,
    saveReplayToStorage,
  })),
  withState('capturing', 'setCapturing', false),
  withState('replaying', 'setReplaying', false),
  withState('captureData', 'setCaptureData', null),
  withHandlers({
    startCapture,
    stopCapture,
    startReplay,
    stopReplay,
    loadCapture,
    saveCapture,
  }),
  withHandlers({
    toggleCapture,
    toggleReplay,
  })
)(render);
