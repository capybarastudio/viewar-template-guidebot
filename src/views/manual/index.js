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
  appState,
  sceneDirector,
  config,
} from '../../services';
import guide from 'viewar-guide';

import {
  MODE_WAYPOINT_PLACEMENT,
  MODE_POI_PLACEMENT,
  MODE_NAVIGATION,
  MODE_NONE,
} from '../../services/scene-director/modes';

import render from './template.jsx';

export const goTo = ({ history }) => path => {
  history.push(path);
};

export const goBack = ({ history }) => () => {
  if (
    getUiConfigPath('app.voiceDisabled') &&
    getUiConfigPath('app.tourDisabled')
  ) {
    history.push(appState.modeBackPath || '/');
  } else {
    history.push('/mode-selection');
  }
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

export const requestGuideWithToolBar = ({
  setNavigationToolBarActive,
  setGuideRequested,
}) => () => {
  guide.requestGuide(
    () => {
      setGuideRequested(false);
      setNavigationToolBarActive(false);
    },
    {
      greet: getUiConfigPath('text.selectPoi'),
    }
  );
  setGuideRequested(true);
  setNavigationToolBarActive(true);
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

export const navigateTo = ({ setNavigationToolBarActive }) => async poi => {
  setNavigationToolBarActive(false);
  guide.pickDestination(poi);
};

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
}) => async () => {
  const tracker = viewarApi.tracker;
  await showDialog('NavigationLoading');

  await sceneDirector.start(MODE_NONE);

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

  await hideDialog();
};

export const destroy = ({ updateTracking }) => async () => {
  const tracker = viewarApi.tracker;
  guide.dismissGuide();
  tracker && tracker.off('trackingTargetStatusChanged', updateTracking);
};

export default compose(
  withState('waitDialogText', 'setWaitDialogText', ''),
  withState('helpVisible', 'setHelpVisible', false),
  withState('initialHelp', 'setInitialHelp', true),
  withState('trackingLost', 'setTrackingLost', false),
  withState('navigationToolBarActive', 'setNavigationToolBarActive', false),
  withState('galleryImages', 'setGalleryImages', []),
  withState('galleryVisible', 'setGalleryVisible', false),
  withState('guideRequested', 'setGuideRequested', false),
  withState('hasQrCodes', 'setHasQrCodes', false),
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
    goTo,
    goBack,
  }),
  withHandlers({
    showPrompt,
    closePrompt,
  }),
  withHandlers({
    closeGallery,
    showGallery,
    showDialog,
    hideDialog,
    requestGuideWithToolBar,
    dismissGuide,
    toggleHelp,
    resetTracking,
    navigateTo,
    updateTracking,
    updateTrackingMapProgress,
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
