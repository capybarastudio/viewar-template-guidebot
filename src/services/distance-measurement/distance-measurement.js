import throttle from 'lodash/throttle';
import { MODE_NAVIGATION } from '../scene-director/modes';

export default function createDistanceMeasurement({
  camera,
  calculateDistance,
}) {
  let running = false;
  let lastPosition = undefined;
  let distance = 0;

  const start = async () => {
    if (!running) {
      running = true;
      lastPosition = undefined;
      distance = 0;
    }
  };

  const processTick = throttle(async () => {
    if (running) {
      const newPosition = camera.pose.position;
      if (lastPosition) {
        distance += calculateDistance(lastPosition, newPosition);
      }
      lastPosition = newPosition;
    }
  }, 1000);

  const stop = async () => {
    if (running) {
      await processTick();
      running = false;
      lastPosition = undefined;
    }
  };

  const runsInMode = mode => {
    return [MODE_NAVIGATION].includes(mode);
  };

  const init = async () => {};

  return {
    get distance() {
      return Math.round(distance / 100) / 10;
    },

    init,
    start,
    stop,
    processTick,
    get running() {
      return running;
    },
    runsInMode,
  };
}
