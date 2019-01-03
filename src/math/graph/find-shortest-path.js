export default function findShortestPath(
  graph,
  getDistanceBetween,
  source,
  target
) {
  if (source === target) {
    return [source];
  }

  const unvisitedVertices = new Set();
  const distanceFromSource = new Map();
  const previousVertexOf = new Map();

  // Initialize distances, pervious vertices and unvisited list.
  for (const vertex of graph.vertices) {
    distanceFromSource.set(vertex, Infinity);
    previousVertexOf.set(vertex, undefined);
    unvisitedVertices.add(vertex);
  }

  distanceFromSource.set(source, 0);

  while (unvisitedVertices.size) {
    // Get next vertex and remove from unvisited list.
    const currentVertex = getVertexWithLeastDistance(
      unvisitedVertices,
      distanceFromSource
    );
    unvisitedVertices.delete(currentVertex);

    for (const neighbor of graph.adjacencyMap.get(currentVertex).values()) {
      // Get all unvisited neighbors.
      if (unvisitedVertices.has(neighbor)) {
        // Distance is calculated from current vertex' distance to source + the distance from the current vertex to
        // the neighbor.
        const newLength =
          distanceFromSource.get(currentVertex) +
          getDistanceBetween(currentVertex, neighbor);

        // If distance is the shortest distance found to neighbour then update previous vertex for neigbor.
        if (newLength < distanceFromSource.get(neighbor)) {
          distanceFromSource.set(neighbor, newLength);
          previousVertexOf.set(neighbor, currentVertex);
        }
      }
    }

    if (currentVertex === target) {
      break;
    }
  }

  return generatePath(previousVertexOf, target);
}

/**
 * Get the (unvisited) vertex with the least distance to source.
 */
function getVertexWithLeastDistance(unvisitedVertices, distanceFromSource) {
  let result = undefined;
  let minDistance = Infinity;

  for (const vertex of unvisitedVertices) {
    const vertexDistance = distanceFromSource.get(vertex);
    if (vertexDistance < minDistance) {
      result = vertex;
      minDistance = vertexDistance;
    }
  }

  return result;
}

/**
 * Generate final path. Start with target and traverse to previous vertex until no path element is left.
 */
function generatePath(previousVertexOf, target) {
  const path = [];

  let currentVertex = target;
  do {
    path.unshift(currentVertex);
    currentVertex = previousVertexOf.get(currentVertex);
  } while (currentVertex);

  return path;
}
