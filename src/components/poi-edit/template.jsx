import React from 'react';
import classNames from 'classnames';
import Button from '../button';
import IconButton from '../icon-button';
import TextInput from '../text-input';
import TextArea from '../text-area';
import Background from '../background';
import styles from './styles.css';
import { translate } from '../../services/translations';

export default ({
  visible,
  poi,
  poiInfo,
  title,
  text,
  setTitle,
  setText,
  cancelEdit,
  editBack,
  saveChanges,
  close,
  back,
  className,
}) => (
  <div
    className={classNames(
      styles.container,
      !(visible && poi) && styles.isHidden,
      className
    )}
  >
    <Background />
    {poiInfo && (
      <div className={styles.poi}>
        <div className={styles.input}>
          <div className={styles.label}>{translate('AdminPoiTitle')}</div>
          <TextInput
            onChange={setTitle}
            value={title}
            className={styles.textInput}
          />
        </div>
        <div className={classNames(styles.input, styles.inputText)}>
          <div className={styles.label}>{translate('AdminPoiDescription')}</div>
          <TextArea
            onChange={setText}
            value={text}
            className={styles.textArea}
          />
        </div>
      </div>
    )}
    <Button
      className={classNames(styles.button)}
      onClick={() => saveChanges()}
      label="Save"
    />
    {close && (
      <IconButton
        size="small"
        icon="close"
        onClick={() => cancelEdit()}
        className={styles.closeButton}
      />
    )}
    {back && (
      <IconButton
        size="small"
        icon="back"
        onClick={() => editBack()}
        className={styles.backButton}
      />
    )}
  </div>
);
