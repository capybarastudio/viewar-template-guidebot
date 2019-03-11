import Vector3 from './vector3';
import Quaternion from './quaternion';

export default class Plane {
  static get XY_PLANE() {
    return Plane.fromNormalPoint(Vector3.Z_AXIS, Vector3.ZERO);
  }

  static get XZ_PLANE() {
    return Plane.fromNormalPoint(Vector3.Y_AXIS, Vector3.ZERO);
  }

  static get YZ_PLANE() {
    return Plane.fromNormalPoint(Vector3.X_AXIS, Vector3.ZERO);
  }

  static fromNormalPoint(normal, point) {
    return new Plane(normal, -point.dot(normal));
  }

  static fromPoints(p1, p2, p3, reverseDirection = false) {
    const p21 = p1.clone().subtract(p2);
    const p23 = p3.clone().subtract(p2);
    const normal = p21.cross(p23).normalize();

    if (reverseDirection) {
      normal.invert();
    }

    return new Plane(normal, -p1.dot(normal));
  }

  set({ x, y, z }, constant) {
    this.normal.set(x, y, z);
    this.constant = constant;
    return this;
  }

  setFrom({ normal, constant }) {
    this.normal.copy(normal);
    this.constant = constant;
    return this;
  }

  constructor(normal, constant) {
    this.normal = normal;
    this.constant = constant;
  }

  distanceToPoint(point) {
    return this.normal.dot(point) + this.constant;
  }

  invert() {
    this.normal.invert();
    this.constant *= -1;
    return this;
  }

  getOrientation() {
    return Quaternion.fromVectors(Vector3.Z_AXIS, this.normal);
  }

  projectPointOnto(p1) {
    const distance = this.distanceToPoint(p1);
    return p1.clone().add(
      this.normal
        .clone()
        .invert()
        .scale(distance)
    );
  }

  getRayIntersection(ray) {
    let intersects = false;
    let distance = 0;
    const denom = this.normal.clone().dot(ray.direction);
    if (Math.abs(denom) > 1e-6) {
      const nom = this.normal.dot(ray.origin) + this.constant;
      const t = -(nom / denom);
      if (t >= 0) {
        distance = t;
        intersects = true;
      }
    }

    return {
      intersects,
      distance,
    };
  }
}
