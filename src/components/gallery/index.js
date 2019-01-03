import { compose, mapProps } from 'recompose';

import render from './template.jsx';

export default compose(
  mapProps(({ galleryImages, ...props }) => ({
    items: (galleryImages || []).map(image => ({ original: image })),
    ...props,
  }))
)(render);
