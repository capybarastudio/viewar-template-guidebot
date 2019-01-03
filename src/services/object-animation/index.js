import { sceneManager, coreInterface, modelManager } from 'viewar-api';
import { OBJECT_DEFAULT_POSE } from './constants';
import objectsDefinition from './objects.json';
import config from '../../services/config';
import merge from 'lodash/merge';
import createObjectAnimation from './object-animation';

const addToPoseUpdateQueue = (...args) =>
  coreInterface.call('addToPoseUpdateQueue', ...args);

const clearPoseUpdateQueue = (...args) =>
  coreInterface.call('clearPoseUpdateQueue', ...args);

/**
 * Finds a node with id 'Object' or creates a new container with the model instance inside.
 */
const getOrInsertObject = async (id, definition) => {
  const objectId = `Object_${id}`;
  let container = sceneManager.findNodeById(objectId);

  if (!container) {
    const model = modelManager.findModelById(definition.modelId);

    container = await sceneManager.insertContainer({
      id: objectId,
      pose: OBJECT_DEFAULT_POSE,
    });

    const objectPose = merge({}, OBJECT_DEFAULT_POSE, definition.pose);
    await sceneManager.insertModel(model, {
      parent: container,
      pose: objectPose,
      visible: false,
    });
  }

  return container;
};

const getObjectDefinitions = () => {
  const configJson = config.objects || objectsDefinition;

  const definitions = [];
  let i = 0;
  for (let objectDefinition of configJson) {
    definitions.push({
      id: i,
      objectDefinition,
    });
    i++;
  }

  return definitions;
};

const getIsEnabled = () => {
  return config.app.showObjects;
};

export default createObjectAnimation({
  getIsEnabled,
  getObjectDefinitions,
  addToPoseUpdateQueue,
  clearPoseUpdateQueue,
  getOrInsertObject,
});
