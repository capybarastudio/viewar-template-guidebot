import React from 'react';
import { MemoryRouter, Route, Switch } from 'react-router';

import {
  NavigateView,
  InfoView,
  LoginView,
  InitAppView,
  InitTrackerView,
  FilmQrCodeView,
  MapSelectionView,
  MapView,
  MapEditView,
  MapCreationView,
  PoiCaptureView,
} from './views';

import '../css/global.scss';

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
