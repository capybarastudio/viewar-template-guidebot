import React from 'react';
import classNames from 'classnames';
import Button from '../button';
import IconButton from '../icon-button';
import Background from '../background';
import styles from './styles.css';

export default ({
  promptVisible,
  promptText,
  promptButton,
  closePrompt,
  onPromptConfirm,
  className,
}) => (
  <div
    className={classNames(
      styles.container,
      !promptVisible && styles.isHidden,
      className
    )}
  >
    <Background />
    <div className={styles.text}>{promptText}</div>
    <Button
      className={classNames(styles.button)}
      onClick={() => onPromptConfirm()}
      label={promptButton}
    />
    <IconButton
      size="small"
      icon="close"
      onClick={() => closePrompt()}
      className={styles.closeButton}
    />
  </div>
);
