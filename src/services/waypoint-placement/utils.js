import Plane from '../../math/plane';
import Vector3 from '../../math/vector3';
import Ray from '../../math/ray';

/**
 * Calculate position with ray casted onto plane defined by nearest three featurepoints.
 */
export const getPosition = async hits => {
  const plane = getFeaturePointPlane(hits.featurePoints);
  if (plane) {
    const ray = new Ray(hits.ray);
    const { intersects, distance } = plane.getRayIntersection(ray);
    if (intersects) {
      return ray.origin.add(ray.direction.scale(distance));
    }
  }
};

/**
 * Get plane from three nearest feature points.
 */
const getFeaturePointPlane = featurePoints => {
  if (featurePoints.length >= 3) {
    const p1 = new Vector3(featurePoints[0].position);
    const p2 = new Vector3(featurePoints[1].position);
    const p3 = new Vector3(featurePoints[2].position);

    return Plane.fromPoints(p1, p2, p3);
  }
};
