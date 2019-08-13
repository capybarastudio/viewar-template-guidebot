import {
  compose,
  withProps,
  withState,
  withHandlers,
  lifecycle,
} from 'recompose';
import { graphController } from '../../services';
import viewarApi from 'viewar-api';

import render from './template.jsx';

export const getScreenshotUrl = () => async poiInfo => {
  let returnUrl;

  if (poiInfo) {
    if (poiInfo.freezeFrame) {
      const freezeFrame = viewarApi.cameras.arCamera.freezeFrames.find(
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
};

export const deselectPoi = () => () => viewarApi.sceneManager.clearSelection();

export const updateSelection = ({
  setPoiInfo,
  getScreenshotUrl,
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
};

export default compose(
  withState('poiInfo', 'setPoiInfo', null),
  withState('screenshotUrl', 'setScreenshotUrl', null),
  withHandlers({
    getScreenshotUrl: () => async poiInfo => {
      let returnUrl;

      if (poiInfo) {
        if (poiInfo.freezeFrame) {
          const freezeFrame = viewarApi.cameras.arCamera.freezeFrames.find(
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
    deselectPoi: ({}) => () => viewarApi.sceneManager.clearSelection(),
    updateSelection: ({
      setPoiInfo,
      getScreenshotUrl,
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
      const { updateSelection } = this.props;
      updateSelection(viewarApi.sceneManager.selection);
      viewarApi.sceneManager.on('selectionChanged', updateSelection);
    },
    componentWillUnmount() {
      const { updateSelection } = this.props;
      viewarApi.sceneManager.off('selectionChanged', updateSelection);
    },
  })
)(render);
