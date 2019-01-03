import React from 'react';
import classNames from 'classnames';
import Button from '../button';
import IconButton from '../icon-button';
import styles from './styles.css';

export default ({
  visible,
  showEdit,
  poiInfo,
  openDeletePoiPrompt,
  deselectPoi,
  screenshotUrl,
  className,
}) => (
  <div
    className={classNames(
      styles.container,
      !(visible && poiInfo) && styles.isHidden,
      className
    )}
  >
    {poiInfo && (
      <div className={styles.poi}>
        <div className={styles.name}>{poiInfo.name || 'Untitled'}</div>
        <div
          className={styles.image}
          style={{ backgroundImage: `url('${screenshotUrl}'` }}
        />
        <div className={styles.description}>{poiInfo.description}</div>
      </div>
    )}
    <div className={styles.buttons}>
      <Button
        className={classNames(styles.button)}
        onClick={() => showEdit()}
        label="Edit"
      />
      <Button
        className={classNames(styles.button)}
        onClick={() => openDeletePoiPrompt()}
        label="Delete"
      />
    </div>
    <IconButton
      size="small"
      icon="close"
      onClick={() => deselectPoi()}
      className={styles.closeButton}
    />
  </div>
);
