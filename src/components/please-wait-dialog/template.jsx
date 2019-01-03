import React from 'react';

import ModalDialog from '../../components/modal-dialog';
import Spinner from '../../components/spinner';

export default ({ waitDialogText }) => (
  <ModalDialog show={waitDialogText}>
    <Spinner waitDialogText={waitDialogText} />
  </ModalDialog>
);
