import { compose, withProps, lifecycle } from 'recompose';
import viewarApi from 'viewar-api';

import Joystick from './touch-joystick.jsx';

export const clone = value => JSON.parse(JSON.stringify(value));

export const rotationController = {
  handle: -1,
  offset: {
    x: 0,
    y: 0,
  },
  lastOffset: {
    x: 0,
    y: 0,
  },
  async update() {
    if (
      this.lastOffset.x !== this.offset.x ||
      this.lastOffset.y !== this.offset.y
    ) {
      this.lastOffset = clone(this.offset);
      viewarApi.cameras.vrCamera.rotate({
        x: 0,
        y: -this.offset.x,
        z: 0,
      });
    }
  },
  attach() {
    this.handle = setInterval(() => this.update(), 30);
  },
  detach() {
    clearInterval(this.handle);
  },
};

export const responseFn = x => (2 * x - 1) / (Math.PI * 30);

export default compose(
  withProps({
    viewarApi,
    responseFn,
    rotationController,
  }),
  withProps(({ rotationController }) => ({
    updateOffset: offset => (rotationController.offset = offset),
  })),
  lifecycle({
    componentDidMount() {
      this.props.enabled && this.props.rotationController.attach();
    },
    componentWillUnmount() {
      this.props.rotationController.detach();
    },
  })
)(Joystick);
