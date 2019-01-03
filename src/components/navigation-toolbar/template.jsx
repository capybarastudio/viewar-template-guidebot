import React, { Fragment } from 'react';
import classNames from 'classnames';
import styles from './styles.css';

import DetailContainer from '../../components/detail-container';
import Header from './header.jsx';
import Content from './content.jsx';

export default ({ visible, ...props }) => (
  <div className={classNames(styles.container, visible && styles.isVisible)}>
    <DetailContainer gap="right1">
      <Header {...props} />
      <Content {...props} />
    </DetailContainer>
  </div>
);
