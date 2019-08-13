import { compose, branch, renderComponent, withProps } from 'recompose';
import { waypointPlacement } from '../../services';

import render from './template.jsx';

export default compose(
  branch(
    ({ waypointPlacementActive }) => !waypointPlacementActive,
    renderComponent(() => null)
  ),
  withProps({
    addWaypoint: waypointPlacement.addWaypoint,
    removeSelectedWaypoint: waypointPlacement.removeWaypoint,
  })
)(render);
