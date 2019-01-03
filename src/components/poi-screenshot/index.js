import {
  compose,
  withProps,
  withState,
  withHandlers,
  lifecycle,
} from 'recompose';
import { sceneManager } from 'viewar-api';

import render from './template.jsx';

export default compose()(render);
