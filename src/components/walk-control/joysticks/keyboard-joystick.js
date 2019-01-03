export default function createKeyboardJoystick({
  keys,
  maxValue = 1,
  deadZoneFactor = 0,
  fps = 30,
  onUpdate = () => {},
}) {
  const pressedKeys = {};
  const input = { x: 0, y: 0, z: 0 };
  let intervalHandle = null;

  return {
    attach() {
      window.document.addEventListener('keydown', onKeyDown);
      window.document.addEventListener('keyup', onKeyUp);
      intervalHandle = setInterval(() => onUpdate(input), 1000 / fps);
    },
    detach() {
      clearInterval(intervalHandle);
      window.document.removeEventListener('keydown', onKeyDown);
      window.document.removeEventListener('keyup', onKeyUp);
      intervalHandle = null;
    },
    get active() {
      return input.x !== 0 || input.y !== 0 || input.z !== 0;
    },
    get x() {
      return adjustInput(input.x);
    },
    get y() {
      return adjustInput(input.y);
    },
    get z() {
      return adjustInput(input.z);
    },
  };

  function adjustInput(value) {
    const valueWithDeadZone =
      Math.abs(value) > maxValue * deadZoneFactor ? value : 0;
    return Math.max(Math.min(valueWithDeadZone, maxValue), -maxValue);
  }

  function onKeyDown({ keyCode }) {
    pressedKeys[keyCode] = true;
    updateInput();
  }

  function onKeyUp({ keyCode }) {
    pressedKeys[keyCode] = false;
    updateInput();
  }

  function updateInput() {
    Object.assign(input, {
      x:
        maxValue *
        ((pressedKeys[keys['x+']] | 0) - (pressedKeys[keys['x-']] | 0)),
      y:
        maxValue *
        ((pressedKeys[keys['y+']] | 0) - (pressedKeys[keys['y-']] | 0)),
      z:
        maxValue *
        ((pressedKeys[keys['z+']] | 0) - (pressedKeys[keys['z-']] | 0)),
    });
  }
}
