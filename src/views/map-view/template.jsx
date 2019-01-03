import React, { Fragment } from 'react';
import styles from './styles.css';
import Logo from '../../components/logo';
import PoiList from '../../components/poi-list';
import MapViewToolbar from '../../components/map-view-toolbar';
import PoiView from '../../components/poi-view';
import PoiEdit from '../../components/poi-edit';
import PromptPopup from '../../components/prompt-popup';
import HeaderBar from '../../components/header-bar';
import IconButton from '../../components/icon-button';
import PleaseWaitDialog from '../../components/please-wait-dialog';
import Toast from '../../components/toast';

const MapViewHeaderBar = ({ headerBarHidden, goBack, ...props }) => (
  <HeaderBar hidden={headerBarHidden} {...props} className={styles.headerBar}>
    <IconButton
      onClick={() => goBack()}
      size="small"
      icon="back"
      className={styles.headerBarButton}
    />
  </HeaderBar>
);

export default ({ editVisible, goTo, ...props }) => (
  <Fragment>
    <Logo admin />
    <PleaseWaitDialog {...props} />
    <Toast {...props} />
    <MapViewHeaderBar {...props} />
    <MapViewToolbar visible={!props.poiListVisible} {...props} />
    <PoiList hideButton visible={props.poiListVisible} {...props} />
    <PoiView visible={!editVisible && !props.poiListVisible} {...props} />
    <PoiEdit visible={editVisible && !props.poiListVisible} {...props} close />
    <PromptPopup {...props} />
  </Fragment>
);
