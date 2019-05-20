import React from 'react';

import { Button } from '../';
import styles from './styles.scss';

export default ({ addWaypoint, removeSelectedWaypoint }) => (
  <div className={styles.sideBar}>
    <Button onClick={addWaypoint}>Add waypoint</Button>
    <Button onClick={removeSelectedWaypoint}>Remove selected waypoint</Button>
  </div>
);
