import Vector3 from './vector3';

const EPSILON = 2 ** -16;

export default class Quaternion {
  static get IDENTITY() {
    return new Quaternion(1, 0, 0, 0);
  }

  static fromAxisAngle({ x, y, z }, phi) {
    const self = new Quaternion();

    return self
      .set(
        Math.cos(phi / 2),
        x * Math.sin(phi / 2),
        y * Math.sin(phi / 2),
        z * Math.sin(phi / 2)
      )
      .normalize();
  }

  fromAxisAngle({ x, y, z }, phi) {
    return this.set(
      Math.cos(phi / 2),
      x * Math.sin(phi / 2),
      y * Math.sin(phi / 2),
      z * Math.sin(phi / 2)
    ).normalize();
  }

  static fromUnitVectors(from, to) {
    const self = new Quaternion();

    let r = from.dot(to) + 1;

    if (r < EPSILON) {
      r = 0;

      if (Math.abs(from.x) > Math.abs(from.z)) {
        TEMP_V1.set(-from.y, from.x, 0);
      } else {
        TEMP_V1.set(0, -from.z, from.y);
      }
    } else {
      TEMP_V1.copy(from).cross(to);
    }

    return self.set(r, TEMP_V1.x, TEMP_V1.y, TEMP_V1.z).normalize();
  }

  fromUnitVectors(from, to) {
    let r = from.dot(to) + 1;

    if (r < EPSILON) {
      r = 0;

      if (Math.abs(from.x) > Math.abs(from.z)) {
        TEMP_V1.set(-from.y, from.x, 0);
      } else {
        TEMP_V1.set(0, -from.z, from.y);
      }
    } else {
      TEMP_V1.copy(from).cross(to);
    }

    return this.set(r, TEMP_V1.x, TEMP_V1.y, TEMP_V1.z).normalize();
  }

  constructor(...args) {
    if (args.length === 0) {
      this.w = 1;
      this.x = 0;
      this.y = 0;
      this.z = 0;
    } else if (args.length === 1) {
      if (args[0] && typeof args[0] === 'object') {
        this.w = args[0].w;
        this.x = args[0].x;
        this.y = args[0].y;
        this.z = args[0].z;
      } else if (args[0] instanceof Array) {
        this.w = args[0][0];
        this.x = args[0][1];
        this.y = args[0][2];
        this.z = args[0][3];
      } else {
        throw new Error();
      }
    } else if (args.length === 4) {
      this.w = args[0];
      this.x = args[1];
      this.y = args[2];
      this.z = args[3];
    } else {
      throw new Error();
    }
  }

