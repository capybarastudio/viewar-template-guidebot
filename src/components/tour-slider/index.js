import { compose, withState } from 'recompose';

import template from './template.jsx';

export default compose(withState('index', 'setIndex', 0))(template);
