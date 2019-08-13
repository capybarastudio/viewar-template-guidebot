import React from 'react';
import cx from 'classnames';
import styles from './styles.scss';
import global from '../../../css/global.scss';
import { IconButton, HeaderBar, Background, Button } from '../../components';

const PerspectiveBar = ({ goBack }) => (
  <HeaderBar className={styles.headerBar}>
    <IconButton
      onClick={goBack}
      size="small"
      icon="close"
      className={styles.headerBarButton}
    />
  </HeaderBar>
);

export default ({
  getScreenshotUrl,
  goBack,
  pois,
  poiIndex,
  previousPoi,
  nextPoi,
}) => (
  <div className={styles.container}>
    <PerspectiveBar goBack={goBack} />
    <Background />

    <div className={styles.poi}>
      {pois[poiIndex] && (
        <>
          <div className={styles.name}>{pois[poiIndex].data.name}</div>

          <div
            className={styles.image}
            style={{
              backgroundImage: `url('${getScreenshotUrl(pois[poiIndex])}')`,
            }}
          />

          <div className={styles.description}>
            {pois[poiIndex].data.description}
          </div>

          <div className={styles.buttons}>
            <IconButton
              icon="previous"
              onClick={previousPoi}
              className={styles.button}
            />
            <IconButton
              onClick={nextPoi}
              icon="play"
              className={styles.button}
              onClick={goBack}
            />
            <IconButton
              icon="skip"
              onClick={nextPoi}
              className={styles.button}
            />
          </div>
        </>
      )}
    </div>
  </div>
);
