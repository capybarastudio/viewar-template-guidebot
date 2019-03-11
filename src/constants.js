export const GRAPH_CONTAINER_ID = 'GraphContainer';
export const GRAPH_REDRAW_DELAY = 250; // 250ms

export const QR_CODES_CONTAINER_ID = 'QrCodesContainer';
export const QR_CODES_HIGHLIGHT_TIME = 10000; // 10s

//======================================================================================================================

export const NO_WAYPOINT = Object.freeze({
  pose: {
    position: { x: NaN, y: NaN, z: NaN },
    orientation: { w: NaN, x: NaN, y: NaN, z: NaN },
    scale: { x: NaN, y: NaN, z: NaN },
  },
});

export const NO_INTERACTION = Object.freeze({
  translation: false,
  rotation: false,
  scaling: false,
});

export const INTERACTION = Object.freeze({
  translation: true,
  rotation: false,
  scaling: false,
});

export const INITIAL_GUIDE_PARAMS = Object.freeze({
  pose: {
    position: { x: 0, y: 100000, z: 0 },
    orientation: { w: 1, x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
  },
  interaction: NO_INTERACTION,
  visible: false,
});

//======================================================================================================================

export const FPS = 30;
export const SECOND = 1000;
export const FRAME_LENGTH = SECOND / FPS;
export const METER = 1000;
export const FULL_CIRCLE = 2 * Math.PI;
export const HALF_CIRCLE = FULL_CIRCLE / 2;

//=====================================================================================================================

export const DEFAULT_CONFIG = Object.freeze({
  app: {
    admin: false,
    usePoiImages: false,
    userAvoidanceEnabled: false,
    showTargetNotification: false,
    visualizeQrCodes: false,
    defaultUser: 'tempuser',
    initialProject: null,
    projectId: 'guidebot-978f7',
    language: 'en-US',
    viewDistance: 20 * METER,
    showFeatures: false,
    infoText: '',
    speechDisabled: false,
    qrCodeNearDistance: 5 * METER,
    showObjects: false,
    showPoiOriginalNames: false,
    chatbotUrl: false,
    useFeaturePointPlacement: false,
  },
  debug: {
    debugStateMachine: false,
    showRobotHelpers: false,
    exposeServices: false,
    showDebugOutput: false,
    showGraphDuringNavigation: false,
    showReplayControls: false,
  },
  models: {
    qr: 'guidebot_qrcode',
    guide: 'guidebot_robot_v4',
    reticule: 'guidebot_reticule',
    poi: 'guidebot_poi',
    path: 'guidebot_path',
    waypoint: 'guidebot_waypoint',
  },
  fallbackModels: {
    qr: '55563',
    guide: '56664',
    reticule: '54428',
    poi: '54426',
    path: '54429',
    waypoint: '54383',
  },
  guideParams: {
    spawnDistance: 2 * METER,
    nearDistance: 2 * METER,
    farDistance: 4 * METER,
    minProximityRadius: 0.1 * METER,
    verticalCutoff: 2 * METER,
    maxLinearVelocity: METER / FPS,
    maxAngularVelocity: FULL_CIRCLE / 3 / FPS,
    linearAcceleration: METER / FPS / FPS,
  },
  text: {
    greetUser: 'Hi there! How can I help you?',
    followMe: 'Sure, follow me!',
    selectPoi: 'Hi there! Please select a point of interest.',
  },
});
