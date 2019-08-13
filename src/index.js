import './remote-console';
import viewarApi from 'viewar-api';
import viewarGuide from 'viewar-guide';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import {
  initDebugInfo,
  config,
  appState,
  graphController,
  storage,
  sceneDirector,
  graphVisualizer,
  qrCodeVisualizer,
  camera,
  authManager,
  poiPlacement,
  waypointPlacement,
  objectAnimation,
  translationProvider,
  translate,
} from './services';
import {
  MODE_WAYPOINT_PLACEMENT,
  MODE_NAVIGATION,
  MODE_NONE,
  MODE_POI_PLACEMENT,
} from './services/scene-director/modes';

import App from './app';

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

  viewarApi.coreInterface.on('trackingTargetStatusChanged', (...args) =>
    console.info('trackingTargetStatusChanged', ...args)
  );
  viewarApi.coreInterface.on('customTrackingInfo', (...args) =>
    console.info('customTrackingInfo', ...args)
  );

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
