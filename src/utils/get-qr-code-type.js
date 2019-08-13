import viewarApi from 'viewar-api';
import semver from 'semver';

export default () => {
  if (semver.satisfies(viewarApi.versionInfo.core, '^11.36.0')) {
    return 'QR';
  } else {
    return 'image';
  }
};
