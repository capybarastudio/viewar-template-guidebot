import React from 'react';
import cx from 'classnames';

import styles from './styles.scss';

export default ({
  updateOffset,
  resetOffset,
  touchInfo,
  baseClass,
  buttonClass,
}) => (
  <div>
    <div
      className={cx(styles.Button, buttonClass)}
      style={{
        top: `${touchInfo.offset.y * 100}%`,
        left: `${touchInfo.offset.x * 100}%`,
      }}
    />
    <div
      className={cx(styles.Base, baseClass)}
      onTouchStart={updateOffset}
      onTouchMove={updateOffset}
      onTouchEnd={resetOffset}
      onTouchCancel={resetOffset}
    />
  </div>
);
