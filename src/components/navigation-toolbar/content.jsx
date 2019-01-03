import React, { Fragment } from 'react';
import classNames from 'classnames';

import styles from './styles.css';
import DetailContent from '../detail-content';
import ListItem from './list-item.jsx';

export default ({ getPois, ...props }) => (
  <DetailContent className={classNames(styles.list)}>
    {getPois().map(poi => (
      <ListItem key={poi.$id} poi={poi} {...props} />
    ))}
  </DetailContent>
);
