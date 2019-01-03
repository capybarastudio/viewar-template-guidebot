import React from 'react';
import ImageGallery from 'react-image-gallery';
import Background from '../background';
import IconButton from '../icon-button';
import cx from 'classnames';
import './styles.css';

import styles from './styles.css';

export default ({ items, closeGallery, galleryVisible, className }) => (
  <div
    className={cx(
      styles.container,
      !galleryVisible && styles.isHidden,
      className
    )}
  >
    <Background />
    <IconButton
      size="small"
      icon="close"
      onClick={closeGallery}
      className={styles.closeButton}
    />
    <ImageGallery
      className={styles.gallery}
      lazyload
      showThumbnails={false}
      showFullscreenButton={false}
      showPlayButton={false}
      items={items}
    />
  </div>
);
