import React from 'react';
import { MemoryRouter, Route, Switch } from 'react-router';

import {
  InfoView,
  LoginView,
  InitAppView,
  InitTrackerView,
  FilmQrCodeView,
  ManualView,
  MapSelectionView,
  MapView,
  MapEditView,
  MapCreationView,
  ModeSelectionView,
  PerspectiveView,
  PoiCaptureView,
  TourSelectionView,
  TourView,
  VoiceView,
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
      <Route exact path="/manual" component={ManualView} />
      <Route exact path="/map-selection" component={MapSelectionView} />
      <Route exact path="/map-view" component={MapView} />
      <Route exact path="/map-edit" component={MapEditView} />
      <Route exact path="/map-creation" component={MapCreationView} />
      <Route exact path="/mode-selection" component={ModeSelectionView} />
      <Route
        exact
        path="/perspective/:tourId/:poiIndex"
        component={PerspectiveView}
      />
      <Route exact path="/poi-capture" component={PoiCaptureView} />
      <Route exact path="/tour-selection" component={TourSelectionView} />
      <Route
        exact
        path="/tour/:tourId/:poiIndex?/:resumed?"
        component={TourView}
      />
      <Route exact path="/voice" component={VoiceView} />
    </Switch>
  </MemoryRouter>
);
