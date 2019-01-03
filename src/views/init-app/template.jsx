import React from 'react';
import classNames from 'classnames';
import styles from './styles.css';
import globalStyles from '../../../css/global.css';
import IconButton from '../../components/icon-button';
import Logo from '../../components/logo';
import Toolbar from '../../components/toolbar';
import PleaseWaitDialog from '../../components/please-wait-dialog';
import Background from '../../components/background';
import Loadingbar from '../../components/loadingbar';
import PromptPopup from '../../components/prompt-popup';
import { translate } from '../../services/translations';

export default ({ goTo, goToLogin, loading, loadProject, ...props }) => (
  <div className={styles.container}>
    <Background />
    <Toolbar hidden={loading}>
      <IconButton
        size="small"
        icon="info"
        className={styles.buttonSmall}
        onClick={() => goTo('/info')}
      />
    </Toolbar>
    <Toolbar hidden={loading} className={styles.toolbarRight}>
      <IconButton
        size="small"
        icon="login"
        className={styles.buttonSmall}
        onClick={() => goToLogin()}
      />
    </Toolbar>
    <PromptPopup {...props} />
    <PleaseWaitDialog {...props} />
    <Logo size="large" />
    <Loadingbar
      className={classNames(styles.loading)}
      visible={loading}
      {...props}
    />
    <div
      className={classNames(
        styles.button,
        !loading && styles.isVisible,
        globalStyles.StartButtonColor,
        globalStyles.StartButtonBackgroundColor
      )}
      onClick={() => loadProject()}
    >
      {translate('HomeStart')}
    </div>
  </div>
);
