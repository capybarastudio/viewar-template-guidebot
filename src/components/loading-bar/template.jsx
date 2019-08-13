import React from 'react';
import cx from 'classnames';
import global from '../../../css/global.scss';
import { translate } from '../../services';
import styles from './styles.scss';
import { CircularProgressbar } from 'react-circular-progressbar';
import './circular-progressbar-styles.scss';

export default ({ visible, progress, className }) => (
  <div className={cx(styles.container, !visible && styles.isHidden, className)}>
    <div className={cx(styles.title, global.CustomFont1)}>
      {translate('Loading')}
    </div>

    <CircularProgressbar
      value={progress}
      className={cx(styles.spinner, global.LoadingBarColor)}
    />
  </div>
);
