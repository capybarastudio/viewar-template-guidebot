import React, { Fragment } from 'react';
import styles from './styles.css';
import Logo from '../../components/logo';
import IconButton from '../../components/icon-button';
import PoiPlacement from '../../components/poi-placement';
import PoiScreenshot from '../../components/poi-screenshot';
import PoiEdit from '../../components/poi-edit';
import PleaseWaitDialog from '../../components/please-wait-dialog';

export default ({
  poi,
  goTo,
  showEdit,
  cancelScreenshot,
  editBack,
  ...props
}) => (
  <Fragment>
    <Logo admin />
    <PleaseWaitDialog {...props} />
    <PoiPlacement visible={!poi} {...props} />
    <PoiScreenshot
      visible={poi && !showEdit}
      {...props}
      onCancel={cancelScreenshot}
    />
    <PoiEdit
      poi={poi}
      visible={showEdit}
      {...props}
      editBack={editBack}
      back
      close
    />
    <IconButton
      onClick={() => goTo('/map-edit')}
      className={styles.closeButton}
      icon="cancel"
      active
      hidden={poi}
    />
  </Fragment>
);
