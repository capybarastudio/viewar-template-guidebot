import React from 'react';
import cx from 'classnames';

import styles from './styles.scss';
import global from '../../../css/global.scss';

export default ({ size, className, onClick }) => (
  <div
    className={cx(styles.logo, size && styles[`size-${size}`], className)}
    onClick={e => onClick && onClick(e)}
  >
    <div className={cx(styles.image, global.Logo)} />
  </div>
);
