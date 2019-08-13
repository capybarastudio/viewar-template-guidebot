import React from 'react';
import cx from 'classnames';
import styles from './styles.scss';
import global from '../../../css/global.scss';
import {
  IconButton,
  HeaderBar,
  Button,
  Logo,
  Background,
  PromptPopup,
} from '../../components';
import { translate } from '../../services';

const ModeSelectionBar = ({ goBack }) => (
  <HeaderBar className={styles.headerBar}>
    <IconButton
      onClick={goBack}
      size="small"
      icon="back"
      className={styles.headerBarButton}
    />
  </HeaderBar>
);

export default ({
  hasTours,
  goTo,
  goBack,
  voiceDisabled,
  manualDisabled,
  tourDisabled,
  ...props
}) => (
  <div className={styles.container}>
    <Background />
    <Logo />
    <ModeSelectionBar goBack={goBack} />
    <PromptPopup {...props} />

    <div className={cx(styles.selection)}>
      <div className={styles.title}>{translate('ModeSelectionTitle')}</div>
      {hasTours && !tourDisabled && (
        <Button
          label="ModeSelectionTour"
          className={styles.button}
          onClick={() => goTo('/tour-selection')}
        />
      )}
      {!manualDisabled && (
        <Button
          label="ModeSelectionManual"
          className={styles.button}
          onClick={() => goTo('/manual')}
        />
      )}
      {!voiceDisabled && (
        <Button
          label="ModeSelectionVoice"
          className={styles.button}
          onClick={() => goTo('/voice')}
        />
      )}
    </div>
  </div>
);
