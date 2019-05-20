import React from 'react';
import cx from 'classnames';
import { Button, IconButton, TextInput, TextArea, Background } from '../';
import styles from './styles.scss';
import { translate } from '../../services';

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
    className={cx(
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
        <div className={cx(styles.input, styles.inputText)}>
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
      className={cx(styles.button)}
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
