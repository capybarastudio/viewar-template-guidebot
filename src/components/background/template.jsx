import React, { Fragment } from 'react';
import cx from 'classnames';

import styles from './styles.scss';
import global from '../../../css/global.scss';

export default () => (
  <Fragment>
    <div className={cx(styles.container, global.BackgroundImage)} />
    <div className={cx(styles.background)} />
  </Fragment>
);
