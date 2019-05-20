import React from 'react';
import cx from 'classnames';

import styles from './styles.scss';
import { DetailContent } from '../';
import ListItem from './list-item.jsx';

export default ({ getPois, ...props }) => (
  <DetailContent className={cx(styles.list)}>
    {getPois().map(poi => (
      <ListItem key={poi.$id} poi={poi} {...props} />
    ))}
  </DetailContent>
);
