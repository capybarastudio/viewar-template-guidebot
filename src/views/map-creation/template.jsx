import React from 'react';
import cx from 'classnames';
import styles from './styles.scss';
import { Background, MapInfo, PleaseWaitDialog } from '../../components';

export default ({ goTo, ...props }) => (
  <div className={styles.container}>
    <Background />
    <PleaseWaitDialog {...props} />
    <MapInfo visible {...props} />
  </div>
);
