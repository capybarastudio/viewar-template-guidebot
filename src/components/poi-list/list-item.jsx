import React, { Fragment } from 'react';
import classNames from 'classnames';
import { compose, withProps } from 'recompose';
import styles from './styles.css';

export default compose(
  withProps(({ item, usePoiImages }) => ({
    showImage:
      usePoiImages &&
      (item.data.localScreenshotUrl || item.data.cloudScreenshotUrl),
    imageUrl: item.data.localScreenshotUrl || item.data.cloudScreenshotUrl,
  }))
)(({ imageUrl, item, editPoi }) => (
  <div className={classNames(styles.item)} onClick={() => editPoi(item)}>
    <div className={styles.poiDescription}>{item.data.name || 'Untitled'}</div>
  </div>
));
