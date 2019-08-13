import { withRouter } from 'react-router';
import {
  compose,
  withHandlers,
  withProps,
  withState,
  lifecycle,
} from 'recompose';
import { getUiConfigPath } from '../../utils';

import render from './template.jsx';
import { appState, storage, withDialogControls } from '../../services';

export const goTo = ({ history }) => route => {
  history.push(route);
};

export const goBack = ({ history }) => () => {
  history.push(appState.modeBackPath || '/');
};

export const init = ({
  showDialog,
  goTo,
  voiceDisabled,
  tourDisabled,
  manualDisabled,
  hasTours,
}) => () => {
  if (manualDisabled && voiceDisabled) {
    if (hasTours) {
      goTo('/tour-selection');
    } else {
      showDialog('ModeSelectionNoToursAvailable');
    }
  } else if (tourDisabled && manualDisabled) {
    goTo('/voice');
  } else if (tourDisabled && voiceDisabled) {
    goTo('/manual');
  }
};

export const showDialog = ({
  setPromptVisible,
  setPromptText,
}) => async text => {
  setPromptText(text);
  setPromptVisible(true);
};

export default compose(
  withRouter,
  withState('promptVisible', 'setPromptVisible', false),
  withState('promptText', 'setPromptText', ''),
  withProps(() => ({
    promptButton: 'ModeSelectionBack',
    voiceDisabled: getUiConfigPath('app.voiceDisabled'),
    tourDisabled: getUiConfigPath('app.tourDisabled'),
    manualDisabled: getUiConfigPath('app.manualDisabled'),
    hasTours: !!storage.activeProject.tours.length,
  })),
  withHandlers({
    goTo,
    goBack,
    showDialog,
    onPromptConfirm: goBack,
  }),
  withHandlers({
    init,
  }),
  lifecycle({
    componentWillMount() {
      this.props.init();
    },
  })
)(render);
