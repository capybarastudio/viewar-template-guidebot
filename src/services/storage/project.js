export default function createProject({
  id,
  file,
  content,
  info,
  userId,
  storage,
  trackingMap,
  qrCodes,
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
}) {
  const readOnly = file.split('/')[2] !== userId;
  const indexFile = `/public/${userId}/projects/index.json`;
  const projectFile = `/public/${userId}/projects/${id}.json`;
  const poiDataFile = `/public/${userId}/projects/${id}_data.json`;

  const project = {
    get id() {
      return id;
    },
    get readOnly() {
      return readOnly;
    },
    content,
    info,
    qrCodes,
    trackingMap,
    loadTrackingMap: () => loadTrackingMap(project.trackingMap),
    open,
    save,
    remove,
    close,
    readPoiData,
  };

  return project;

  async function updateIndexWith(update) {
    const index = (await storage.read(indexFile)) || {};
    Object.assign(index, update);
    await storage.write(indexFile, JSON.stringify(index));
  }

  async function open() {
    if (project.content) {
      await setContentToApp(project.content);
    }

    if (project.qrCodes) {
      await setCustomTrackingTargets(project.qrCodes);
    } else {
      await setOriginalTrackingTargets();
    }

    setActiveProject(project);
  }

  async function close() {
    await unloadContentFromApp();
    setActiveProject(project);
  }

  async function save(isActive = true) {
    if (!readOnly) {
      try {
        if (!project.trackingMap) {
          project.trackingMap = await saveTrackingMap();
        }
        project.qrCodes = await getLearnedQrCodes();

        project.content = await getContentFromApp();

        if (!project.info) {
          project.info = {};
        }

        let poiData = {};
        for (let [id, poi] of Object.entries(project.content.pois)) {
          poiData[id] = {
            name: poi.data.name,
            description: poi.data.description,
          };
        }

        project.info.timestamp = Date.now();
        await storage.write(projectFile, JSON.stringify(project));
        await updateIndexWith({ [id]: { id, file, info: project.info } });
        if (isActive) {
          setActiveProject(project);
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  async function remove() {
    await storage.remove(projectFile);
    await storage.remove(poiDataFile);
    //await removeTrackingMap(project.trackingMap)    // TODO: Promise never returns at the moment.
    await updateIndexWith({ [id]: undefined });
  }

  async function readPoiData() {
    if (project.content) {
      const poiData = await storage.read(poiDataFile);
      if (poiData) {
        for (let { id, name, description } of Object.values(poiData)) {
          const poi = Object.values(project.content.pois).find(
            poi => poi.data.name === id
          );
          if (poi) {
            Object.assign(poi.data, {
              originalName: poi.data.name,
              name,
              description,
            });
          }
        }
      }
    }
  }
}
