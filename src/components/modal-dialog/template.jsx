import React from 'react';
import ReactDOM from 'react-dom';
import styles from './styles.css';

const modalRoot = document.getElementById('modal-root');

export default ({ children, show }) => (
  <div>
    {ReactDOM.createPortal(
      show ? (
        <div className={styles.wrapper}>
          <div className={styles.content}>{children}</div>
        </div>
      ) : (
        <div />
      ),
      modalRoot
    )}
  </div>
);
