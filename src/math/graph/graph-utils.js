export function exportGraphState(graph) {
  const vertices = {};
  const edges = {};
  const adjacency = {};

  for (const [vertex, neighborMap] of graph.adjacencyMap.entries()) {
    vertices[vertex.$id] = vertex;

    for (const [edge, neighbor] of neighborMap.entries()) {
      edges[edge.$id] = edge;

      adjacency[vertex.$id] = adjacency[vertex.$id] || {};

      adjacency[vertex.$id][edge.$id] = neighbor.$id;
    }
  }

  return {
    vertices,
    edges,
    adjacency,
  };
}

export function importGraphState(graph, { vertices, edges, adjacency }) {
  graph.clear();

  for (const [vertexId, neighbors] of Object.entries(adjacency)) {
    for (const [edgeId, neighborId] of Object.entries(neighbors)) {
      graph.addEdge(edges[edgeId], vertices[vertexId], vertices[neighborId]);
    }
  }
}
