import createDistanceMeasurement from './distance-measurement';
import camera from '../camera';
import { calculateDistanceFromVectorsSquared } from '../../math/math';

export default createDistanceMeasurement({
  camera,
  calculateDistance: calculateDistanceFromVectorsSquared,
});
