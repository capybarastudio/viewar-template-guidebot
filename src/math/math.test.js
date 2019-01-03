import test from 'tape';

import Vector3 from './vector3';
import Quaternion from './quaternion';
import { angleDiff } from './math';

const toDeg = rad => Math.round((rad / Math.PI) * 180);
const toRad = deg => (deg * Math.PI) / 180;

const origin = new Vector3(0, 0, 0);
const x = new Vector3(1, 0, 0);
const z = new Vector3(0, 0, 1);
const vi = new Vector3(1, 0, 1).normalize();
const vii = new Vector3(-1, 0, 1).normalize();
const viii = new Vector3(-1, 0, -1).normalize();
const viv = new Vector3(1, 0, -1).normalize();

test('Quaternion works properly', assert => {
  const heading1 = Quaternion.fromUnitVectors(x, vi).toEulerAngles().heading;
  const heading2 = Quaternion.fromUnitVectors(x, vii).toEulerAngles().heading;
  const heading3 = Quaternion.fromUnitVectors(x, viii).toEulerAngles().heading;
  const heading4 = Quaternion.fromUnitVectors(x, viv).toEulerAngles().heading;

  assert.equals(Math.round(toDeg(heading1)), -45);
  assert.equals(Math.round(toDeg(heading2)), -135);
  assert.equals(Math.round(toDeg(heading3)), 135);
  assert.equals(Math.round(toDeg(heading4)), 45);

  assert.end();
});

test('Quaternion works properly', assert => {
  const heading1 = Quaternion.fromUnitVectors(vi, viv).toEulerAngles().heading;

  assert.equals(Math.round(toDeg(heading1)), 90);

  assert.end();
});

test('angleDiff works properly', assert => {
  assert.equals(toDeg(angleDiff(toRad(-10), toRad(-30))), -20);
  assert.equals(toDeg(angleDiff(toRad(-30), toRad(-10))), 20);

  assert.equals(toDeg(angleDiff(toRad(10), toRad(30))), 20);
  assert.equals(toDeg(angleDiff(toRad(30), toRad(10))), -20);

  assert.equals(toDeg(angleDiff(toRad(-10), toRad(10))), 20);
  assert.equals(toDeg(angleDiff(toRad(10), toRad(-10))), -20);

  assert.equals(toDeg(angleDiff(toRad(-170), toRad(170))), -20);
  assert.equals(toDeg(angleDiff(toRad(170), toRad(-170))), 20);

  assert.equals(toDeg(angleDiff(toRad(-180), toRad(180))), 0);
  assert.equals(toDeg(angleDiff(toRad(0), toRad(0))), 0);

  assert.equals(toDeg(angleDiff(toRad(-45), toRad(135))), 180);
  assert.equals(toDeg(angleDiff(toRad(135), toRad(-45))), -180);

  assert.end();
});
