import React, { Fragment } from 'react';
import classNames from 'classnames';

import styles from './styles.css';
import DetailContent from '../detail-content';
import ListItem from './list-item.jsx';

export default ({ getPois, ...props }) => (
  <DetailContent className={classNames(styles.list)}>
    {getPois().map(item => (
      <ListItem key={item.$id} item={item} {...props} />
    ))}
  </DetailContent>
);
