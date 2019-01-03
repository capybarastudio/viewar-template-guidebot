import React from 'react';
import classNames from 'classnames';

import styles from './styles.css';

export default ({
  updateOffset,
  resetOffset,
  touchInfo,
  baseClass,
  buttonClass,
}) => (
  <div>
    <div
      className={classNames(styles.Button, buttonClass)}
      style={{
        top: `${touchInfo.offset.y * 100}%`,
        left: `${touchInfo.offset.x * 100}%`,
      }}
    />
    <div
      className={classNames(styles.Base, baseClass)}
      onTouchStart={updateOffset}
      onTouchMove={updateOffset}
      onTouchEnd={resetOffset}
      onTouchCancel={resetOffset}
    />
  </div>
);
