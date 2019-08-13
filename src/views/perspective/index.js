import { withRouter } from 'react-router';
import {
  compose,
  withHandlers,
  withProps,
  withState,
  lifecycle,
} from 'recompose';
import viewarApi from 'viewar-api';
import guide from 'viewar-guide';
import { getUiConfigPath } from '../../utils';

import render from './template.jsx';
import {
  appState,
  storage,
  graphController,
  sceneDirector,
  camera,
} from '../../services';
import { MODE_NONE } from '../../services/scene-director/modes';

let lastMode;
export const init = ({ match, setPois, setPoiIndex }) => async () => {
  await guide.dismissGuide();

  // Get tour.
  const tourId = match.params.tourId;
  const tour = storage.activeProject.tours.find(tour => tour.id === tourId);

  if (!tour) {
    throw new Error('Tour not found!');
  }

  // Assemble all tour pois.
  const pois = [];
  for (let poiId of tour.pois) {
    const poi = graphController.pois.find(poi => poi.$id === poiId);
    if (!poi) {
      console.error(`Poi ${poiId} not found in project.`);
    } else {
      pois.push(poi);
    }
  }
  setPois(pois);

  let poiIndex = Number.parseInt(match.params.poiIndex);
  if (poiIndex < 0) {
    poiIndex = 0;
  }
  setPoiIndex(poiIndex);

  lastMode = camera.mode;
  await camera.setMode('Perspective');
  await sceneDirector.setMode(MODE_NONE);
  await sceneDirector.stop();

  // Make sure guide disapparead (Hack).
  await new Promise(resolve => setTimeout(resolve, 500));
  await viewarApi.sceneManager.scene.setVisible(false);
  await viewarApi.appUtils.pauseRenderLoop();
};

export const goBack = ({ history, poiIndex, match }) => async () => {
  await viewarApi.appUtils.resumeRenderLoop();
  camera.setMode(lastMode);
  appState.qrScanPath = `/tour/${match.params.tourId}/${poiIndex}/true`;
  history.push(`/init-tracker`);
};

export const nextPoi = ({ pois, setPoiIndex, poiIndex }) => () => {
  let index = poiIndex + 1;
  if (index >= pois.length) {
    index = 0;
  }

  setPoiIndex(index);
};

export const previousPoi = ({ pois, setPoiIndex, poiIndex }) => () => {
  let index = poiIndex - 1;
  if (index < 0) {
    index = pois.length - 1;
  }

  setPoiIndex(index);
};

export const getScreenshotUrl = poi => {
  if (poi.data.imageUrl) {
    return poi.data.imageUrl;
  }

  if (poi.data.freezeFrame) {
    const freezeFrame = viewarApi.cameras.arCamera.freezeFrames.find(
      ff => (ff.name = poi.data.freezeFrame)
    );
    if (freezeFrame) {
      returnUrl = freezeFrame.imageUrl;
    }
  }

  return '';
};

export default compose(
  withRouter,
  withState('pois', 'setPois', []),
  withState('poiIndex', 'setPoiIndex', -1),
  withProps({
    getScreenshotUrl,
  }),
  withHandlers({
    nextPoi,
    previousPoi,
    goBack,
    init,
  }),
  lifecycle({
    componentWillMount() {
      this.props.init();
    },
  })
)(render);
