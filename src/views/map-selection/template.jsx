import React, { Fragment } from 'react';
import styles from './styles.scss';
import {
  Logo,
  LoadProjectDialog,
  HeaderBar,
  IconButton,
  PleaseWaitDialog,
  Background,
} from '../../components';

const MapSelectionHeaderBar = ({ headerBarHidden, goBack, ...props }) => (
  <HeaderBar hidden={headerBarHidden} {...props} className={styles.headerBar}>
    <IconButton onClick={() => goBack()} size="small" icon="back" />
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
