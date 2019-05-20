import React from 'react';
import cx from 'classnames';

import styles from './styles.scss';

export default ({ disabled, onChange, value, className }) => (
  <textarea
    className={cx(styles.input, className)}
    disabled={disabled}
    onChange={event => onChange(event.target.value)}
    value={value}
  />
);
