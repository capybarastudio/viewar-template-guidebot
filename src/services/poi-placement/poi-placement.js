import { MODE_POI_PLACEMENT } from '../scene-director/modes';

export default ({
  addPoiAtCameraPose,
  removePoi,
  findNearestWaypointToCamera,
  getSelection,
  clearSelection,
}) => {
  let running = false;

  const start = async () => {
    if (!running) {
      running = true;
      await clearSelection();
    }
  };

  const stop = async () => {
    if (running) {
      running = false;
      await clearSelection();
    }
  };

  const placePoi = () => {
    if (running) {
      const nearestWaypoint = findNearestWaypointToCamera();

      if (nearestWaypoint) {
        return addPoiAtCameraPose(nearestWaypoint);
      } else {
        throw new Error('No waypoints placed yet!');
      }
    } else {
      throw new Error('POI capture has not been started!');
    }
  };

  const removeSelectedPoi = () => {
    if (running) {
      const selection = getSelection();
      if (selection) {
        removePoi(selection);
      } else {
        throw new Error('No POI selected!');
      }
    } else {
      throw new Error('POI placement has not been started!');
    }
  };

  const runsInMode = mode => {
    return [MODE_POI_PLACEMENT].includes(mode);
  };

  const init = async () => {};
  const processTick = async () => {};

  return {
    placePoi,
    removeSelectedPoi,

    init,
    start,
    stop,
    processTick,
    get running() {
      return running;
    },
    runsInMode,
  };
};
