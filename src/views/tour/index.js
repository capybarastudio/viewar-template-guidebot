import {
  compose,
  withProps,
  withState,
  withHandlers,
  lifecycle,
} from 'recompose';
import viewarApi from 'viewar-api';
import { waitForUiUpdate, getUiConfigPath, getQrCodeType } from '../../utils';
import {
  storage,
  authManager,
  sceneDirector,
  config,
  graphController,
} from '../../services';
import guide from 'viewar-guide';
import uniqBy from 'lodash/uniqBy';

import {
  MODE_WAYPOINT_PLACEMENT,
  MODE_POI_PLACEMENT,
  MODE_NAVIGATION,
  MODE_NONE,
} from '../../services/scene-director/modes';

import render from './template.jsx';

export const goToPerspective = ({ history, match, poiIndex }) => async () => {
  // Stop speaking.
  if (
    viewarApi.coreInterface.platform === 'iOS' ||
    viewarApi.coreInterface.platform === 'Android'
  ) {
    await viewarApi.coreInterface.call('textToSpeech', '', {
      lang: getUiConfigPath('app.language') || 'en-US',
      name: getUiConfigPath('app.speaker') || 'Google US English',
    });
  }

  const tourId = match.params.tourId;
  const path = `/perspective/${tourId}/${poiIndex}`;
  history.push(path);
};

export const goBack = ({ history }) => () => {
  history.push('/tour-selection');
};

export const showPrompt = ({
  setPromptVisible,
  setPromptText,
  setPromptAction,
  setPromptButton,
}) => (text, button, action) => {
  setPromptText(text);
  setPromptVisible(true);
  setPromptAction(action);
  setPromptButton(button);
};

export const closePrompt = ({
  goBack,
  promptAction,
  setPromptVisible,
}) => () => {
  switch (promptAction) {
    case 'back':
      goBack();
      break;
  }

  setPromptVisible(false);
};

export const closeGallery = ({ setGalleryVisible }) => () =>
  setGalleryVisible(false);

export const showGallery = ({
  setGalleryVisible,
  setGalleryImages,
}) => images => {
  setGalleryImages(images);
  setGalleryVisible(true);
};

export const showDialog = ({ setWaitDialogText }) => async text => {
  setWaitDialogText(text);
  await waitForUiUpdate();
};

export const hideDialog = ({ setWaitDialogText }) => async () => {
  setWaitDialogText('');
  await waitForUiUpdate();
};

export const toggleTourToolBar = ({
  tourToolBarActive,
  setTourToolBarActive,
}) => () => {
  setTourToolBarActive(!tourToolBarActive);
};

export const requestGuide = ({ setGuideRequested }) => () => {
  guide.requestGuide(() => {}, {
    greet: getUiConfigPath('text.greetUser'),
    dismissOnFinish: false,
    dontListen: true,
  });
  setGuideRequested(true);
};

export const dismissGuide = ({}) => () => {
  guide.dismissGuide();
};

export const toggleHelp = ({
  helpVisible,
  setHelpVisible,
  setInitialHelp,
}) => visible => {
  const visibility = typeof visible === 'boolean' ? visible : !helpVisible;
  setHelpVisible(visibility);
  setInitialHelp(false);
};

export const resetTracking = ({ history }) => () =>
  history.push('/init-tracker');

export const updateTracking = ({
  setTrackingLost,
  setHelpVisible,
  initialHelp,
}) => async () => {
  const tracker = viewarApi.tracker;

  let tracking = true;
  if (tracker.loadTrackingMap) {
    tracking = tracker.targets.filter(
      target => target.type === 'map' && target.tracked
    ).length;
  }

  setTrackingLost(!tracking);

  if (tracking) {
    if (initialHelp) {
      setHelpVisible(true);
    }
    await sceneDirector.setMode(MODE_NAVIGATION);
  } else {
    await sceneDirector.setMode(MODE_NONE);
  }
};

export const updateTrackingMapProgress = ({
  setTrackingMapProgress,
}) => progress => {
  setTrackingMapProgress(progress * 100);
};

