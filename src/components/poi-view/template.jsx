import React from 'react';
import cx from 'classnames';
import { IconButton, Button } from '../';
import styles from './styles.scss';

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
    className={cx(
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
        className={cx(styles.button)}
        onClick={() => showEdit()}
        label="Edit"
      />
      <Button
        className={cx(styles.button)}
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
