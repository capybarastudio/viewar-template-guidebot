import React from 'react';
import cx from 'classnames';
import styles from './styles.scss';

import { DetailContainer, DetailHeader, DetailContent } from '../';
import ListItem from './list-item.jsx';

export default ({ visible, title, pois, onSelect }) => (
  <div className={cx(styles.container, visible && styles.isVisible)}>
    <DetailContainer gap="right1">
      <DetailHeader dark className={styles.header}>
        <div className={styles.title}>{title}</div>
      </DetailHeader>
      <DetailContent dark className={cx(styles.list)}>
        {pois.map((poi, index) => (
          <ListItem key={index} index={index} poi={poi} onSelect={onSelect} />
        ))}
      </DetailContent>
    </DetailContainer>
  </div>
);
