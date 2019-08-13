import React from 'react';
import cx from 'classnames';
import { compose, withProps } from 'recompose';
import styles from './styles.scss';
import guide from 'viewar-guide';

export default ({ index, poi, onSelect }) => (
  <div
    className={cx(styles.item, guide.destination === poi && styles.isActive)}
    onClick={() => onSelect(index)}
  >
    <div className={cx(styles.poiDescription)}>
      {poi.data.name || 'Untitled'}
    </div>
  </div>
);
