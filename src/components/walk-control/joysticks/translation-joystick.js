import { compose, withProps, lifecycle } from 'recompose';
import viewarApi from 'viewar-api';

import Joystick from './touch-joystick.jsx';

export const clone = value => JSON.parse(JSON.stringify(value));

export const translationController = {
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
      viewarApi.cameras.vrCamera.translate({
        x: this.offset.x,
        y: 0,
        z: this.offset.y,
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

export const responseFn = x => (2 * x - 1) * 5;

export default compose(
  withProps({
    viewarApi,
    responseFn,
    translationController,
  }),
  withProps(({ translationController }) => ({
    updateOffset: offset => (translationController.offset = offset),
  })),
  lifecycle({
    componentDidMount() {
      this.props.enabled && this.props.translationController.attach();
    },
    componentWillUnmount() {
      this.props.translationController.detach();
    },
  })
)(Joystick);
