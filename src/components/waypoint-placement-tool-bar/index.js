import { compose, branch, renderComponent, withProps } from 'recompose';

import render from './template.jsx';

import waypointPlacement from '../../services/waypoint-placement';

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
