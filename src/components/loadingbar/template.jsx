import React from 'react';
import classNames from 'classnames';
import { Circle } from 'rc-progress';
import { translate } from '../../services/translations';
import styles from './styles.css';

export default ({ visible, progress, className }) => (
  <div
    className={classNames(
      styles.container,
      !visible && styles.isHidden,
      className
    )}
  >
    <div className={classNames(styles.title)}>{translate('Loading')}</div>
    <Circle
      key="circle"
      className={styles.spinner}
      percent={progress}
      strokeWidth="4"
      strokeColor="#00ccff"
      trailWidth="4"
      trailColor="rgba(255,255,255,0)"
      gapPosition="bottom"
    />
  </div>
);
