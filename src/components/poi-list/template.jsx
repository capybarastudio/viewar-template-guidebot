import React, { Fragment } from 'react';
import classNames from 'classnames';
import styles from './styles.css';

import DetailContainer from '../../components/detail-container';
import IconButton from '../../components/icon-button';
import Header from './header.jsx';
import Content from './content.jsx';

export default ({ visible, hideButton, togglePoiList, ...props }) => (
  <div className={classNames(styles.container, visible && styles.isVisible)}>
    <DetailContainer gap="right1">
      <Header {...props} />
      <Content {...props} />
    </DetailContainer>
    {!hideButton && (
      <IconButton
        onClick={() => togglePoiList()}
        icon="abort"
        className={styles.closeButton}
      />
    )}
  </div>
);
