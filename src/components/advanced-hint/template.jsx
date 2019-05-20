import React from 'react';
import cx from 'classnames';

import { translate } from '../../services';

import styles from './styles.scss';
import global from '../../../css/global.scss';

import { IconButton } from '..';

export default ({ icon, text, hidden, center, className }) => (
  <div
    className={cx(
      styles.container,
      global.CustomFont2,
      !icon && styles.noIcon,
      hidden && styles.isHidden,
      center && styles.isCenter,
      className
    )}
  >
    <IconButton className={cx(styles.icon)} size="small" icon={icon} />
    <div className={styles.text}>{translate(text)}</div>
  </div>
);
