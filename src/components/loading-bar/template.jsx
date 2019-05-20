import React from 'react';
import cx from 'classnames';
import global from '../../../css/global.scss';
import { Circle } from 'rc-progress';
import { translate } from '../../services';
import styles from './styles.scss';

export default ({ visible, progress, className }) => (
  <div className={cx(styles.container, !visible && styles.isHidden, className)}>
    <div className={cx(styles.title, global.CustomFont1)}>
      {translate('Loading')}
    </div>
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