  set(w, x, y, z) {
    this.w = w;
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  copy(other) {
    this.w = other.w;
    this.x = other.x;
    this.y = other.y;
    this.z = other.z;
    return this;
  }

  clone() {
    return new Quaternion(this.w, this.x, this.y, this.z);
  }

  multiply(other) {
    return Object.assign(this, {
      w:
        this.w * other.w -
        this.x * other.x -
        this.y * other.y -
        this.z * other.z,
      x:
        this.w * other.x +
        this.x * other.w +
        this.y * other.z -
        this.z * other.y,
      y:
        this.w * other.y +
        this.y * other.w +
        this.z * other.x -
        this.x * other.z,
      z:
        this.w * other.z +
        this.z * other.w +
        this.x * other.y -
        this.y * other.x,
    });
  }

  lengthSquared() {
    return this.w ** 2 + this.x ** 2 + this.y ** 2 + this.z ** 2;
  }

  length() {
    return Math.hypot(this.w, this.x, this.y, this.z);
  }

  normalize() {
    const lengthSquared = this.lengthSquared();
    if (Math.abs(lengthSquared - 1) < EPSILON) {
      return this;
    } else {
      const length = Math.sqrt(lengthSquared);
      return Object.assign(this, {
        w: this.w / length,
        x: this.x / length,
        y: this.y / length,
        z: this.z / length,
      });
    }
  }

  invert() {
    // Assumes quaternion is normalized
    return this.conjugate();
  }

  conjugate() {
    return Object.assign(this, {
      w: this.w,
      x: -this.x,
      y: -this.y,
      z: -this.z,
    });
  }

  dot(other) {
    return (
      this.w * other.w + this.x * other.x + this.y * other.y + this.z * other.z
    );
  }

  equals(other) {
    // Assumes both quaternions are normalized
    return Math.abs(Math.abs(this.dot(other)) - 1) < EPSILON;
  }

  toAxisAngle() {
    const { w, x, y, z } = this;

    const angle = 2 * Math.acos(w);
    const s = Math.sqrt(1 - w ** 2);

    const axis =
      s < EPSILON ? new Vector3(1, 0, 0) : new Vector3(x / s, y / s, z / s);

    return {
      angle,
      axis,
    };
  }

  toAngleAround(axis) {
    axis = axis.clone().normalize();

    const orthonormal =
      axis.y !== 0 || axis.z !== 0
        ? new Vector3(0, -axis.z, axis.y)
        : new Vector3(-axis.z, 0, axis.x);

    const transformed = orthonormal.clone().rotate(this);

    const flattened = transformed
      .clone()
      .subtract(axis.clone().scale(transformed.dot(axis)))
      .normalize();

    return Math.acos(orthonormal.dot(flattened));
  }

  toEulerAngles() {
    const test = this.x * this.y + this.z * this.w;
    if (test > 0.499) {
      // singularity at north pole
      let heading = 2 * Math.atan2(this.x, this.w);
      let attitude = Math.PI / 2;
      let bank = 0;
      return { heading, bank, attitude };
    }
    if (test < -0.499) {
      // singularity at south pole
      let heading = -2 * Math.atan2(this.x, this.w);
      let attitude = -Math.PI / 2;
      let bank = 0;
      return { heading, bank, attitude };
    }
    const sqx = this.x * this.x;
    const sqy = this.y * this.y;
    const sqz = this.z * this.z;
    let heading = Math.atan2(
      2 * this.y * this.w - 2 * this.x * this.z,
      1 - 2 * sqy - 2 * sqz
    );
    let attitude = Math.asin(2 * test);
    let bank = Math.atan2(
      2 * this.x * this.w - 2 * this.y * this.z,
      1 - 2 * sqx - 2 * sqz
    );
    return { heading, bank, attitude };
  }

  slerp(qb, t) {
    const result = this;
    const qa = this;

    if (t === 0) return result;
    if (t === 1) return result.copy(qb);

    let cosHalfTheta = qa.dot(qb);

    if (cosHalfTheta < 0) {
      qb = TEMP_Q1.copy(qb);
      qb.w = -qb.w;
      qb.x = -qb.x;
      qb.y = -qb.y;
      qb.z = -qb.z;

      cosHalfTheta = -cosHalfTheta;
    }

    if (cosHalfTheta >= 1.0) return result;

    const sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta ** 2);

    if (Math.abs(sinHalfTheta) < 0.001) {
      // lerp
      result.w = 0.5 * (qa.w + qb.w);
      result.x = 0.5 * (qa.x + qb.x);
      result.y = 0.5 * (qa.y + qb.y);
      result.z = 0.5 * (qa.z + qb.z);

      return result;
    }

    const halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
    const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
    const ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

    result.w = qa.w * ratioA + qb.w * ratioB;
    result.x = qa.x * ratioA + qb.x * ratioB;
    result.y = qa.y * ratioA + qb.y * ratioB;
    result.z = qa.z * ratioA + qb.z * ratioB;

    return result;
  }
}

const TEMP_Q1 = new Quaternion();
const TEMP_V1 = new Vector3();
const TEMP_V2 = new Vector3();
const TEMP_V3 = new Vector3();

//window.Quaternion = Quaternion
