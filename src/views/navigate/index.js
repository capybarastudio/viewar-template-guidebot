import {
  compose,
  withProps,
  withState,
  withHandlers,
  lifecycle,
} from 'recompose';
import viewarApi, { coreInterface } from 'viewar-api';
import waitForUiUpdate from '../../utils/wait-for-ui-update';
import storage from '../../services/storage';
import authManager from '../../services/auth-manager';
import appState from '../../services/app-state';
import sceneDirector from '../../services/scene-director';
import guide from 'viewar-guide';
import config from '../../services/config';

import {
  MODE_WAYPOINT_PLACEMENT,
  MODE_POI_PLACEMENT,
  MODE_NAVIGATION,
  MODE_NONE,
} from '../../services/scene-director/modes';

import render from './template.jsx';

export const goBack = ({ history, appState }) => () => {
  history.push(appState.navigateBackPath || '/');
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
  withProps(({ mode }) => ({
    sceneDirector,
    storage,
    authManager,
    appState,
    guide,
    config,
    viewarApi,
    waypointPlacementActive: mode === MODE_WAYPOINT_PLACEMENT,
    poiPlacementActive: mode === MODE_POI_PLACEMENT,
    navigationActive: mode === MODE_NAVIGATION,
    admin: false,
    userId: authManager.user.username,
  })),
  withProps(({ helpVisible }) => ({
    headerBarHidden: helpVisible,
    speechDisabled: config.app.speechDisabled,
  })),
  withHandlers({
    goBack,
  }),
  withState('promptVisible', 'setPromptVisible', false),
  withState('promptText', 'setPromptText', ''),
  withState('promptButton', 'setPromptButton', false),
  withState('promptAction', 'setPromptAction', ''),
  withHandlers({
    showPrompt: ({
      setPromptVisible,
      setPromptText,
      setPromptAction,
      setPromptButton,
    }) => (text, button, action) => {
      setPromptText(text);
      setPromptVisible(true);
      setPromptAction(action);
      setPromptButton(button);
    },
    closePrompt: ({ goBack, promptAction, setPromptVisible }) => () => {
      switch (promptAction) {
        case 'back':
          goBack();
          break;
      }

      setPromptVisible(false);
    },
  }),
  withHandlers({
    closeGallery: ({ setGalleryVisible }) => () => setGalleryVisible(false),
    showGallery: ({ setGalleryVisible, setGalleryImages }) => images => {
      setGalleryImages(images);
      setGalleryVisible(true);
    },
    showDialog: ({ setWaitDialogText }) => async text => {
      setWaitDialogText(text);
      await waitForUiUpdate();
    },
    hideDialog: ({ setWaitDialogText }) => async () => {
      setWaitDialogText('');
      await waitForUiUpdate();
    },
    requestGuideWithToolBar: ({
      config,
      setNavigationToolBarActive,
      setGuideRequested,
      guide,
    }) => () => {
      guide.requestGuide(() => {
        setGuideRequested(false);
        setNavigationToolBarActive(false);
      }, config.text.selectPoi);
      setGuideRequested(true);
      setNavigationToolBarActive(true);
    },
    requestGuide: ({ setGuideRequested, guide }) => () => {
      guide.requestGuide(() => {
        setGuideRequested(false);
      });
      setGuideRequested(true);
    },
    dismissGuide: ({ guide }) => () => {
      guide.dismissGuide();
    },
    toggleHelp: ({
      helpVisible,
      setHelpVisible,
      setInitialHelp,
    }) => visible => {
      const visibility = typeof visible === 'boolean' ? visible : !helpVisible;
      setHelpVisible(visibility);
      setInitialHelp(false);
    },
    resetTracking: ({ history }) => () => history.push('/init-tracker'),
    navigateTo: ({ setNavigationToolBarActive, guide }) => async poi => {
      setNavigationToolBarActive(false);
      guide.pickDestination(poi);
    },
    updateTracking: ({
      setTrackingLost,
      viewarApi: { tracker },
      setHelpVisible,
      initialHelp,
    }) => async () => {
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
    },
    updateTrackingMapProgress: ({ setTrackingMapProgress }) => progress => {
      setTrackingMapProgress(progress * 100);
    },
  }),
  lifecycle({
    async componentDidMount() {
      const {
        updateTracking,
        showDialog,
        sceneDirector,
        hideDialog,
        viewarApi: { tracker },
        setHasQrCodes,
        updateTrackingMapProgress,
        setTrackingMapMessage,
        setTrackingMapProgressVisible,
        setTrackingMapProgress,
        showPrompt,
      } = this.props;
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
          !!tracker.targets.filter(target => target.type === 'image').length;
        setHasQrCodes(hasQrCodes);
      } else {
        sceneDirector.setMode(MODE_NAVIGATION);
      }

      await hideDialog();
    },
    componentWillUnmount() {
      const {
        viewarApi: { tracker },
        guide,
        updateTracking,
      } = this.props;

      guide.dismissGuide();
      tracker && tracker.off('trackingTargetStatusChanged', updateTracking);
    },
  })
)(render);
