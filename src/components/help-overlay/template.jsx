import React from 'react';
import cx from 'classnames';

import { translate } from '../../services';

import { Icon, IconButton, Button } from '../';

import styles from './styles.scss';
import global from '../../../css/global.scss';

export default ({
  className,
  hidden,
  buttons,
  getButtonName,
  initialHelp,
  toggleHelp,
  ...props
}) => (
  <div className={cx(styles.container, hidden && styles.isHidden, className)}>
    <IconButton
      icon="close"
      size="small"
      className={styles.cancelButton}
      onClick={toggleHelp}
    />

    <div className={styles.content}>
      <div className={styles.help}>
        {buttons.map(button => (
          <div className={styles.entry} key={button}>
            <div className={styles.image}>
              <Icon className={styles.icon} icon={button} />
            </div>
            <div className={styles.text}>
              <div className={cx(styles.title, global.CustomFont2)}>
                {translate(`Help${getButtonName(button)}`)}
              </div>
              <div className={styles.description}>
                {translate(`Help${getButtonName(button)}Description`)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {initialHelp && (
        <Button
          className={cx(styles.continueButton)}
          onClick={toggleHelp}
          label="HelpContinue"
        />
      )}
    </div>
  </div>
);
