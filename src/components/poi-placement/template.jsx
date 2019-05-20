import React, { Fragment } from 'react';
import cx from 'classnames';
import styles from './styles.scss';
import { translate } from '../../services';
import { DetailContainer, DetailHeader, DetailContent, Button } from '../';

export default ({ visible, capturePoi }) => (
  <div className={cx(styles.container, visible && styles.isVisible)}>
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
