import {
  setDisplayName,
  compose,
  withHandlers,
  withProps,
  withState,
} from 'recompose';
import viewarApi from 'viewar-api';

import camera from '../../services/camera';
import config from '../../services/config';

import render from './template.jsx';

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

export default compose(
  setDisplayName('DisplayToolBar'),
  withProps(() => ({
    visible: config.debug.showReplayControls,
    camera,
    loadReplayFromStorage,
    saveReplayToStorage,
  })),
  withState('capturing', 'setCapturing', false),
  withState('replaying', 'setReplaying', false),
  withState('captureData', 'setCaptureData', null),
  withHandlers({
    startCapture: ({
      camera,
      replaying,
      capturing,
      setCapturing,
    }) => async () => {
      if (!replaying && !capturing) {
        camera.startCapture();
        setCapturing(true);
      }
    },
    stopCapture: ({
      camera,
      capturing,
      setCapturing,
      setCaptureData,
    }) => async () => {
      if (capturing) {
        const captureData = camera.stopCapture();
        setCaptureData(captureData);
        setCapturing(false);
      }
    },
    startReplay: ({
      camera,
      captureData,
      capturing,
      replaying,
      setReplaying,
    }) => async () => {
      if (!capturing && !replaying && captureData) {
        camera.startReplay(captureData);
        setReplaying(true);
      }
    },
    stopReplay: ({ camera, replaying, setReplaying }) => async () => {
      if (replaying) {
        camera.stopReplay();
        setReplaying(false);
      }
    },
    loadCapture: ({ loadReplayFromStorage, setCaptureData }) => async () =>
      setCaptureData(await loadReplayFromStorage()),
    saveCapture: ({ saveReplayToStorage, captureData }) => async () =>
      saveReplayToStorage(captureData),
  }),
  withHandlers({
    toggleCapture: ({ capturing, startCapture, stopCapture }) => () =>
      capturing ? stopCapture() : startCapture(),
    toggleReplay: ({ replaying, startReplay, stopReplay }) => () =>
      replaying ? stopReplay() : startReplay(),
  })
)(render);
