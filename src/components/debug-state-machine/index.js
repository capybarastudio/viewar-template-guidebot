import {
  compose,
  withProps,
  withState,
  withHandlers,
  lifecycle,
  withPropsOnChange,
} from 'recompose';
import render from './template.jsx';
import { getUiConfigPath } from '../../utils/index.js';

let updateInterval = 0;
export const init = ({ enabled, updateStates }) => () => {
  if (enabled) {
    updateInterval = setInterval(updateStates, 100);
  }
};

export const destroy = ({}) => () => {
  clearInterval(updateInterval);
};

export const updateStates = ({
  setMainStates,
  setDetailStates,
  setInput,
}) => () => {
  setMainStates(window.mainStates || []);
  setDetailStates(window.detailStates || []);
  setInput(window.input || {});
};

export default compose(
  withState('mainStates', 'setMainStates', []),
  withState('detailStates', 'setDetailStates', []),
  withState('input', 'setInput', {}),
  withProps(() => ({
    enabled: getUiConfigPath('debug.debugStateMachine'),
  })),
  withHandlers({
    updateStates,
  }),
  withHandlers({
    init,
    destroy,
  }),
  lifecycle({
    componentDidMount() {
      this.props.init();
    },
    componentWillUnmount() {
      this.props.destroy();
    },
  })
)(render);
