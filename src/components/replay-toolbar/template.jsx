import React from 'react';
import classNames from 'classnames';
import styles from './styles.css';

import IconButton from '../../components/icon-button';

export default ({
  visible,
  toggleCapture,
  capturing,
  toggleReplay,
  replaying,
  saveCapture,
  loadCapture,
}) => (
  <div className={classNames(styles.container, visible && styles.isVisible)}>
    <IconButton icon="capture" onClick={toggleCapture} active={capturing} />
    <IconButton icon={replaying ? 'stop' : 'play'} onClick={toggleReplay} />
    <IconButton icon="open" onClick={loadCapture} />
    <IconButton icon="save" onClick={saveCapture} />
  </div>
);
