import React, { Fragment } from 'react';
import styles from './styles.css';
import Logo from '../../components/logo';
import LoadProjectDialog from '../../components/load-project-dialog';
import HeaderBar from '../../components/header-bar';
import IconButton from '../../components/icon-button';
import PleaseWaitDialog from '../../components/please-wait-dialog';
import Background from '../../components/background';

const MapSelectionHeaderBar = ({ headerBarHidden, goBack, ...props }) => (
  <HeaderBar hidden={headerBarHidden} {...props} className={styles.headerBar}>
    <IconButton
      onClick={() => goBack()}
      size="small"
      icon="back"
      className={styles.headerBarButton}
    />
  </HeaderBar>
);

export default ({ goTo, ...props }) => (
  <Fragment>
    <Background />
    <Logo admin />
    <MapSelectionHeaderBar {...props} />
    <LoadProjectDialog {...props} />
    <PleaseWaitDialog {...props} />
  </Fragment>
);
