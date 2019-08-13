import React from 'react';
import cx from 'classnames';

import styles from './styles.scss';
import global from '../../../css/global.scss';

export default ({
  disabled,
  onChange,
  value,
  password,
  placeholder,
  className,
}) => (
  <input
    type={password ? 'password' : 'text'}
    className={cx(styles.input, global.CustomFont2, className)}
    disabled={disabled}
    onChange={event => onChange(event.target.value)}
    placeholder={placeholder}
    value={value}
  />
);
