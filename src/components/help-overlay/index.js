import { compose, withProps, withState, withHandlers } from 'recompose';
import viewarApi from 'viewar-api';

import render from './template.jsx';

export default compose(
  withState('screen', 'setScreen', 'buttons'),
  withProps({
    viewarApi,
  }),
  withHandlers({
    changeScreen: ({ setScreen, onScreenChange }) => (screenName, event) => {
      setScreen(screenName);
      onScreenChange && onScreenChange(screenName);
      event.stopPropagation();
    },
  })
)(render);
