import React from 'react';
import cx from 'classnames';
import styles from './styles.scss';

import { IconButton } from '..';

export default ({
  visible,
  toggleCapture,
  capturing,
  toggleReplay,
  replaying,
  saveCapture,
  loadCapture,
}) => (
  <div className={cx(styles.container, visible && styles.isVisible)}>
    <IconButton icon="capture" onClick={toggleCapture} active={capturing} />
    <IconButton icon={replaying ? 'stop' : 'play'} onClick={toggleReplay} />
    <IconButton icon="open" onClick={loadCapture} />
    <IconButton icon="save" onClick={saveCapture} />
  </div>
);
