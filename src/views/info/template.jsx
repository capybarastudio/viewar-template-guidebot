import React from 'react';
import cx from 'classnames';
import styles from './styles.scss';
import global from '../../../css/global.scss';
import { IconButton, ToolBar, Background, VersionInfo } from '../../components';
import { translate } from '../../services';

export default ({ openUrl, infoText, goTo }) => (
  <div className={styles.container}>
    <Background />
    <ToolBar>
      <IconButton
        size="small"
        icon="back"
        className={styles.buttonSmall}
        onClick={() => goTo('/')}
      />
    </ToolBar>

    <div className={cx(styles.info)}>
      <div>{translate(infoText)}</div>
      <br />
      <h1 className={cx(global.CustomFont3)}>{translate('InfoDeveloper')}</h1>
      <div className={cx(styles.logo)} />
      <p className={cx(global.CustomFont3)}>
        Augmented Reality Solutions
        <br />
        <a
          className={cx(styles.link, global.CustomFont3)}
          onClick={() => openUrl('http://www.viewar.com')}
        >
          www.viewar.com
        </a>
      </p>
    </div>
    <VersionInfo className={styles.versionInfo} />
  </div>
);
