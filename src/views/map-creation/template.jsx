import React from 'react';
import cx from 'classnames';
import styles from './styles.css';
import Background from '../../components/background';
import MapInfo from '../../components/map-info';
import PleaseWaitDialog from '../../components/please-wait-dialog';

export default ({ goTo, ...props }) => (
  <div className={styles.container}>
    <Background />
    <PleaseWaitDialog {...props} />
    <MapInfo visible {...props} />
  </div>
);
