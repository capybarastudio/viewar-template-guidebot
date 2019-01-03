import React from 'react';
import cx from 'classnames';
import { translate } from '../../services/translations';

import styles from './styles.css';
import globalStyles from '../../../css/global.css';

export default ({ size, admin, className, onClick }) => (
  <div
    className={cx(styles.logo, size && styles[`size-${size}`], className)}
    onClick={e => onClick && onClick(e)}
  >
    <div className={cx(styles.image, globalStyles.Logo)} />
  </div>
);
