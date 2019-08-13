import React from 'react';
import cx from 'classnames';
import SwipeableViews from 'react-swipeable-views';

import styles from './styles.scss';
import { Button } from '../index.js';

export default ({ items, setIndex, index, selectItem = () => {} }) => (
  <>
    <div className={cx(styles.container)}>
      <SwipeableViews index={index} onChangeIndex={index => setIndex(index)}>
        {items.map(item => (
          <div key={item.id} className={cx(styles.item)}>
            <div className={cx(styles.title)}>{item.name}</div>

            <div
              className={cx(styles.details)}
              dangerouslySetInnerHTML={{ __html: item.details }}
            />

            <Button
              label="TourSelectionStart"
              className={styles.button}
              onClick={() => selectItem(item)}
            />
          </div>
        ))}
      </SwipeableViews>

      <div className={styles.pagination}>
        {items.map((item, i) => (
          <div
            key={i}
            className={cx(styles.dot, index === i && styles.isActive)}
          />
        ))}
      </div>
    </div>
  </>
);
