import React, { Fragment } from 'react';
import classNames from 'classnames';
import styles from './styles.css';
import { translate } from '../../services/translations';
import DetailContainer from '../../components/detail-container';
import DetailHeader from '../../components/detail-header';
import DetailContent from '../../components/detail-content';
import Button from '../../components/button';

export default ({ visible, capturePoi }) => (
  <div className={classNames(styles.container, visible && styles.isVisible)}>
    <DetailContainer gap="right2">
      <DetailHeader>
        <h1>{translate('AdminPlacePoiHeader')}</h1>
      </DetailHeader>
      <DetailContent>
        <div className={styles.info}>
          {translate('AdminPlacePoiDescription')}
        </div>
        <div className={styles.image} />
        <Button
          label="AdminPlacePoi"
          onClick={capturePoi}
          className={styles.placeButton}
        />
      </DetailContent>
    </DetailContainer>
  </div>
);
