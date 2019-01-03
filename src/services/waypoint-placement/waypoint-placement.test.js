import test from 'tape';

import createWaypointCapture from './waypoint-placement';

const noopSync = () => {};
const noopAsync = async () => {};

const getDefaultProps = () => ({
  showReticule: noopAsync,
  hideReticule: noopAsync,
  addWaypointAtReticule: noopAsync,
  getSelection: noopSync,
  clearSelection: noopAsync,
});

test('WaypointCapture - starting capture displays capture reticule', async assert => {
  assert.plan(1);

  const waypointCapture = createWaypointCapture(
    Object.assign({}, getDefaultProps(), {
      showReticule: async () => assert.pass(),
    })
  );

  await waypointCapture.start();
});

test('WaypointCapture - addWaypoint() method should throw if capture not started', async assert => {
  assert.plan(1);

  const waypointCapture = createWaypointCapture(
    Object.assign({}, getDefaultProps(), {})
  );

  try {
    await waypointCapture.addWaypoint();
    assert.fail();
  } catch (error) {
    assert.pass();
  }
});

test('WaypointCapture - removeWaypoint() method should throw if capture not started', async assert => {
  assert.plan(1);

  const waypointCapture = createWaypointCapture(
    Object.assign({}, getDefaultProps(), {})
  );

  try {
    await waypointCapture.removeWaypoint();
    assert.fail();
  } catch (error) {
    assert.pass();
  }
});
