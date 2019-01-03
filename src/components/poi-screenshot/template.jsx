import React from 'react';
import classNames from 'classnames';
import IconButton from '../icon-button';
import styles from './styles.css';
import { translate } from '../../services/translations';

export default ({
  visible,
  screenshot,
  takeScreenshot,
  saveScreenshot,
  className,
  onCancel,
}) => (
  <div
    className={classNames(
      styles.container,
      !visible && styles.isHidden,
      className
    )}
  >
    <div className={styles.background} />
    <div className={styles.title}>{translate('AdminTakeScreenshot')}</div>
    <div
      className={styles.screenshot}
      style={{ backgroundImage: `url(${screenshot})` }}
    />
    <IconButton
      className={styles.buttonTake}
      icon="screenshot"
      onClick={() => takeScreenshot()}
    />
    <IconButton
      className={styles.buttonSave}
      icon="confirm"
      onClick={() => saveScreenshot()}
    />
    {onCancel && (
      <IconButton
        size="small"
        icon="close"
        onClick={() => onCancel()}
        className={styles.closeButton}
      />
    )}
  </div>
);
