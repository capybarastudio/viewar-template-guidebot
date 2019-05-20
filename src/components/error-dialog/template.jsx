import React from 'react';

import { Button, ModalDialog } from '../';
import styles from './styles.scss';
import { translate } from '../../services';

export default ({ errorDialogText, onErrorDialogClose }) => (
  <ModalDialog show={errorDialogText} className={styles.errorDialog}>
    <div className={styles.message}>{translate(errorDialogText)}</div>
    {onErrorDialogClose && (
      <Button
        label="OK"
        onClick={onErrorDialogClose}
        className={styles.closeButton}
      />
    )}
  </ModalDialog>
);
