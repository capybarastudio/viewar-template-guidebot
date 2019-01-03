import Vector3 from '../../math/vector3';

export default ({ arCamera, vrCamera, perspectiveCamera, coreInterface }) => {
  let activeCamera = undefined;
  let mode = undefined;
  let initialized = false;
  let capturing = false;
  let replaying = false;
  let captureData = [];
  let replayData = [];
  let currentFrame = undefined;

  const init = async mode => {
    if (!initialized) {
      await setMode(mode);
      initialized = true;
    }
  };

  const setMode = async newMode => {
    switch (newMode) {
      case 'AR':
        mode = newMode;
        activeCamera = arCamera;
        break;
      case 'VR':
        mode = newMode;
        activeCamera = vrCamera;
        break;
      case 'Perspective':
        mode = newMode;
        activeCamera = perspectiveCamera;
        break;
    }
    await activeCamera.activate();
  };

  const startCapture = () => {
    if (initialized && !capturing && !replaying) {
      captureData = [];
      capturing = true;
    }
  };

  const stopCapture = () => {
    if (initialized && capturing) {
      capturing = false;
    }
    return captureData;
  };

  const processTick = async action => {
    if (replaying) {
      !perspectiveCamera.active && (await perspectiveCamera.activate());
      currentFrame = replayData.shift();
      if (!currentFrame) {
        replaying = false;
        return null;
      } else {
        const pose = currentFrame.pose;
        pose.lookAt = new Vector3(Vector3.Z_AXIS)
          .invert()
          .rotate(pose.orientation)
          .add(pose.position);
        const promise = coreInterface.call(
          'setCameraPose',
          'GridStageCamera',
          currentFrame.pose
        );
        return currentFrame.action;
      }
    } else if (capturing) {
      !activeCamera.active && (await activeCamera.activate());
      const pose = activeCamera.pose;
      if (action) {
        captureData.push({ action, pose });
      } else {
        captureData.push({ pose });
      }
    } else {
      !activeCamera.active && (await activeCamera.activate());
    }
  };

  const startReplay = newReplayData => {
    if (initialized && !replaying && !capturing) {
      replayData = newReplayData;
      replaying = true;
    }
  };

  const stopReplay = () => {
    if (initialized && replaying) {
      replaying = false;
    }
  };

  const getPose = () => {
    if (replaying && currentFrame) {
      return currentFrame.pose;
    } else {
      return activeCamera.pose;
    }
  };

  const getPoseInViewingDirection = async (...args) => {
    return (
      activeCamera &&
      activeCamera.getPoseInViewingDirection &&
      activeCamera.getPoseInViewingDirection(...args)
    );
  };

  return {
    init,
    get pose() {
      return getPose();
    },
    get mode() {
      return mode;
    },
    get active() {
      return activeCamera.active;
    },
    get captureData() {
      return captureData;
    },
    setMode,
    getPoseInViewingDirection,
    startCapture,
    stopCapture,
    processTick,
    startReplay,
    stopReplay,
  };
};
