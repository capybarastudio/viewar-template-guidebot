import React from 'react';

import Joystick from '../../joystick/index.js';

import styles from '../styles.css';

export default ({ updateOffset, baseClass, buttonClass, responseFn }) => (
  <div className={styles.Joystick}>
    <Joystick
      onChange={updateOffset}
      responseFn={responseFn}
      baseClass={baseClass}
      buttonClass={buttonClass}
    />
  </div>
);
