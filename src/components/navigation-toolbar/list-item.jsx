import React, { Fragment } from 'react';
import classNames from 'classnames';
import { compose, withProps } from 'recompose';
import styles from './styles.css';

export default compose(
  withProps(({ poi, usePoiImages }) => ({
    showImage:
      usePoiImages &&
      (poi.data.localScreenshotUrl || poi.data.cloudScreenshotUrl),
    imageUrl: poi.data.localScreenshotUrl || poi.data.cloudScreenshotUrl,
  }))
)(({ imageUrl, poi, navigateTo, getDistance, guide, showPoiOriginalNames }) => (
  <div
    className={classNames(
      styles.item,
      guide.destination === poi && styles.isActive
    )}
    onClick={() => navigateTo(poi)}
  >
    {showPoiOriginalNames && poi.data.originalName && (
      <div className={styles.poiOriginalName}>{poi.data.originalName}</div>
    )}
    <div
      className={classNames(
        styles.poiDescription,
        showPoiOriginalNames && poi.data.originalName && styles.hasOriginalName
      )}
    >
      {poi.data.name || 'Untitled'}
    </div>
  </div>
));
