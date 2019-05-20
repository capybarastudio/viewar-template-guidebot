import React from 'react';
import cx from 'classnames';
import Button from '../button';
import IconButton from '../icon-button';
import TextInput from '../text-input';
import { translate } from '../../services';
import styles from './styles.scss';

export default ({ visible, name, setName, saveChanges, goBack, className }) => (
  <div className={cx(styles.container, !visible && styles.isHidden, className)}>
    <div className={styles.title}>{translate('AdminNewProjectName')}</div>
    <TextInput onChange={setName} value={name} className={styles.input} />
    <Button
      className={cx(styles.button)}
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
