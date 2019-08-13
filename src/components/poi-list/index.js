import { compose, withHandlers, withProps, withState } from 'recompose';
import { camera, graphController } from '../../services';
import { withRefs } from '../../utils';

import render from './template.jsx';
import { getUiConfigPath } from '../../utils';

export const sortByName = (a, b) => {
  const aName = a.data.name.toLowerCase();
  const bName = b.data.name.toLowerCase();
  if (aName < bName) return -1;
  if (aName > bName) return 1;
  return 0;
};

export const getPois = ({ sortByName, query, searchVisible }) => () => {
  let pois = graphController.pois;
  if (query && searchVisible) {
    pois = pois.filter(poi =>
      (poi.data.name || 'Untitled').toLowerCase().includes(query.toLowerCase())
    );
  }

  return pois.sort(sortByName);
};

export const toggleSearch = ({
  searchVisible,
  setSearchVisible,
  refs,
}) => () => {
  setSearchVisible(!searchVisible);

  if (!searchVisible) {
    const element = refs['searchBar'];
    if (element) {
      element.focus();
    }
  }
};

export const getDistance = poi =>
  (graphController.getPathLengthBetween(camera, poi) / 1000).toFixed(1);

export default compose(
  withRefs,
  withState('query', 'setQuery', ''),
  withState('searchVisible', 'setSearchVisible', false),
  withProps(() => ({
    usePoiImages: getUiConfigPath('app.usePoiImages'),
    sortByName,
    getDistance,
  })),
  withHandlers({
    getPois,
    toggleSearch,
  })
)(render);
