import { FRAME_LENGTH } from '../../constants';

const tickFunctions = new Map();

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function loop(fn) {
  const startTime = Date.now();

  const data = {
    startTime,
    idealTime: startTime,
    lastTime: startTime,
    actualTime: startTime,
    difference: 0,
    timeElapsed: 0,
    frameNumber: 0,
    frameLength: FRAME_LENGTH,
  };

  while (tickFunctions.has(fn)) {
    data.frameNumber += 1;

    data.frameLength = FRAME_LENGTH;

    data.actualTime = Date.now();

    data.idealTime += data.frameLength;

    data.difference = data.actualTime - data.idealTime;

    data.timeElapsed = data.actualTime - data.lastTime;
    data.lastTime = data.actualTime;

    void fn({ ...data });

    await delay(data.frameLength - data.difference);
  }
}

export const onTick = fn => {
  if (!tickFunctions.has(fn)) {
    tickFunctions.set(fn, Promise.resolve().then(() => loop(fn)));
  }
};

export const offTick = async fn => {
  const promise = tickFunctions.get(fn) || Promise.resolve();
  tickFunctions.delete(fn);
  await promise;
};
