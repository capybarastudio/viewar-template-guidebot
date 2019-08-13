import viewarApi from 'viewar-api';
import createKeyboardJoystick from '../../components/walk-control/joysticks/keyboard-joystick';

const movementKeys = {
  'x+': 68,
  'x-': 65,
  'y+': 83,
  'y-': 87,
};

const rotationKeys = {
  'x+': 39,
  'x-': 37,
  'y+': 38,
  'y-': 40,
};

let lastMovement = {
  x: 0,
  y: 0,
};

let lastRotation = {
  x: 0,
  y: 0,
};

const handleMovement = async ({ x, y, z }) => {
  if (lastMovement.x !== x || lastMovement.y !== y) {
    lastMovement = { x, y };
    return viewarApi.cameras.vrCamera.translate({
      x: x,
      y: 0,
      z: y,
    });
  }
};

const handleRotation = async ({ x, y, z }) => {
  if (lastRotation.x !== x || lastRotation.y !== y) {
    lastRotation = { x, y };
    return viewarApi.cameras.vrCamera.rotate({
      x: y,
      y: -x,
      z: 0,
    });
  }
};

export const keyboardMovementJoystick = createKeyboardJoystick({
  maxValue: 20,
  keys: movementKeys,
  onUpdate: handleMovement,
});

export const keyboardRotationJoystick = createKeyboardJoystick({
  maxValue: 1 / (Math.PI * 30),
  keys: rotationKeys,
  onUpdate: handleRotation,
});
