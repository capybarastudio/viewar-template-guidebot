import React from 'react';
import cx from 'classnames';
import styles from './styles.scss';
import global from '../../../css/global.scss';
import {
  IconButton,
  Logo,
  ToolBar,
  PleaseWaitDialog,
  ErrorDialog,
  Background,
  LoadingBar,
  PromptPopup,
} from '../../components';
import { translate } from '../../services';

export default ({ goTo, goToLogin, loading, loadProject, ...props }) => (
  <div className={styles.container}>
    <Background />
    <ToolBar hidden={loading}>
      <IconButton
        size="small"
        icon="info"
        className={styles.buttonSmall}
        onClick={() => goTo('/info')}
      />
    </ToolBar>
    <ToolBar hidden={loading} className={styles.toolBarRight}>
      <IconButton
        size="small"
        icon="login"
        className={styles.buttonSmall}
        onClick={() => goToLogin()}
      />
    </ToolBar>
    <PromptPopup {...props} />
    <PleaseWaitDialog {...props} />
    <ErrorDialog {...props} />
    <Logo size="large" />
    <LoadingBar className={cx(styles.loading)} visible={loading} {...props} />
    <div
      className={cx(
        styles.button,
        !loading && styles.isVisible,
        global.StartButtonColor,
        global.StartButtonBackgroundColor,
        global.CustomFont1
      )}
      onClick={() => loadProject()}
    >
      {translate('HomeStart')}
    </div>
  </div>
);
