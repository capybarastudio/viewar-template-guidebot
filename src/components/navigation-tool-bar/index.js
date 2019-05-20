import { compose, withHandlers, withProps, withState } from 'recompose';
import camera from '../../services/camera';

import render from './template.jsx';

import graphController from '../../services/graph-controller';
import sceneDirector from '../../services/scene-director';

import config from '../../services/config';

export const sortByName = (a, b) => {
  const aName = a.data.name.toLowerCase();
  const bName = b.data.name.toLowerCase();
  if (aName < bName) return -1;
  if (aName > bName) return 1;
  return 0;
};

export default compose(
  withState('query', 'setQuery', ''),
  withState('searchVisible', 'setSearchVisible', false),
  withProps({
    sceneDirector,
    config,
  }),
  withProps(({ config }) => ({
    usePoiImages: config.app.usePoiImages,
    showPoiOriginalNames: config.app.showPoiOriginalNames,
    camera,
    sortByName,
  })),
  withHandlers({
    getPois: ({ sortByName, query, searchVisible }) => () => {
      let pois = graphController.pois;
      if (query && searchVisible) {
        pois = pois.filter(poi =>
          (poi.data.name || 'Untitled')
            .toLowerCase()
            .includes(query.toLowerCase())
        );
      }

      return pois.sort(sortByName);
    },
    toggleSearch: ({ searchVisible, setSearchVisible }) => () =>
      setSearchVisible(!searchVisible),
    getDistance: ({ camera }) => poi =>
      (graphController.getPathLengthBetween(camera, poi) / 1000).toFixed(1),
  })
)(render);
