import React from 'react';
import { compose, withState, withHandlers, defaultProps } from 'recompose';

import Joystick from './template.jsx';

export const defaultOffset = { x: 0.5, y: 0.5 };

export const updateOffset = ({
  touchInfo: { touchId, offset },
  setTouchInfo,
  onChange,
  responseFn,
}) => ({ target, changedTouches }) => {
  const touch = changedTouches[0];
  if (touch) {
    const { pageX: x, pageY: y } = touch;
    const { top, left, width, height } = target.getBoundingClientRect();

    const newOffset = {
      x: Math.max(0, Math.min(1, (x - left) / width)),
      y: Math.max(0, Math.min(1, (y - top) / height)),
    };

    onChange({
      x: responseFn(newOffset.x),
      y: responseFn(newOffset.y),
    });
    setTouchInfo({
      touchId: touch.identifier,
      offset: newOffset,
    });
  }
};

export const resetOffset = ({
  touchInfo: { touchId, offset },
  setTouchInfo,
  onChange,
  responseFn,
  defaultOffset,
}) => ({ changedTouches }) => {
  const touch = [...changedTouches].find(touch => touch.identifier === touchId);
  if (touch) {
    const newOffset = { ...defaultOffset };
    onChange({
      x: responseFn(newOffset.x),
      y: responseFn(newOffset.y),
    });
    setTouchInfo({
      touchId: null,
      offset: newOffset,
    });
  }
};

export const isActive = ({ touchId }) => () => touchId !== null;

export default compose(
  defaultProps({
    responseFn: x => x,
    radius: 120,
    defaultOffset,
    onChange: () =>
      console.warn(
        'You should pass an onChange function to Joystick component!'
      ),
  }),
  withState('touchInfo', 'setTouchInfo', {
    touchId: null,
    offset: { ...defaultOffset },
  }),
  withHandlers({
    updateOffset,
    resetOffset,
    isActive,
  })
)(Joystick);
