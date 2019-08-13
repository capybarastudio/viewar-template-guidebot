import { compose, withProps } from 'recompose';
import viewarApi from 'viewar-api';

import render from './template.jsx';

export default compose(
  withProps(() => ({
    versionInfo: Object.assign({}, viewarApi.versionInfo, {
      pkId: viewarApi.appConfig.pkId,
    }),
  }))
)(render);
