import React from 'react';
import { withRouter } from 'react-router';
import {
  compose,
  withState,
  withHandlers,
  withProps,
  lifecycle,
} from 'recompose';
import waitForUiUpdate from '../../utils/wait-for-ui-update';
import viewarApi from 'viewar-api';
import authManager from '../../services/auth-manager';
import storage from '../../services/storage';
import poiPlacement from '../../services/poi-placement';
import sceneDirector from '../../services/scene-director';
import camera from '../../services/camera';
import { MODE_POI_PLACEMENT } from '../../services/scene-director/modes';

import render from './template.jsx';

export const goTo = ({ history }) => route => history.push(route);
export const goBack = ({ history }) => route => history.goBack();

export default compose(
  withRouter,
  withState('errorDialogText', 'setErrorDialogText', ''),
  withState('waitDialogText', 'setWaitDialogText', ''),
  withState('poi', 'setPoi', null),
  withState('screenshot', 'setScreenshot', null),
  withState('freezeFrame', 'setFreezeFrame', null),
  withState('showEdit', 'setShowEdit', false),
  withProps({
    storage,
    sceneDirector,
    poiPlacement,
    camera,
    viewarApi,
    userId: authManager.user.username,
    loadDialogVisible: true,
  }),
  withHandlers({
    goTo,
    hideEdit: goBack,
  }),
  withHandlers({
    showDialog: ({ setWaitDialogText }) => async text => {
      setWaitDialogText(text);
      await waitForUiUpdate();
    },
    hideDialog: ({ setWaitDialogText }) => async () => {
      setWaitDialogText('');
      await waitForUiUpdate();
    },
  }),
  withHandlers({
    onErrorDialogClose: ({ setErrorDialogText }) => () =>
      setErrorDialogText(''),
    cancelEdit: ({
      poiPlacement,
      viewarApi: { sceneManager },
      poi,
      setPoi,
      setShowEdit,
      setScreenshot,
    }) => async () => {
      if (poi) {
        setScreenshot(null);
        const node = sceneManager.findNodeById(poi.id);
        if (node) {
          await sceneManager.select(node);
          await poiPlacement.removeSelectedPoi();
          setPoi(null);
          setShowEdit(false);
        }
      }
    },
    editBack: ({ setShowEdit }) => () => setShowEdit(false),
    capturePoi: ({ poiPlacement, setPoi, setErrorDialogText }) => async () => {
      await poiPlacement.start();
      let poi;
      try {
        poi = await poiPlacement.placePoi();
      } catch (e) {
        setErrorDialogText(`Error: ${e.message}`);
      }
      setPoi(poi);
    },
    cancelScreenshot: ({
      poiPlacement,
      viewarApi: { sceneManager },
      poi,
      setPoi,
      setShowEdit,
      setScreenshot,
    }) => async () => {
      setScreenshot(null);
      if (poi) {
        const node = sceneManager.findNodeById(poi.id);
        if (node) {
          await sceneManager.select(node);
          await poiPlacement.removeSelectedPoi();
          setPoi(null);
          setShowEdit(false);
        }
      }
    },
    takeScreenshot: ({
      viewarApi: { coreInterface },
      setFreezeFrame,
      showDialog,
      hideDialog,
      camera,
      setScreenshot,
    }) => async () => {
      await showDialog('Please wait...');
      if (camera.mode === 'AR') {
        const name = 'poi_' + Date.now();
        await Promise.all([
          new Promise(resolve =>
            coreInterface.once('freezeFrameTaken', resolve)
          ),
          coreInterface.emit('saveFreezeFrame', name, false),
        ]);
        const freezeFrame = {
          name,
          thumbnailUrl: coreInterface.resolveUrl(
            'Freezeframes/General/' + name + '_thumb.jpg'
          ),
          imageUrl: coreInterface.resolveUrl(
            'Freezeframes/General/' + name + '.jpg'
          ),
        };

        setFreezeFrame(freezeFrame);
        setScreenshot(freezeFrame.imageUrl);
      }
      await hideDialog();
    },
    saveScreenshot: ({ poi, freezeFrame, screenshot, setShowEdit }) => () => {
      Object.assign(poi.data, {
        newFreezeFrame: freezeFrame,
      });
      setShowEdit(true);
    },
  }),
  lifecycle({
    async componentDidMount() {
      const { sceneDirector } = this.props;
      await sceneDirector.setMode(MODE_POI_PLACEMENT);
    },
    async componentWillUnmount() {
      const { poiPlacement } = this.props;
      await poiPlacement.stop();
    },
  })
)(render);
