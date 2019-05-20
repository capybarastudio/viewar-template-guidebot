import React from 'react';
import cx from 'classnames';
import styles from './styles.scss';

import { DetailContainer, IconButton } from '../';
import Header from './header.jsx';
import Content from './content.jsx';

export default ({ visible, hideButton, togglePoiList, ...props }) => (
  <div className={cx(styles.container, visible && styles.isVisible)}>
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
