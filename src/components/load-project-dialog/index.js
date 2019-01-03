import { compose, withProps } from 'recompose';

import render from './template.jsx';

export default compose(
  withProps({
    parseTime: timestamp => {
      const date = new Date(timestamp);
      return isNaN(timestamp) ? timestamp : date.toLocaleString();
    },
  })
)(render);
