import React from 'react';
import cx from 'classnames';
import { compose, withProps } from 'recompose';
import styles from './styles.scss';

export default compose(
  withProps(({ item, usePoiImages }) => ({
    showImage:
      usePoiImages &&
      (item.data.localScreenshotUrl || item.data.cloudScreenshotUrl),
    imageUrl: item.data.localScreenshotUrl || item.data.cloudScreenshotUrl,
  }))
)(({ imageUrl, item, editPoi }) => (
  <div className={cx(styles.item)} onClick={() => editPoi(item)}>
    <div className={styles.poiDescription}>{item.data.name || 'Untitled'}</div>
  </div>
));
