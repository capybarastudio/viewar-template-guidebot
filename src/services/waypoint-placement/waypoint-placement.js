import { MODE_WAYPOINT_PLACEMENT } from '../scene-director/modes';

export default function createWaypointPlacement({
  getPose,
  getCameraHeight,
  showReticule,
  hideReticule,
  placeWaypoint,
  removeSelection,
  clearSelection,
}) {
  let running = false;
  let initialized = false;
  let inserting = false;
  let reticuleInstance = undefined;
  let cameraHeight = undefined;

  const start = async () => {
    if (!running) {
      running = true;
      await clearSelection();
      reticuleInstance = await showReticule(reticuleInstance);
      initialized = true;
    }
  };

  const processTick = async () => {
    if (initialized && running && !inserting && cameraHeight !== undefined) {
      const pose = await getPose(reticuleInstance);
      pose.position.y = getCameraHeight() - cameraHeight;
      await reticuleInstance.setPose(pose);
    }
  };

  const stop = async () => {
    if (running) {
      running = false;
      initialized = false;
      await clearSelection();
      await hideReticule(reticuleInstance);
    }
  };

  const addWaypoint = async () => {
    if (running && !inserting) {
      inserting = true;
      cameraHeight = cameraHeight || getCameraHeight();

      await placeWaypoint(reticuleInstance);
      inserting = false;
    } else {
      throw new Error('Waypoint capture has not been started!');
    }
  };

  const removeWaypoint = async () => {
    if (running) {
      await removeSelection();
    } else {
      throw new Error('Waypoint capture has not been started!');
    }
  };

  const runsInMode = mode => {
    return [MODE_WAYPOINT_PLACEMENT].includes(mode);
  };

  const init = async () => {
    cameraHeight = undefined;
  };

  return {
    processTick,
    addWaypoint,
    removeWaypoint,

    init,
    reset: init,
    start,
    stop,
    get running() {
      return running;
    },
    runsInMode,
  };
}
