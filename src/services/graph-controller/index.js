import { modelManager, sceneManager } from 'viewar-api';

import graph from '../../math/graph';
import config from '../config';
import { NO_INTERACTION } from '../../constants';
import createGraphController from './graph-controller';

import createObjectProxy from '../object-proxy';
import generateId from '../../utils/generate-id';

const fetchModel = async (id, fallbackId) =>
  modelManager.findModelById(id) ||
  modelManager.findModelByForeignKey(id) ||
  (await modelManager.getModelFromRepository(fallbackId));

const insertWaypointAt = async pose => {
  const model = await fetchModel(
    config.models.waypoint,
    config.fallbackModels.waypoint
  );
  return createObjectProxy({
    $id: generateId(),
    model,
    pose,
  });
};

const insertPathAt = async pose => {
  const model = await fetchModel(
    config.models.path,
    config.fallbackModels.path
  );
  return createObjectProxy({
    $id: generateId(),
    model,
    pose,
    interaction: NO_INTERACTION,
  });
};

const removeObject = async objectProxy => objectProxy.remove();

const getSelection = () => sceneManager.selection;

export default createGraphController({
  graph,
  insertWaypointAt,
  insertPathAt,
  removeObject,
  getSelection,
});
