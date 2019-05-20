import { default as viewarApi, coreInterface } from 'viewar-api';

import { createProjectManager } from './project-manager';
import graphController from '../graph-controller';
import createObjectProxy from '../object-proxy';
import createOfflineStorage from './offline-storage';
import {
  setCustomTrackingTargets,
  getLearnedQrCodes,
  setOriginalTrackingTargets,
} from './qr-codes';

const processState = ({
  waypoints,
  paths,
  pois,
  adjacency,
  poiMap,
  graphState,
  poiCatalogState,
}) => {
  waypoints = (graphState && graphState.vertices) || waypoints;
  paths = (graphState && graphState.edges) || paths;
  adjacency = (graphState && graphState.adjacency) || adjacency;
  pois = (poiCatalogState && poiCatalogState.pois) || pois;
  poiMap = (poiCatalogState && poiCatalogState.map) || poiMap;

  const processedState = {
    waypoints: {},
    paths: {},
    pois: {},
    adjacency,
    poiMap,
  };
  for (const [$id, props] of Object.entries(waypoints)) {
    processedState.waypoints[$id] = createObjectProxy({ $id, ...props });
  }
  for (const [$id, props] of Object.entries(paths)) {
    processedState.paths[$id] = createObjectProxy({ $id, ...props });
  }
  for (const [$id, props] of Object.entries(pois)) {
    processedState.pois[$id] = createObjectProxy({ $id, data: {}, ...props });
  }
  return processedState;
};

const setContentToApp = async state => {
  const processedState = processState(state);
  graphController.importState(processedState);
  // We don't display poi-screenshots in user mode so we don't need to download them at the moment.
  //await downloadScreenshots(processedState)
};

const unloadContentFromApp = async state => graphController.clearState();

//======================================================================================================================

const downloadScreenshots = async poiCatalogState => {
  for (const poi of Object.values(poiCatalogState.pois)) {
    if (poi.data.freezeFrame) {
      await viewarApi.cameras.arCamera.downloadFreezeFrame(
        poi.data.freezeFrame
      );
    }
  }
};

const uploadScreenshots = async poiCatalogState => {
  const freezeFrameNames = [];
  for (const poi of Object.values(poiCatalogState.pois)) {
    if (poi.data.newFreezeFrame) {
      const freezeFrame = poi.data.newFreezeFrame;
      freezeFrameNames.push(freezeFrame.name);
      poi.data.freezeFrame = freezeFrame.name;
      delete poi.data.newFreezeFrame;
    }
  }

  if (navigator.onLine) {
    for (let freezeFrameName of freezeFrameNames) {
      await coreInterface.call('uploadFreezeFrameToServer', freezeFrameName);
    }
  }

  return poiCatalogState;
};

const getContentFromApp = async () => {
  // await uploadLearnedQrCodes()

  return {
    version: '3.0.0',
    ...(await uploadScreenshots(graphController.exportState())),
  };
};

const storage = createOfflineStorage({ storage: viewarApi.storage, navigator });

const saveTrackingMap = async () => {
  const { tracker } = viewarApi;

  if (tracker && tracker.saveTrackingMap) {
    return await tracker.saveTrackingMap();
  }
};

const loadTrackingMap = async trackingMap => {
  const { tracker } = viewarApi;

  if (tracker && tracker.loadTrackingMap) {
    return await tracker.loadTrackingMap(trackingMap);
  }
};

const removeTrackingMap = async trackingMap => {
  const { tracker } = viewarApi;

  tracker &&
    tracker.deleteTrackingMap &&
    (await tracker.deleteTrackingMap(trackingMap));
};

export default createProjectManager({
  storage,
  setContentToApp,
  getContentFromApp,
  unloadContentFromApp,
  saveTrackingMap,
  loadTrackingMap,
  removeTrackingMap,
  setCustomTrackingTargets,
  setOriginalTrackingTargets,
  getLearnedQrCodes,
});
