import React from 'react';

import Button from '../../components/button';
import styles from './styles.css';

export default ({ addWaypoint, removeSelectedWaypoint }) => (
  <div className={styles.sidebar}>
    <Button onClick={addWaypoint}>Add waypoint</Button>
    <Button onClick={removeSelectedWaypoint}>Remove selected waypoint</Button>
  </div>
);
