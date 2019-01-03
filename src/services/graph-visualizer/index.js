import createGraphVisualizer from './graph-visualizer';
import graphController from '../graph-controller';
import { sceneManager, perspectiveCamera } from 'viewar-api';
import camera from '../camera';

const getSelection = () =>
  sceneManager.selection && graphController.findById(sceneManager.selection.id);
const getSceneState = sceneManager.getSceneStateSafe;
const setSceneState = sceneManager.setSceneState;
const zoomToFit = () =>
  perspectiveCamera.active && perspectiveCamera.zoomToFit();

export default createGraphVisualizer({
  getSceneState,
  setSceneState,
  graphController,
  zoomToFit,
  camera,
  getSelection,
});
