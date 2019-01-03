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
  withState('helpTimeout', 'setHelpTimeout', false),
  withState('trackingLost', 'setTrackingLost', false),
  withState('navigationToolbarActive', 'setNavigationToolbarActive', false),
  withState('galleryImages', 'setGalleryImages', []),
  withState('galleryVisible', 'setGalleryVisible', false),
  withState('guideRequested', 'setGuideRequested', false),
  withState('hasQrCodes', 'setHasQrCodes', false),
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
    closeGallery: ({ setGalleryVisible }) => () => setGalleryVisible(false),
    showGallery: ({ setGalleryVisible, setGalleryImages }) => images => {
      setGalleryImages(images);
      setGalleryVisible(true);
    },
    goBack,
    showDialog: ({ setWaitDialogText }) => async text => {
      setWaitDialogText(text);
      await waitForUiUpdate();
    },
    hideDialog: ({ setWaitDialogText }) => async () => {
      setWaitDialogText('');
      await waitForUiUpdate();
    },
    requestGuideWithToolbar: ({
      config,
      setNavigationToolbarActive,
      setGuideRequested,
      guide,
    }) => () => {
      guide.requestGuide(() => {
        setGuideRequested(false);
        setNavigationToolbarActive(false);
      }, config.text.selectPoi);
      setGuideRequested(true);
      setNavigationToolbarActive(true);
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
      helpTimeout,
      setHelpTimeout,
    }) => visible => {
      const visibility = typeof visible === 'boolean' ? visible : !helpVisible;
      setHelpVisible(visibility);

      if (visibility) {
        clearTimeout(helpTimeout);
        setHelpTimeout(setTimeout(() => setHelpVisible(false), 5000));
      } else {
        clearTimeout(helpTimeout);
      }
    },
    resetTracking: ({ history }) => () => history.push('/init-tracker'),
    navigateTo: ({ setNavigationToolbarActive, guide }) => async poi => {
      setNavigationToolbarActive(false);
      guide.pickDestination(poi);
    },
    updateTracking: ({
      setTrackingLost,
      viewarApi: { trackers },
    }) => async () => {
      const tracker = Object.values(trackers)[0];

      let tracking = true;
      if (tracker.loadTrackingMap) {
        tracking = tracker.targets.filter(
          target => target.type === 'map' && target.tracked
        ).length;
      }

      setTrackingLost(!tracking);

      if (tracking) {
        await sceneDirector.setMode(MODE_NAVIGATION);
      } else {
        await sceneDirector.setMode(MODE_NONE);
      }
    },
  }),
  lifecycle({
    async componentDidMount() {
      const {
        updateTracking,
        showDialog,
        sceneDirector,
        hideDialog,
        viewarApi: { trackers },
        setHasQrCodes,
      } = this.props;
      await showDialog('NavigationLoading');

      await sceneDirector.start(MODE_NONE);

      const tracker = Object.values(trackers)[0];
      if (tracker) {
        tracker.on('trackingTargetStatusChanged', updateTracking);
        if (storage.activeProject.trackingMap) {
          await showDialog('NavigationLoadingMap');
          await tracker.reset();
          await storage.activeProject.loadTrackingMap();
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
        viewarApi: { trackers },
        guide,
        updateTracking,
        helpTimeout,
      } = this.props;
      clearTimeout(helpTimeout);

      guide.dismissGuide();

      const tracker = Object.values(trackers)[0];
      tracker && tracker.off('trackingTargetStatusChanged', updateTracking);
    },
  })
)(render);
