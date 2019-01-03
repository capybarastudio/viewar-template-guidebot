import React from 'react';
import classNames from 'classnames';
import Button from '../button';
import IconButton from '../icon-button';
import TextInput from '../text-input';
import { translate } from '../../services/translations';
import styles from './styles.css';

export default ({ visible, name, setName, saveChanges, goBack, className }) => (
  <div
    className={classNames(
      styles.container,
      !visible && styles.isHidden,
      className
    )}
  >
    <div className={styles.title}>{translate('AdminNewProjectName')}</div>
    <TextInput onChange={setName} value={name} className={styles.input} />
    <Button
      className={classNames(styles.button)}
      onClick={() => saveChanges()}
      label="Save"
    />
    <IconButton
      size="small"
      icon="close"
      onClick={() => goBack()}
      className={styles.closeButton}
    />
    }
  </div>
);
