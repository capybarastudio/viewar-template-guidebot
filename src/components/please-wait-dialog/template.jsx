import React from 'react';

import { ModalDialog, Spinner } from '../';

export default ({ waitDialogText }) => (
  <ModalDialog show={waitDialogText}>
    <Spinner waitDialogText={waitDialogText} />
  </ModalDialog>
);
