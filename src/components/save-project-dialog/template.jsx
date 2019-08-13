import React from 'react';
import cx from 'classnames';
import { Button, TextInput, ModalDialog } from '../';
import styles from './styles.scss';

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
      <form onSubmit={saveProject}>
        <TextInput onChange={setProjectName} value={projectName} />
        <input type="submit" />
      </form>
      <Button onClick={saveProject}>Save current</Button>
      <Button onClick={saveNewProject}>Save new</Button>
      <Button onClick={hideSaveDialog}>Cancel</Button>
    </div>
  </ModalDialog>
);
