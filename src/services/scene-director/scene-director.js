import { MODE_NONE } from './modes';
import viewarApi from 'viewar-api';

export default ({
  initialModules,
  guide,
  graphController,
  camera,
  onTick,
  offTick,
}) => {
  let running = false;
  let updating = false;
  let mode = MODE_NONE;
  let currentAction = undefined;

  const modules = [...initialModules];

  const updateScene = async timerInfo => {
    if (!updating) {
      try {
        updating = true;

        const newAction = await camera.processTick(currentAction);
        currentAction = undefined;
        if (newAction && newAction.type === 'setDestination') {
          setDestination(newAction.destination);
        }

        for (const module of modules) {
          module.running && (await module.processTick(timerInfo));
        }
      } catch (error) {
        console.error(error);
      } finally {
        updating = false;
      }
    }
  };

  const start = async newMode => {
    if (!running) {
      running = true;
      mode = newMode || mode;
      await setMode(mode);
      await Promise.all(modules.map(module => module.init()));
      await viewarApi.cameras.arCamera.startPoseUpdate();
      onTick(updateScene);
    } else {
      newMode && (await setMode(newMode));
      console.warn('Scene director already running.');
    }
  };

  const stop = async () => {
    if (running) {
      running = false;
      await offTick(updateScene);
      await setMode(MODE_NONE);
      await viewarApi.cameras.arCamera.stopPoseUpdate();
    } else {
      console.warn('Scene director already stopped.');
    }
  };

  const setMode = async newMode => {
    mode = newMode;
    await offTick(updateScene);
    await Promise.all(
      modules.map(module =>
        module.runsInMode(mode) ? module.start() : module.stop()
      )
    );
    onTick(updateScene);
  };

  const setDestination = newDestination => {
    newDestination = graphController.pois.find(
      poi => poi.$id === newDestination.$id
    );
    guide.destination = newDestination;
    currentAction = {
      type: 'setDestination',
      destination: newDestination,
    };
  };

  const register = module => {
    modules.push(module);
  };

  const unregister = module => {
    const index = modules.indexOf(module);
    if (~index) {
      modules.splice(index, 1);
    }
  };

  return {
    start,
    stop,

    register,
    unregister,

    setMode,

    set destination(newDestination) {
      setDestination(newDestination);
    },
    get destination() {
      return guide.destination;
    },
  };
};
