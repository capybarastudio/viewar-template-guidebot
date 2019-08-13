import {
  compose,
  withProps,
  withState,
  withHandlers,
  lifecycle,
  withPropsOnChange,
} from 'recompose';
import { graphController, storage, appState } from '../../services';
import { sceneManager } from 'viewar-api';

import render from './template.jsx';

export const saveChanges = ({
  savePoi,
  poi,
  text,
  title,
  hideEdit,
  showDialog,
  hideDialog,
}) => async e => {
  e.preventDefault();
  await showDialog('Please wait...');
  Object.assign(poi.data, {
    name: title,
    description: text,
  });

  await sceneManager.clearSelection();
  savePoi && (await savePoi());
  await hideDialog();
  hideEdit();
};

export default compose(
  withState('poiInfo', 'setPoiInfo', null),
  withState('title', 'setTitle', ''),
  withState('text', 'setText', ''),
  withHandlers({
    saveChanges,
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
