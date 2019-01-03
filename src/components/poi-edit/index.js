import {
  compose,
  withProps,
  withState,
  withHandlers,
  lifecycle,
  withPropsOnChange,
} from 'recompose';
import graphController from '../../services/graph-controller';
import storage from '../../services/storage';
import appState from '../../services/app-state';
import { sceneManager } from 'viewar-api';

import render from './template.jsx';

export default compose(
  withState('poiInfo', 'setPoiInfo', null),
  withState('title', 'setTitle', ''),
  withState('text', 'setText', ''),
  withProps({
    appState,
    storage,
    sceneManager,
    graphController,
  }),
  withHandlers({
    saveChanges: ({
      savePoi,
      poi,
      text,
      title,
      sceneManager,
      hideEdit,
      showDialog,
      hideDialog,
      appState,
    }) => async () => {
      await showDialog('Please wait...');
      Object.assign(poi.data, {
        name: title,
        description: text,
      });

      await sceneManager.clearSelection();
      savePoi && (await savePoi());
      hideEdit();
      await hideDialog();
    },
  }),
  withPropsOnChange(['poi'], ({ poi, setPoiInfo, setTitle, setText }) => {
    if (poi) {
      setPoiInfo(poi.data);
      setTitle(poi.data.name);
      setText(poi.data.description);
    } else {
      setPoiInfo(null);
      setTitle(null);
      setText(null);
    }
  })
)(render);
