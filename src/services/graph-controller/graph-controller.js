import {
  calculateDistance,
  calculateDistanceSquared,
  calculateEdgePose,
  findNearestPointTo,
  findNearestPointOnEdge,
} from '../../math/math';

import config from '../../services/config';

import findShortestPath from '../../math/graph/find-shortest-path';
import {
  importGraphState,
  exportGraphState,
} from '../../math/graph/graph-utils';

const pairwise = array =>
  array.slice(1).map((item, index) => [array[index], item]);

export default function createGraphController({
  graph,
  insertWaypointAt,
  insertPathAt,
  removeObject,
  getSelection,
}) {
  const poiByWaypoints = new Map();
  const waypointsByPoi = new Map();
  let undoStack = [];

  const updatePoiWaypointMapping = () => {
    const pois = [...waypointsByPoi.keys()];

    waypointsByPoi.clear();
    poiByWaypoints.clear();

    for (let poi of pois) {
      const nearestWaypoint = getNearestWaypoint(poi);

      if (!poiByWaypoints.has(nearestWaypoint)) {
        poiByWaypoints.set(nearestWaypoint, new Set());
      }
      poiByWaypoints.get(nearestWaypoint).add(poi);

      waypointsByPoi.set(poi, nearestWaypoint);
    }
  };

  const getNearestWaypoint = (object, radius) =>
    findNearestPointTo(object, graph.vertices, radius);

  const getNearestPathWaypoint = (object, radius) =>
    findNearestPointOnEdge(
      object.pose.position,
      graph.edges.map(edge => ({
        edge,
        points: graph
          .getIncidentVerticesOf(edge)
          .map(vertex => vertex.pose.position),
      })),
      radius
    );

  const getPathLengthBetween = (user, poi) => {
    const path = [user, ...findPath(user, poi)];
    return pairwise(path).reduce(
      (length, [from, to]) => length + calculateDistance(from, to),
      0
    );
  };

  // TODO: Known bug: Sometimes the path finding is wrong because the graph's adjacencyMap is faulty.
  // Test when this is getting wrong (probably undo/split/...
  const findPath = (user, poi) => {
    if (!waypointsByPoi.has(poi)) {
      throw new Error(
        `Error! Destination POI (${poi.$id}) not present in the environment!`
      );
    }

    const nearestWaypoint = getNearestWaypoint(user);
    const neighbors = graph.getNeighborsOf(nearestWaypoint);
    for (const point of [nearestWaypoint, ...neighbors]) {
      graph.addEdge({}, user, point);
    }
    const path = findShortestPath(
      graph,
      calculateDistanceSquared,
      user,
      waypointsByPoi.get(poi)
    );
    graph.removeVertex(user);

    const proximity = config.guideParams.nearDistance;

    while (path.length >= 2 && calculateDistance(user, path[0]) < proximity) {
      path.shift();
    }

    return path;
  };

  const addPoi = (poi, waypoint, canUndo = true) => {
    if (!graph.contains(waypoint)) {
      throw new Error(
        'Cannot attach POI to a waypoint not present in the environment!'
      );
    }

    if (!poiByWaypoints.has(waypoint)) {
      poiByWaypoints.set(waypoint, new Set());
    }
    poiByWaypoints.get(waypoint).add(poi);

    waypointsByPoi.set(poi, waypoint);

    canUndo &&
      undoStack.push({
        type: 'poi',
        action: 'add',
        poi,
      });
  };

  const removePoi = (poi, canUndo = true) => {
    const waypoint = waypointsByPoi.get(poi);

    if (waypoint) {
      poiByWaypoints.get(waypoint).delete(poi);
    }
    waypointsByPoi.delete(poi);

    canUndo &&
      undoStack.push({
        type: 'poi',
        action: 'remove',
        poi,
        waypoint,
      });
  };

  /**
   * Inserts a new waypoint and adds a path to it from the currently selected waypoint.
   * Depending of the position of the reticule:
   *  1) reticule is near an existing waypoint: Add path from selected to to existing waypoint.
   *  2) reticule is near an existing path: Add new waypoint on path and split path.
   *  3) otherwise insert completely new waypoint and create a new path.
   *
   * If no waypoint is selected then the last waypoint is automatically taken.
   *
   * @param pose Position of the reticule
   */
  const addWaypoint = async (pose, canUndo = true) => {
    const nearestWaypoint = getSelectedWaypoint();
    const existingWaypoint = getNearestWaypoint({ pose }, 300);

    if (existingWaypoint) {
      // Insert path to existing waypoint.
      await insertWaypoint(existingWaypoint, nearestWaypoint);

      canUndo &&
        existingWaypoint !== nearestWaypoint &&
        undoStack.push({
          type: 'path',
          action: 'add',
          from: existingWaypoint,
          to: nearestWaypoint,
        });
    } else {
      const { edge, point } = getNearestPathWaypoint({ pose }, 500);

      if (point) {
        // Insert new waypoint on existing path.
        const targetWayPoint = await insertWaypointAt({
          position: point,
        });
        await insertWaypointOnPath(targetWayPoint, edge, canUndo);
      } else {
        // Insert completely new waypoint and path.
        const newWaypoint = await insertWaypointAt(pose);
        await insertWaypoint(newWaypoint, nearestWaypoint);

        canUndo &&
          undoStack.push({
            type: 'waypoint',
            action: 'add',
            waypoint: newWaypoint,
          });
      }
    }

    updatePoiWaypointMapping();
  };

  /**
   * Inserts a waypoint to the existing graph and connects it with the other given, already existing, waypoint with
   * an edge.
   *
   * @param targetWaypoint The new waypoint to add.
   * @param nearestWaypoint An existing waypoint to connect the new waypoint to.
   */
  const insertWaypoint = async (targetWaypoint, nearestWaypoint) => {
    if (nearestWaypoint !== targetWaypoint) {
      if (nearestWaypoint) {
        if (!graph.getEdgeConnecting(nearestWaypoint, targetWaypoint)) {
          await insertPath(nearestWaypoint, targetWaypoint);
        }
      } else {
        graph.addVertex(targetWaypoint);
      }
    }
  };

  /**
   * Splits an existing edge into two parts and inserts a new waypoint in between.
   *
   * @param targetWaypoint The waypoint to add on the edge.
   * @param edge The edge where the waypoint should be added to.
   */
  const insertWaypointOnPath = async (targetWaypoint, edge, canUndo = true) => {
    const vertices = graph.getIncidentVerticesOf(edge);

    // Remove existing edge
    await removeObject(edge);
    graph.removeEdge(edge);

    // Add vertex in between.
    graph.addVertex(targetWaypoint);

    // Connect vertices with new edges.
    await insertPath(vertices[0], targetWaypoint);
    await insertPath(targetWaypoint, vertices[1]);

    canUndo &&
      undoStack.push({
        type: 'edge',
        action: 'split',
        waypoint: targetWaypoint,
        vertices,
      });
  };

  const insertPath = async (p1, p2) => {
    const pose = calculateEdgePose(p1, p2);
    const pathInstance = await insertPathAt(pose);

    graph.addEdge(pathInstance, p1, p2);
  };

  const remove = async (object, canUndo = true) => {
    if (graph.containsVertex(object)) {
      const edgesToRemove = graph.getIncidentEdgesOf(object);
      const connectedVertices = graph.getNeighborsOf(object);
      graph.removeVertex(object);
      await removeObject(object);

      for (const edge of edgesToRemove) {
        await removeObject(edge);
      }

      updatePoiWaypointMapping();

      canUndo &&
        undoStack.push({
          type: 'waypoint',
          action: 'remove',
          waypoint: object,
          connections: connectedVertices,
        });
    } else if (graph.containsEdge(object)) {
      await removeObject(object);
    }
  };

  const clearState = () => {
    graph.clear();
    poiByWaypoints.clear();
    waypointsByPoi.clear();
    undoStack = [];
  };

  const importState = ({ waypoints, paths, pois, adjacency, poiMap }) => {
    clearState();

    importGraphState(graph, { vertices: waypoints, edges: paths, adjacency });

    for (const [waypointId, poiList] of Object.entries(poiMap)) {
      for (const poiId of poiList) {
        addPoi(pois[poiId], waypoints[waypointId], false);
      }
    }

    undoStack = [];
  };

  const exportState = () => {
    updatePoiWaypointMapping();

    const { vertices: waypoints, edges: paths, adjacency } = exportGraphState(
      graph
    );
    const pois = {};
    const poiMap = {};

    for (const [waypoint, poiSet] of poiByWaypoints.entries()) {
      for (const poi of poiSet) {
        pois[poi.$id] = poi;
        poiMap[waypoint.$id] = poiMap[waypoint.$id] || [];
        poiMap[waypoint.$id].push(poi.$id);
      }
    }

    return {
      waypoints,
      paths,
      pois,
      adjacency,
      poiMap,
    };
  };

  const getSelectedWaypoint = () => {
    const selection = getSelection();
    return (
      (selection && findById(selection.id)) ||
      (graph.vertices.length && graph.vertices[graph.vertices.length - 1])
    );
  };

  const findById = id =>
    graph.vertices.find(vertex => vertex.id === id) ||
    graph.edges.find(edge => edge.id === id) ||
    [...waypointsByPoi.keys()].find(edge => edge.id === id);

  const contains = object =>
    graph.contains(object) || waypointsByPoi.has(object);

  const getPathsFrom = waypoint => graph.getIncidentEdgesOf(waypoint);
  const getWaypointsOf = path => graph.getIncidentVerticesOf(path);
  const getPoisOf = waypoint => poiByWaypoints.get(waypoint) || new Set();
  const containsWaypoint = waypoint => graph.containsVertex(waypoint);

  const undo = async () => {
    if (!!undoStack.length) {
      const description = undoStack.pop();

      switch (description.type) {
        case 'waypoint':
          await undoWaypoint(description);
          break;
        case 'poi':
          undoPoi(description);
          break;
        case 'path':
          await undoPath(description);
          break;
        case 'edge':
          await undoEdge(description);
          break;
      }
    }
  };

  const undoWaypoint = async description => {
    switch (description.action) {
      case 'add':
        await remove(description.waypoint, false);
        break;
      case 'remove':
        graph.addVertex(description.waypoint);
        for (let vertex of description.connections) {
          await insertPath(vertex, description.waypoint);
        }
        break;
    }
  };

  const undoPoi = description => {
    switch (description.action) {
      case 'add':
        removePoi(description.poi, false);
        break;
      case 'remove':
        addPoi(description.poi, description.waypoint, false);
        break;
    }
  };

  const undoPath = async description => {
    switch (description.action) {
      case 'add':
        const edge = graph.getEdgeConnecting(description.from, description.to);
        if (edge) {
          await removeObject(edge);
          graph.removeEdge(edge);
        }
        break;
    }
  };

  const undoEdge = async description => {
    switch (description.action) {
      case 'split':
        await insertPath(description.vertices[0], description.vertices[1]);
        await remove(description.waypoint, false);

        break;
    }
  };

  return {
    addWaypoint,
    removeObject: remove,
    addPoi,
    removePoi,
    getNearestWaypoint,
    getDistance: calculateDistance,
    findPath,
    findById,
    importState,
    exportState,
    clearState,
    contains,
    getPathsFrom,
    getWaypointsOf,
    getPoisOf,
    containsWaypoint,
    getPathLengthBetween,
    undo,
    get waypoints() {
      return graph.vertices;
    },
    get paths() {
      return graph.edges;
    },
    get pois() {
      return [...waypointsByPoi.keys()];
    },
    get canUndo() {
      return !!undoStack.length;
    },
    get selectedWaypoint() {
      return getSelectedWaypoint();
    },
  };
}