export const init = ({
  updateTracking,
  showDialog,
  hideDialog,
  setHasQrCodes,
  updateTrackingMapProgress,
  setTrackingMapMessage,
  setTrackingMapProgressVisible,
  setTrackingMapProgress,
  showPrompt,
  match,
  setPois,
  requestGuide,
  setNextPoi,
  setTourName,
  setPoiIndex,
  setHelpVisible,
  setInitialHelp,
}) => async () => {
  const tracker = viewarApi.tracker;
  await showDialog('NavigationLoading');

  if (match.params.resumed) {
    setHelpVisible(false);
    setInitialHelp(false);
  }

  await sceneDirector.start(MODE_NONE);

  // Get tour.
  const tourId = match.params.tourId;
  const tour = storage.activeProject.tours.find(tour => tour.id === tourId);

  if (!tour) {
    throw new Error('Tour not found!');
  }

  setTourName(tour.name);

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
  setPois(uniqBy(pois, '$id'));

  let index = -1;

  let paramIndex = Number.parseInt(match.params.poiIndex);
  if (!isNaN(paramIndex)) {
    index = paramIndex - 1;
  }
  setNextPoi(pois[index + 1]);
  setPoiIndex(index);

  if (tracker) {
    tracker.on('trackingTargetStatusChanged', updateTracking);
    if (storage.activeProject.trackingMap) {
      hideDialog();
      await tracker.reset();

      setTrackingMapProgress(0);
      setTrackingMapMessage('TrackingMapLoadInProgress');
      setTrackingMapProgressVisible(true);
      tracker.on('trackingMapLoadProgress', updateTrackingMapProgress);
      const success = await storage.activeProject.loadTrackingMap();
      tracker.off('trackingMapLoadProgress', updateTrackingMapProgress);
      setTrackingMapProgressVisible(false);

      if (!success) {
        showPrompt('NavigationTrackingMapNotFound', false, 'back');
        return;
      }
    }
    updateTracking();

    const hasQrCodes =
      tracker.targets &&
      !!tracker.targets.filter(target => target.type === getQrCodeType())
        .length;
    setHasQrCodes(hasQrCodes);
  } else {
    await sceneDirector.setMode(MODE_NAVIGATION);
  }

  await requestGuide();
  await hideDialog();
};

export const destroy = ({ updateTracking }) => async () => {
  const tracker = viewarApi.tracker;
  guide.dismissGuide();
  tracker && tracker.off('trackingTargetStatusChanged', updateTracking);
};

export const skipPoi = ({ selectPoi, poiIndex }) => async () => {
  selectPoi(poiIndex + 1);
};

export const selectPoi = ({
  setTourToolBarActive,
  setPoiIndex,
  pois,
  setNextPoi,
  setPoi,
}) => async index => {
  const poi = pois[index];
  const nextPoi = pois[index + 1];

  setTourToolBarActive(false);
  guide.pickDestination(poi);

  setPoi(poi);
  setPoiIndex(index);
  setNextPoi(nextPoi);
};

export const resetGuidePosition = ({}) => () => {
  guide.recalibrate();
};

export default compose(
  withState('waitDialogText', 'setWaitDialogText', ''),
  withState('helpVisible', 'setHelpVisible', false),
  withState('initialHelp', 'setInitialHelp', true),
  withState('trackingLost', 'setTrackingLost', false),
  withState('tourToolBarActive', 'setTourToolBarActive', false),
  withState('galleryImages', 'setGalleryImages', []),
  withState('galleryVisible', 'setGalleryVisible', false),
  withState('guideRequested', 'setGuideRequested', false),
  withState('hasQrCodes', 'setHasQrCodes', false),
  withState('tourName', 'setTourName', ''),
  withState('pois', 'setPois', []),
  withState('poi', 'setPoi', null),
  withState('nextPoi', 'setNextPoi', null),
  withState('poiIndex', 'setPoiIndex', -1),
  withState(
    'trackingMapMessage',
    'setTrackingMapMessage',
    'TrackingMapSaveInProgress'
  ),
  withState(
    'trackingMapProgressVisible',
    'setTrackingMapProgressVisible',
    false
  ),
  withState('trackingMapProgress', 'setTrackingMapProgress', 0),
  withState('promptVisible', 'setPromptVisible', false),
  withState('promptText', 'setPromptText', ''),
  withState('promptButton', 'setPromptButton', false),
  withState('promptAction', 'setPromptAction', ''),
  withProps(({ mode }) => ({
    waypointPlacementActive: mode === MODE_WAYPOINT_PLACEMENT,
    poiPlacementActive: mode === MODE_POI_PLACEMENT,
    navigationActive: mode === MODE_NAVIGATION,
    admin: false,
    userId: authManager.user.username,
  })),
  withProps(({ trackingLost, helpVisible, guideRequested }) => ({
    headerBarHidden: helpVisible,
    helpButtonHidden: guideRequested || trackingLost,
  })),
  withHandlers({
    goToPerspective,
    goBack,
  }),
  withHandlers({
    showPrompt,
    closePrompt,
    selectPoi,
  }),
  withHandlers({
    closeGallery,
    showGallery,
    showDialog,
    hideDialog,
    toggleTourToolBar,
    requestGuide,
    dismissGuide,
    toggleHelp,
    resetTracking,
    updateTracking,
    updateTrackingMapProgress,
    skipPoi,
    resetGuidePosition,
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
