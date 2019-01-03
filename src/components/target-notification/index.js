import {
  compose,
  withProps,
  withState,
  withHandlers,
  lifecycle,
} from 'recompose';
import render from './template.jsx';
import viewarApi from 'viewar-api';

export default compose(
  withState('target', 'setTarget', null),
  withState('targetTimeout', 'setTargetTimeout', null),
  withHandlers({
    onTrackingChanged: ({
      setTarget,
      setTargetTimeout,
      targetTimeout,
    }) => target => {
      if (target.tracked) {
        setTarget(target.name);
        clearTimeout(targetTimeout);
        setTargetTimeout(setTimeout(() => setTarget(null), 2000));
      }
    },
  }),
  lifecycle({
    componentDidMount() {
      viewarApi.trackers.ARKit &&
        viewarApi.trackers.ARKit.on(
          'trackingTargetStatusChanged',
          this.props.onTrackingChanged
        );
    },
    componentWillUnmount() {
      viewarApi.trackers.ARKit &&
        viewarApi.trackers.ARKit.off(
          'trackingTargetStatusChanged',
          this.props.onTrackingChanged
        );
      clearTimeout(this.props.targetTimeout);
    },
  })
)(render);
