import React from 'react';
import cx from 'classnames';
import Button from '../button';
import { IconButton, Background } from '../';
import styles from './styles.scss';
import { translate } from '../../services';
import global from '../../../css/global.scss';

export default ({
  promptVisible,
  promptText,
  promptButton,
  closePrompt,
  onPromptConfirm,
  className,
}) => (
  <div
    className={cx(
      styles.container,
      !promptVisible && styles.isHidden,
      className
    )}
  >
    <Background />
    <div className={cx(styles.text, global.CustomFont3)}>
      {translate(promptText, false)}
    </div>
    {promptButton && (
      <Button
        className={cx(styles.button)}
        onClick={() => onPromptConfirm()}
        label={translate(promptButton, false)}
      />
    )}
    <IconButton
      size="small"
      icon="close"
      onClick={() => closePrompt()}
      className={styles.closeButton}
    />
  </div>
);
