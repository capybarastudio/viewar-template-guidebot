import React from 'react';
import cx from 'classnames';
import styles from './styles.scss';
import global from '../../../css/global.scss';
import { translate } from '../../services';
import { TextInput, IconButton } from '../';

export default ({
  login,
  className,
  setUsername,
  username,
  setPassword,
  password,
}) => (
  <div className={cx(styles.loginForm, className)}>
    <div className={cx(styles.inputWrapper, styles.username)}>
      <TextInput
        onChange={setUsername}
        value={username}
        placeholder={translate('LoginUsername', false)}
      />
    </div>
    <div className={cx(styles.inputWrapper, styles.password)}>
      <TextInput
        onChange={setPassword}
        value={password}
        placeholder={translate('LoginPassword', false)}
        password
      />
    </div>
    <IconButton
      icon="login"
      onClick={() => login()}
      className={styles.button}
    />
  </div>
);
