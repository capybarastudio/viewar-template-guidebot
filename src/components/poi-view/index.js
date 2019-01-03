import {
  compose,
  withProps,
  withState,
  withHandlers,
  lifecycle,
} from 'recompose';
import graphController from '../../services/graph-controller';
import viewarApi, { sceneManager } from 'viewar-api';

import render from './template.jsx';

export default compose(
  withState('poiInfo', 'setPoiInfo', null),
  withState('screenshotUrl', 'setScreenshotUrl', null),
  withProps({
    viewarApi,
    sceneManager,
    graphController,
  }),
  withHandlers({
    getScreenshotUrl: ({ viewarApi: { cameras } }) => async poiInfo => {
      let returnUrl;

      if (poiInfo) {
        if (poiInfo.freezeFrame) {
          const freezeFrame = cameras.arCamera.freezeFrames.find(
            ff => (ff.name = poiInfo.freezeFrame)
          );
          if (freezeFrame) {
            returnUrl = freezeFrame.imageUrl;
          }
        }

        if (!returnUrl) {
          const url = poiInfo.localScreenshotUrl || poiInfo.cloudScreenshotUrl;
          if (url) {
            returnUrl = await new Promise(resolve => {
              const img = new Image();
              img.onload = () => {
                returnUrl = url;
                resolve();
              };
              img.onerror = () => resolve();
            });
          }
        }
      }

      return returnUrl;
    },
  }),
  withHandlers({
    deselectPoi: ({ sceneManager }) => () => sceneManager.clearSelection(),
    updateSelection: ({
      setPoiInfo,
      getScreenshotUrl,
      graphController,
      setScreenshotUrl,
    }) => async newSelection => {
      setPoiInfo(null);
      setScreenshotUrl(null);

      if (newSelection) {
        const selection =
          graphController.pois.find(poi => poi.id === newSelection.id) || null;
        if (selection) {
          setPoiInfo(selection.data);
          setScreenshotUrl(await getScreenshotUrl(selection.data));
        }
      }
    },
  }),
  lifecycle({
    componentDidMount() {
      const { updateSelection, sceneManager } = this.props;
      updateSelection(sceneManager.selection);
      sceneManager.on('selectionChanged', updateSelection);
    },
    componentWillUnmount() {
      const { updateSelection, sceneManager } = this.props;
      sceneManager.off('selectionChanged', updateSelection);
    },
  })
)(render);
