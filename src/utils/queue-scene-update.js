let sceneStateMutex = Promise.resolve();

export default fn => (sceneStateMutex = sceneStateMutex.then(fn, fn));
