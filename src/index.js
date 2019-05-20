import viewarApi from 'viewar-api';
import viewarGuide from 'viewar-guide';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

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

import { initDebugInfo } from './services/debug-info';
import config from './services/config';
import appState from './services/app-state';
import {
  keyboardMovementJoystick,
  keyboardRotationJoystick,
} from './services/joysticks';

(async function main() {
  if (window.Module) {
    window.Module.print = () => {};
    window.Module.printErr = () => {};
  }

  window.api = await viewarApi.init({
    logToScreen: process.env.NODE_ENV !== 'production',
    waitForDebugger: false,
  });

  await config.fetch();

  if (viewarApi.coreInterface.platform === 'Emscripten') {
    keyboardMovementJoystick.attach();
    keyboardRotationJoystick.attach();
  }
  initDebugInfo();

  appState.activeProject = config.app.initialProject;

  if (config.debug.exposeServices) {
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
  }

  const rootElement = document.getElementById('app-root');
  const render = Component => {
    ReactDOM.render(
      <AppContainer>
        <Component />
      </AppContainer>,
      rootElement
    );
  };

  render(App);

  if (module.hot) {
    module.hot.accept('./app', () => {
      const App = require('./app').default;
      render(App);
    });
  }
})();
