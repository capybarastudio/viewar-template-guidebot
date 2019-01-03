import graphVisualizer from '../graph-visualizer';
import qrCodeVisualizer from '../qr-code-visualizer';
import { offTick, onTick } from './tick';
import guide from 'viewar-guide';
import waypointPlacement from '../waypoint-placement';
import poiPlacement from '../poi-placement';
import graphController from '../graph-controller';
import objectAnimation from '../object-animation';
import distanceMeasurement from '../distance-measurement';
import createSceneDirector from './scene-director';
import camera from '../camera';

const initialModules = [
  waypointPlacement,
  poiPlacement,
  distanceMeasurement,
  graphVisualizer,
  qrCodeVisualizer,
  guide,
  objectAnimation,
];

export default createSceneDirector({
  initialModules,
  graphController,
  camera,
  guide,
  onTick,
  offTick,
});
