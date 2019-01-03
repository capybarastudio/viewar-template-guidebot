import { sceneManager } from 'viewar-api';
import createObjectProxy from './object-proxy';

const findInstance = id => sceneManager.findNodeById(id);

const removeInstance = id =>
  sceneManager.removeNode(sceneManager.findNodeById(id));

export default props =>
  createObjectProxy({
    findInstance,
    removeInstance,
    ...props,
  });
