import React, { Fragment } from 'react';
import cx from 'classnames';

import styles from './styles.css';
import globalStyles from '../../../css/global.css';

export default () => (
  <Fragment>
    <div className={cx(styles.container, globalStyles.BackgroundImage)} />
    <div className={cx(styles.background)} />
  </Fragment>
);
