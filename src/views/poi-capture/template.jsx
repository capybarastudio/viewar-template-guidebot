import React, { Fragment } from 'react';
import styles from './styles.scss';

import {
  Logo,
  IconButton,
  PoiPlacement,
  PoiScreenshot,
  PoiEdit,
  PleaseWaitDialog,
  ErrorDialog,
} from '../../components';

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
    <ErrorDialog {...props} />
    <IconButton
      onClick={() => goTo('/map-edit')}
      className={styles.closeButton}
      icon="cancel"
      active
      hidden={poi}
    />
  </Fragment>
);
