import React, { Fragment } from 'react';
import styles from './styles.scss';
import {
  Logo,
  PoiList,
  MapViewToolBar,
  PoiView,
  PoiEdit,
  PromptPopup,
  HeaderBar,
  IconButton,
  PleaseWaitDialog,
  Toast,
} from '../../components';

const MapViewHeaderBar = ({ headerBarHidden, goBack, ...props }) => (
  <HeaderBar hidden={headerBarHidden} {...props} className={styles.headerBar}>
    <IconButton onClick={() => goBack()} size="small" icon="back" />
  </HeaderBar>
);

export default ({ editVisible, goTo, ...props }) => (
  <Fragment>
    <Logo admin />
    <PleaseWaitDialog {...props} />
    <Toast {...props} />
    <MapViewHeaderBar {...props} />
    <MapViewToolBar visible={!props.poiListVisible} {...props} />
    <PoiList visible={props.poiListVisible} {...props} />
    <PoiView visible={!editVisible && !props.poiListVisible} {...props} />
    <PoiEdit visible={editVisible && !props.poiListVisible} {...props} close />
    <PromptPopup {...props} />
  </Fragment>
);
