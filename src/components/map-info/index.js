import {
  compose,
  withProps,
  withState,
  withHandlers,
  lifecycle,
} from 'recompose';

import render from './template.jsx';

export default compose(
  withState('name', 'setName', ''),
  withProps({}),
  withHandlers({
    saveChanges: ({ name, onMapInfoChanged }) => e => {
      e.preventDefault();
      onMapInfoChanged(name);
    },
  })
)(render);
