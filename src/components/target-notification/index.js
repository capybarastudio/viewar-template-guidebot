import {
  compose,
  withProps,
  withState,
  withHandlers,
  lifecycle,
} from 'recompose';
import render from './template.jsx';
import viewarApi from 'viewar-api';

export const init = ({ onTrackingChanged }) => () => {
  viewarApi.tracker &&
    viewarApi.tracker.on('trackingTargetStatusChanged', onTrackingChanged);
};

export const destroy = ({ targetTimeout, onTrackingChanged }) => () => {
  viewarApi.tracker &&
    viewarApi.tracker.off('trackingTargetStatusChanged', onTrackingChanged);

  clearTimeout(targetTimeout);
};

export const onTrackingChanged = ({
  setTarget,
  setTargetTimeout,
  targetTimeout,
}) => target => {
  if (target.tracked) {
    setTarget(target.name);
    clearTimeout(targetTimeout);
    setTargetTimeout(setTimeout(() => setTarget(null), 2000));
  }
};

export default compose(
  withState('target', 'setTarget', null),
  withState('targetTimeout', 'setTargetTimeout', null),
  withHandlers({
    onTrackingChanged,
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
