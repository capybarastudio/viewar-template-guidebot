import React from 'react';
import cx from 'classnames';
import styles from './styles.scss';
import global from '../../../css/global.scss';
import {
  IconButton,
  HeaderBar,
  TourSlider,
  Background,
} from '../../components';
import { translate } from '../../services';

const TourSelectionBar = ({ goBack }) => (
  <HeaderBar className={styles.headerBar}>
    <IconButton
      onClick={goBack}
      size="small"
      icon="back"
      className={styles.headerBarButton}
    />
  </HeaderBar>
);

export default ({ selectTour, goBack, tours }) => (
  <div className={styles.container}>
    <Background />
    <TourSelectionBar goBack={goBack} />
    <TourSlider items={tours} selectItem={selectTour} />
  </div>
);
