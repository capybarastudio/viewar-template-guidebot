import Vector3 from './vector3';
import Quaternion from './quaternion';

export default class Ray {
  static fromPose(pose) {
    const orientation = new Quaternion(pose.orientation);
    const origin = new Vector3(pose.position);
    const direction = Vector3.Z_AXIS.rotate(orientation);

    return new Ray(origin, direction);
  }

  constructor(...args) {
    if (args.length === 0) {
      this._origin = Vector3.ZERO;
      this._direction = Vector3.Y_AXIS;
    } else if (args.length === 1) {
      if (args[0] && typeof args[0] === 'object') {
        const { origin, direction } = args[0];
        Object.assign(this, {
          _origin: new Vector3(origin),
          _direction: new Vector3(direction),
        });
      } else if (args[0] instanceof Array) {
        const [origin, direction] = args[0];
        Object.assign(this, {
          _origin: new Vector3(origin),
          _direction: new Vector3(direction),
        });
      } else {
        throw new Error();
      }
    } else if (args.length === 2) {
      const [origin, direction] = args;
      Object.assign(this, {
        _origin: new Vector3(origin),
        _direction: new Vector3(direction),
      });
    } else {
      throw new Error();
    }
  }

  get origin() {
    return this._origin.clone();
  }

  get direction() {
    return this._direction.clone();
  }
}
