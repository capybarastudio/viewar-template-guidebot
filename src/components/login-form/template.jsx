import React from 'react';
import classNames from 'classnames';
import styles from './styles.css';
import { translate } from '../../services/translations';
import TextInput from '../../components/text-input';
import IconButton from '../icon-button';

export default ({
  login,
  className,
  setUsername,
  username,
  setPassword,
  password,
}) => (
  <div className={classNames(styles.loginForm, className)}>
    <div className={classNames(styles.inputWrapper, styles.username)}>
      <TextInput
        onChange={setUsername}
        value={username}
        placeholder={translate('LoginUsername', false)}
      />
    </div>
    <div className={classNames(styles.inputWrapper, styles.password)}>
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
