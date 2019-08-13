import React from 'react';
import cx from 'classnames';
import styles from './styles.scss';
import {
  IconButton,
  ToolBar,
  LoginForm,
  Logo,
  Background,
  PleaseWaitDialog,
  Toast,
} from '../../components';

export default ({ goTo, goToInitTracker, ...props }) => (
  <div className={styles.container}>
    <Background />
    <PleaseWaitDialog {...props} />
    <Toast {...props} />
    <ToolBar>
      <IconButton
        size="small"
        icon="back"
        className={styles.buttonSmall}
        onClick={() => goTo('/')}
      />
    </ToolBar>
    <Logo admin size="large" />
    <LoginForm {...props} />
  </div>
);
