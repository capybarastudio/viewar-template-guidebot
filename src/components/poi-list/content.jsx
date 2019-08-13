import React from 'react';
import cx from 'classnames';

import styles from './styles.scss';
import ListItem from './list-item.jsx';

import { DetailContent } from '../';

export default ({ getPois, ...props }) => (
  <DetailContent dark className={cx(styles.list)}>
    {getPois().map(item => (
      <ListItem key={item.$id} item={item} {...props} />
    ))}
  </DetailContent>
);
