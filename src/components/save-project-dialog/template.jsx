import React from 'react';
import classNames from 'classnames';
import Button from '../../components/button';
import TextInput from '../../components/text-input';
import ModalDialog from '../../components/modal-dialog';
import styles from './styles.css';

export default ({
  projectName,
  setProjectName,
  saveProject,
  saveNewProject,
  saveDialogVisible,
  hideSaveDialog,
}) => (
  <ModalDialog show={saveDialogVisible}>
    <div className={styles.loadSaveDialog}>
      <div className={styles.title}>Save project</div>
      <TextInput onChange={setProjectName} value={projectName} />
      <Button onClick={saveProject}>Save current</Button>
      <Button onClick={saveNewProject}>Save new</Button>
      <Button onClick={hideSaveDialog}>Cancel</Button>
    </div>
  </ModalDialog>
);
