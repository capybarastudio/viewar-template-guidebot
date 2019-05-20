import React from 'react';
import ReactDOM from 'react-dom';
import styles from './styles.scss';
import cx from 'classnames';

const modalRoot = document.getElementById('modal-root');

export default ({ children, show, className }) => (
  <div>
    {ReactDOM.createPortal(
      show ? (
        <div className={styles.wrapper}>
          <div className={cx(styles.content, className)}>{children}</div>
        </div>
      ) : (
        <div />
      ),
      modalRoot
    )}
  </div>
);
