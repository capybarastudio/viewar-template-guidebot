import React from 'react';
import { MemoryRouter, Route, Switch } from 'react-router';
// import { AnimatedSwitch } from 'react-router-transition'

import NavigateView from './views/navigate';
import InfoView from './views/info';
import LoginView from './views/login';
import InitAppView from './views/init-app';
import InitTrackerView from './views/init-tracker';
import FilmQrCodeView from './views/film-qr-code';
import MapSelectionView from './views/map-selection';
import MapView from './views/map-view';
import MapEditView from './views/map-edit';
import MapCreationView from './views/map-creation';
import PoiCaptureView from './views/poi-capture';

import '../css/global.css';

export default ({}) => (
  <MemoryRouter key="router">
    <Switch>
      <Route exact path="/" component={InitAppView} />
      <Route exact path="/login" component={LoginView} />
      <Route exact path="/info" component={InfoView} />
      <Route exact path="/init-tracker" component={InitTrackerView} />
      <Route exact path="/film-qr-code" component={FilmQrCodeView} />
      <Route exact path="/navigate" component={NavigateView} />
      <Route exact path="/map-selection" component={MapSelectionView} />
      <Route exact path="/map-view" component={MapView} />
      <Route exact path="/map-edit" component={MapEditView} />
      <Route exact path="/map-creation" component={MapCreationView} />
      <Route exact path="/poi-capture" component={PoiCaptureView} />
    </Switch>
  </MemoryRouter>
);
