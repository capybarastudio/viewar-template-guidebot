const EPSILON = 2 ** -16;

export default class Vector3 {
  static get ZERO() {
    return new Vector3(0, 0, 0);
  }

  static get X_AXIS() {
    return new Vector3(1, 0, 0);
  }

  static get Y_AXIS() {
    return new Vector3(0, 1, 0);
  }

  static get Z_AXIS() {
    return new Vector3(0, 0, 1);
  }

  static get UNIT_SCALE() {
    return new Vector3(1, 1, 1);
  }

  constructor(...args) {
    if (args.length === 0) {
      this.x = 0;
      this.y = 0;
      this.z = 0;
    } else if (args.length === 1) {
      if (args[0] && typeof args[0] === 'object') {
        const { x, y, z } = args[0];
        Object.assign(this, { x, y, z });
      } else if (args[0] instanceof Array) {
        const [x, y, z] = args[0];
        Object.assign(this, { x, y, z });
      } else {
        throw new Error();
      }
    } else if (args.length === 3) {
      const [x, y, z] = args;
      Object.assign(this, { x, y, z });
    } else {
      throw new Error();
    }
  }

  set(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  setX(x) {
    this.x = x;
    return this;
  }

  setY(y) {
    this.y = y;
    return this;
  }

  setZ(z) {
    this.z = z;
    return this;
  }

  copy(other) {
    this.x = other.x;
    this.y = other.y;
    this.z = other.z;
    return this;
  }

  clone() {
    return new Vector3(this.x, this.y, this.z);
  }

  cross(other) {
    return Object.assign(this, {
      x: this.y * other.z - this.z * other.y,
      y: this.z * other.x - this.x * other.z,
      z: this.x * other.y - this.y * other.x,
    });
  }

  scale(scalar) {
    return Object.assign(this, {
      x: this.x * scalar,
      y: this.y * scalar,
      z: this.z * scalar,
    });
  }

  add(other) {
    return Object.assign(this, {
      x: this.x + other.x,
      y: this.y + other.y,
      z: this.z + other.z,
    });
  }

  subtract(other) {
    return Object.assign(this, {
      x: this.x - other.x,
      y: this.y - other.y,
      z: this.z - other.z,
    });
  }

  length() {
    return Math.hypot(this.x, this.y, this.z);
  }

  lengthSq() {
    return this.x ** 2 + this.y ** 2 + this.z ** 2;
  }

  invert() {
    return this.scale(-1);
  }

  normalize() {
    const length = this.length();
    if (length) {
      return this.scale(1 / length);
    } else {
      return this;
    }
  }

  dot(other) {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }

  equals(other) {
    return (
      Math.abs(this.x - other.x) < EPSILON &&
      Math.abs(this.y - other.y) < EPSILON &&
      Math.abs(this.z - other.z) < EPSILON
    );
  }

  rotate(quaternion) {
    const ix =
      quaternion.w * this.x + quaternion.y * this.z - quaternion.z * this.y;
    const iy =
      quaternion.w * this.y + quaternion.z * this.x - quaternion.x * this.z;
    const iz =
      quaternion.w * this.z + quaternion.x * this.y - quaternion.y * this.x;
    const iw =
      -quaternion.x * this.x - quaternion.y * this.y - quaternion.z * this.z;

    return Object.assign(this, {
      x:
        ix * quaternion.w +
        iw * -quaternion.x +
        iy * -quaternion.z -
        iz * -quaternion.y,
      y:
        iy * quaternion.w +
        iw * -quaternion.y +
        iz * -quaternion.x -
        ix * -quaternion.z,
      z:
        iz * quaternion.w +
        iw * -quaternion.z +
        ix * -quaternion.y -
        iy * -quaternion.x,
    });
  }

  rotateAroundVector(vector, quaternion) {
    return this.subtract(vector)
      .rotate(quaternion)
      .add(vector);
  }

  projectOntoVector(vector) {
    const scalar = vector.dot(this) / vector.lengthSq();
    return this.copy(vector).scale(scalar);
  }

  projectOntoPlane(plane) {
    return this.subtract(
      TEMP_VECTOR.copy(this).projectOntoVector(plane.normal)
    );
  }
}

const TEMP_VECTOR = new Vector3();

//window.Vector3 = Vector3
