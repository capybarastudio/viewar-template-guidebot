import { generateId } from '../../utils';
import isEqual from 'lodash/isEqual';
import createProject from './project';

export function createProjectManager({
  cachingEnabled = false,
  getStorage,
  setContentToApp,
  getContentFromApp,
  unloadContentFromApp,
  saveTrackingMap,
  loadTrackingMap,
  removeTrackingMap,
  setCustomTrackingTargets,
  setOriginalTrackingTargets,
  getLearnedQrCodes,
}) {
  const projectIndices = {};
  const projectCache = {};
  let activeProject = null;

  return {
    fetchProjectIndexFor,
    fetchProject,
    createNewProject,
    get activeProject() {
      return activeProject;
    },
  };

  function setActiveProject(project) {
    activeProject = project;
  }

  async function fetchProjectIndexFor(userId) {
    const index =
      (await getStorage().read(`/public/${userId}/projects/index.json`)) || {};
    if (cachingEnabled && !isEqual(index, projectIndices[userId])) {
      projectIndices[userId] = index;
    }
    await getStorage().write(
      `/public/${userId}/projects/index.json`,
      JSON.stringify(index)
    );
    return index;
  }

  async function fetchProject(userId, projectId) {
    if (!projectCache[projectId]) {
      const projectIndex = await fetchProjectIndexFor(userId);

      const file = projectIndex[projectId].file;
      const projectData = await getStorage().read(file);
      const project = createProject(
        Object.assign({}, projectData, {
          file,
          userId,
          storage: getStorage(),
          setContentToApp,
          getContentFromApp,
          unloadContentFromApp,
          setActiveProject,
          saveTrackingMap,
          loadTrackingMap,
          removeTrackingMap,
          setCustomTrackingTargets,
          setOriginalTrackingTargets,
          getLearnedQrCodes,
        })
      );

      await project.readPoiData();
      projectCache[projectId] = project;
    }
    return projectCache[projectId];
  }

  function createNewProject(userId, info, content = null) {
    const id = generateId();
    const file = `/public/${userId}/projects/${id}.json`;
    return (projectCache[id] = createProject({
      id,
      userId,
      file,
      content,
      info,
      storage: getStorage(),
      setContentToApp,
      getContentFromApp,
      unloadContentFromApp,
      setActiveProject,
      saveTrackingMap,
      loadTrackingMap,
      removeTrackingMap,
      setCustomTrackingTargets,
      setOriginalTrackingTargets,
      getLearnedQrCodes,
    }));
  }
}
