import React from 'react';
import cx from 'classnames';
import styles from './styles.scss';

import { DetailContainer } from '../';
import Header from './header.jsx';
import Content from './content.jsx';

export default ({ visible, ...props }) => (
  <div className={cx(styles.container, visible && styles.isVisible)}>
    <DetailContainer gap="right1">
      <Header {...props} />
      <Content {...props} />
    </DetailContainer>
  </div>
);
