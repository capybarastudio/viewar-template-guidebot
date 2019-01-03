import {
  arCamera,
  vrCamera,
  perspectiveCamera,
  coreInterface,
} from 'viewar-api';

import createCamera from './camera';

export default createCamera({
  arCamera,
  vrCamera,
  perspectiveCamera,
  coreInterface,
});
