import React from 'react';
import { withRouter } from 'react-router';
import {
  compose,
  withState,
  withHandlers,
  withProps,
  lifecycle,
} from 'recompose';
import { waitForUiUpdate } from '../../utils';
import viewarApi from 'viewar-api';
import {
  authManager,
  poiPlacement,
  sceneDirector,
  camera,
} from '../../services';
import { MODE_POI_PLACEMENT } from '../../services/scene-director/modes';

import render from './template.jsx';

export const goTo = ({ history }) => route => history.push(route);

export const goBack = ({ history }) => () => history.goBack();

export const showDialog = ({ setWaitDialogText }) => async text => {
  setWaitDialogText(text);
  await waitForUiUpdate();
};

export const hideDialog = ({ setWaitDialogText }) => async () => {
  setWaitDialogText('');
  await waitForUiUpdate();
};

export const onErrorDialogClose = ({ setErrorDialogText }) => () =>
  setErrorDialogText('');

export const cancelEdit = ({
  poi,
  setPoi,
  setShowEdit,
  setScreenshot,
}) => async () => {
  if (poi) {
    setScreenshot(null);
    const node = viewarApi.sceneManager.findNodeById(poi.id);
    if (node) {
      await viewarApi.sceneManager.select(node);
      await poiPlacement.removeSelectedPoi();
      setPoi(null);
      setShowEdit(false);
    }
  }
};

export const editBack = ({ setShowEdit }) => () => setShowEdit(false);

export const capturePoi = ({ setPoi, setErrorDialogText }) => async () => {
  await poiPlacement.start();
  let poi;
  try {
    poi = await poiPlacement.placePoi();
  } catch (e) {
    setErrorDialogText(`Error: ${e.message}`);
  }
  setPoi(poi);
};

export const cancelScreenshot = ({
  poi,
  setPoi,
  setShowEdit,
  setScreenshot,
}) => async () => {
  setScreenshot(null);
  if (poi) {
    const node = viewarApi.sceneManager.findNodeById(poi.id);
    if (node) {
      await viewarApi.sceneManager.select(node);
      await poiPlacement.removeSelectedPoi();
      setPoi(null);
      setShowEdit(false);
    }
  }
};

export const takeScreenshot = ({
  setFreezeFrame,
  showDialog,
  hideDialog,
  setScreenshot,
}) => async () => {
  await showDialog('Please wait...');
  if (camera.mode === 'AR') {
    const name = 'poi_' + Date.now();
    await Promise.all([
      new Promise(resolve =>
        viewarApi.coreInterface.once('freezeFrameTaken', resolve)
      ),
      viewarApi.coreInterface.emit('saveFreezeFrame', name, false),
    ]);
    const freezeFrame = {
      name,
      thumbnailUrl: viewarApi.coreInterface.resolveUrl(
        'Freezeframes/General/' + name + '_thumb.jpg'
      ),
      imageUrl: viewarApi.coreInterface.resolveUrl(
        'Freezeframes/General/' + name + '.jpg'
      ),
    };

    setFreezeFrame(freezeFrame);
    setScreenshot(freezeFrame.imageUrl);
  }
  await hideDialog();
};

export const saveScreenshot = ({ poi, freezeFrame, setShowEdit }) => () => {
  Object.assign(poi.data, {
    newFreezeFrame: freezeFrame,
  });
  setShowEdit(true);
};

export default compose(
  withRouter,
  withState('errorDialogText', 'setErrorDialogText', ''),
  withState('waitDialogText', 'setWaitDialogText', ''),
  withState('poi', 'setPoi', null),
  withState('screenshot', 'setScreenshot', null),
  withState('freezeFrame', 'setFreezeFrame', null),
  withState('showEdit', 'setShowEdit', false),
  withProps(() => ({
    userId: authManager.user.username,
    loadDialogVisible: true,
  })),
  withHandlers({
    goTo,
    hideEdit: goBack,
  }),
  withHandlers({
    showDialog,
    hideDialog,
  }),
  withHandlers({
    onErrorDialogClose,
    cancelEdit,
    editBack,
    capturePoi,
    cancelScreenshot,
    takeScreenshot,
    saveScreenshot,
  }),
  lifecycle({
    async componentDidMount() {
      await sceneDirector.setMode(MODE_POI_PLACEMENT);
    },
    async componentWillUnmount() {
      await poiPlacement.stop();
    },
  })
)(render);
