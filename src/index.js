import viewarApi from 'viewar-api';
import viewarGuide from 'viewar-guide';
import React from 'react';
import ReactDOM from 'react-dom';

import graphController from './services/graph-controller';
import storage from './services/storage';
import sceneDirector from './services/scene-director';
import graphVisualizer from './services/graph-visualizer';
import qrCodeVisualizer from './services/qr-code-visualizer';
import camera from './services/camera';
import authManager from './services/auth-manager';
import poiPlacement from './services/poi-placement';
import waypointPlacement from './services/waypoint-placement';
import objectAnimation from './services/object-animation';
import translationProvider, { translate } from './services/translations';
import {
  MODE_WAYPOINT_PLACEMENT,
  MODE_NAVIGATION,
  MODE_NONE,
  MODE_POI_PLACEMENT,
} from './services/scene-director/modes';

import App from './app';

import config from './services/config';
import appState from './services/app-state';
import createKeyboardJoystick from './components/walk-control/joysticks/keyboard-joystick';

const movementKeys = {
  'x+': 68,
  'x-': 65,
  'y+': 83,
  'y-': 87,
};

const rotationKeys = {
  'x+': 39,
  'x-': 37,
  'y+': 38,
  'y-': 40,
};

let lastMovement = {
  x: 0,
  y: 0,
};

let lastRotation = {
  x: 0,
  y: 0,
};

const handleMovement = async ({ x, y, z }) => {
  if (lastMovement.x !== x || lastMovement.y !== y) {
    lastMovement = { x, y };
    return viewarApi.cameras.vrCamera.translate({
      x: x,
      y: 0,
      z: y,
    });
  }
};

const handleRotation = async ({ x, y, z }) => {
  if (lastRotation.x !== x || lastRotation.y !== y) {
    lastRotation = { x, y };
    return viewarApi.cameras.vrCamera.rotate({
      x: y,
      y: -x,
      z: 0,
    });
  }
};
const keyboardMovementJoystick = createKeyboardJoystick({
  maxValue: 20,
  keys: movementKeys,
  onUpdate: handleMovement,
});
const keyboardRotationJoystick = createKeyboardJoystick({
  maxValue: 1 / (Math.PI * 30),
  keys: rotationKeys,
  onUpdate: handleRotation,
});

(async function main() {
  if (window.Module) {
    window.Module.print = () => {};
    window.Module.printErr = () => {};
  }
  window.api = await viewarApi.init({
    logToScreen: process.env.NODE_ENV !== 'production',
    waitForDebugger: false,
  });
  viewarApi.cameras.arCamera.startPoseUpdate();

  await config.fetch();

  if (viewarApi.coreInterface.platform === 'Emscripten') {
    keyboardMovementJoystick.attach();
    keyboardRotationJoystick.attach();
  }

  appState.activeProject = config.app.initialProject;

  window.debugInfo = {};
  window.debugLog = [];

  const infoContainer = document.getElementById('output-container');
  const logContainer = document.getElementById('log-container');

  window.updateDebugInfo = function() {
    if (config.debug.showDebugOutput) {
      infoContainer.style.display = 'block';
      logContainer.style.display = 'block';

      document.getElementById('output').innerHTML = JSON.stringify(
        debugInfo,
        null,
        '  '
      );
      document.getElementById('log').innerHTML = JSON.stringify(
        debugLog,
        null,
        '  '
      );

      logContainer.scrollTop = logContainer.scrollHeight;
    } else {
      infoContainer.style.display = 'none';
      logContainer.style.display = 'none';
    }
  };
  infoContainer.addEventListener('click', async () => {
    const body = new FormData();
    body.append('data', JSON.stringify(window.debugLog));

    try {
      await fetch(
        'https://dev2.viewar.com/api40/log/note:guidebot-log/type:Test/',
        {
          method: 'POST',
          body,
        }
      );
    } catch (error) {
      alert(error);
    }

    alert('OK!');
  });

  // if (config.debug.exposeServices) {
  Object.assign(window, {
    config,
    graphController,
    storage,
    sceneDirector,
    graphVisualizer,
    guide: viewarGuide,
    authManager,
    appState,
    poiPlacement,
    waypointPlacement,
    qrCodeVisualizer,
    objectAnimation,
    translate,
    translationProvider,
    camera,
    MODE_WAYPOINT_PLACEMENT,
    MODE_NAVIGATION,
    MODE_NONE,
    MODE_POI_PLACEMENT,
  });
  // }

  const rootElement = document.getElementById('app-root');
  const render = Component => {
    ReactDOM.render(<Component />, rootElement);
  };

  render(App);

  if (module.hot) {
    module.hot.accept(App, () => {
      render(App);
    });
  }
})();
