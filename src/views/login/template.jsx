import React from 'react';
import classNames from 'classnames';
import styles from './styles.css';
import IconButton from '../../components/icon-button';
import Toolbar from '../../components/toolbar';
import LoginForm from '../../components/login-form';
import Logo from '../../components/logo';
import Background from '../../components/background';
import PleaseWaitDialog from '../../components/please-wait-dialog';
import Toast from '../../components/toast';

export default ({ goTo, goToInitTracker, ...props }) => (
  <div className={styles.container}>
    <Background />
    <PleaseWaitDialog {...props} />
    <Toast {...props} />
    <Toolbar>
      <IconButton
        size="small"
        icon="back"
        className={styles.buttonSmall}
        onClick={() => goTo('/')}
      />
    </Toolbar>
    <Logo admin size="large" className={styles.logo} />
    <LoginForm {...props} />
  </div>
);
