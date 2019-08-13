import { config } from '../services';

export default path => {
  const paths = path.split('.');

  let currentValue = config;

  for (let i = 0; i < paths.length; i++) {
    if (i < paths.length - 1) {
      currentValue = currentValue[paths[i]] || {};
    } else {
      currentValue = currentValue[paths[i]] || undefined;
    }
  }

  return currentValue;
};
