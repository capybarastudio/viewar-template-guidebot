import merge from 'lodash/merge';
import defaults from 'lodash/defaults';
import viewarApi from 'viewar-api';

import { DEFAULT_CONFIG } from '../../constants';

const fetch = async () => {
  const {
    admin,
    usePoiImages,
    initialProject,
    debugStateMachine,
    showRobotHelpers,
    exposeServices,
    showDebugOutput,
    showGraphDuringNavigation,
    userAvoidanceEnabled,
    showReplayControls,
    showTargetNotification,
    environment,
    visualizeQrCodes,
    qrModel,
    robotModel,
    robot,
    projectId,
    language,
    demo,
    showFeatures,
    infoText,
    speechDisabled,
    qrCodeNearDistance,
    speaker,
    showObjects,
    objects,
    showPoiOriginalNames,
    chatbotUrl,
    greetUser,
    followMe,
    selectPoi,

    app = {},
    models = {},
    debug = {},
    guideParams = {},
    text = {},
  } = viewarApi.appConfig.uiConfig;

  merge(config, {
    app: defaults({}, app, {
      demo,
      admin,
      usePoiImages,
      initialProject,
      userAvoidanceEnabled,
      showTargetNotification,
      projectId,
      language,
      visualizeQrCodes,
      showFeatures,
      infoText,
      speechDisabled,
      speaker,
      qrCodeNearDistance,
      showObjects,
      showPoiOriginalNames,
      chatbotUrl,
    }),
    debug: defaults({}, debug, {
      debugStateMachine,
      showRobotHelpers,
      exposeServices,
      showDebugOutput,
      showGraphDuringNavigation,
      showReplayControls,
    }),
    models: defaults({}, models, {
      environment,
      qr: qrModel,
      guide: robotModel,
    }),
    guideParams: defaults({}, guideParams, {
      ...robot,
    }),
    text: defaults({}, text, {
      greetUser,
      followMe,
      selectPoi,
      ...text,
    }),
    objects,
  });
};

const set = newConfig => merge(config, newConfig);

const config = {
  ...DEFAULT_CONFIG,
  fetch,
  set,
};

export default config;
