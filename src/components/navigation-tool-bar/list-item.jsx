import React from 'react';
import cx from 'classnames';
import { compose, withProps } from 'recompose';
import styles from './styles.scss';
import guide from 'viewar-guide';

export default compose(
  withProps(({ poi, usePoiImages }) => ({
    showImage:
      usePoiImages &&
      (poi.data.localScreenshotUrl || poi.data.cloudScreenshotUrl),
    imageUrl: poi.data.localScreenshotUrl || poi.data.cloudScreenshotUrl,
  }))
)(({ imageUrl, poi, navigateTo, getDistance, showPoiOriginalNames }) => (
  <div
    className={cx(styles.item, guide.destination === poi && styles.isActive)}
    onClick={() => navigateTo(poi)}
  >
    {showPoiOriginalNames && poi.data.originalName && (
      <div className={styles.poiOriginalName}>{poi.data.originalName}</div>
    )}
    <div
      className={cx(
        styles.poiDescription,
        showPoiOriginalNames && poi.data.originalName && styles.hasOriginalName
      )}
    >
      {poi.data.name || 'Untitled'}
    </div>
  </div>
));
