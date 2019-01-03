import createPair from './pair';

export default function createGraph() {
  const adjacencyMap = new Map();
  const incidenceMap = new Map();

  const graph = {
    adjacencyMap,
    incidenceMap,

    addVertex,
    addEdge,
    isNeighbor,
    getDegreeOf,
    removeEdge,
    removeVertex,
    isLeaf,
    mergeInto,
    contains,
    containsEdge,
    containsVertex,
    reconnectEdge,
    getIncidentVerticesOf,
    getIncidentEdgesOf,
    getEdgeConnecting,
    getNeighborsOf,
    clear,

    get edges() {
      return [...incidenceMap.keys()];
    },
    get vertices() {
      return [...adjacencyMap.keys()];
    },
  };

  return graph;

  function addVertex(vertex) {
    !adjacencyMap.has(vertex) && adjacencyMap.set(vertex, new Map());
  }

  function removeVertex(vertex) {
    const incidentEdges = (adjacencyMap.get(vertex) || []).keys();
    const removedEdges = [];

    for (const incidentEdge of incidentEdges) {
      let edgeVertices = incidenceMap.get(incidentEdge);
      for (const edgeVertex of edgeVertices) {
        adjacencyMap.get(edgeVertex).delete(incidentEdge);
      }
      incidenceMap.delete(incidentEdge);
      removedEdges.push(incidentEdge);
    }

    adjacencyMap.delete(vertex);

    return removedEdges;
  }

  function addEdge(edge, vertex1, vertex2) {
    if (
      !adjacencyMap.has(vertex1) ||
      !adjacencyMap.has(vertex2) ||
      !graph.isNeighbor(vertex1, vertex2)
    ) {
      addVertex(vertex1);
      addVertex(vertex2);

      addToIncidenceMap(edge, vertex1, vertex2);
      addToAdjacencyMap(edge, vertex1, vertex2);
    }
  }

  function addToIncidenceMap(edge, vertex1, vertex2) {
    incidenceMap.set(edge, createPair(vertex1, vertex2));
  }

  function addToAdjacencyMap(edge, vertex1, vertex2) {
    adjacencyMap.get(vertex1).set(edge, vertex2);
    adjacencyMap.get(vertex2).set(edge, vertex1);
  }

  function removeEdge(edge) {
    let incidentVertices = incidenceMap.get(edge) || [];

    for (const vertex of incidentVertices) {
      adjacencyMap.get(vertex).delete(edge);
    }

    incidenceMap.delete(edge);
  }

  function isNeighbor(vertex1, vertex2) {
    return [...adjacencyMap.get(vertex1).values()].includes(vertex2);
  }

  function getDegreeOf(vertex) {
    return adjacencyMap.has(vertex) && adjacencyMap.get(vertex).size;
  }

  function isLeaf(vertex) {
    return adjacencyMap.get(vertex).size === 1;
  }

  function getIncidentEdgesOf(vertex) {
    return (
      (adjacencyMap.has(vertex) && [...adjacencyMap.get(vertex).keys()]) || []
    );
  }

  function clear() {
    adjacencyMap.clear();
    incidenceMap.clear();
  }

  function getIncidentVerticesOf(edge) {
    return incidenceMap.has(edge) && incidenceMap.get(edge);
  }

  function mergeInto(vertexFrom, vertexTo) {
    const edgesToRemove = [];
    const reconnectedEdges = [];
    for (const [edge, neighbor] of adjacencyMap.get(vertexFrom).entries()) {
      if (isNeighbor(neighbor, vertexTo)) {
        edgesToRemove.push(edge);
      } else if (neighbor !== vertexTo) {
        reconnectEdge(edge, vertexFrom, vertexTo);
        reconnectedEdges.push(edge);
      }
    }

    edgesToRemove.map(removeEdge);
    removeVertex(vertexFrom);

    return reconnectedEdges;
  }

  function reconnectEdge(edge, oldVertex, newVertex) {
    const incidentVertices = incidenceMap.get(edge);
    const fixedVertex = incidentVertices.getOther(oldVertex);

    if (!isNeighbor(fixedVertex, newVertex)) {
      removeEdge(edge);
      addEdge(edge, fixedVertex, newVertex);

      return true;
    }

    return false;
  }

  function contains(object) {
    return adjacencyMap.has(object) || incidenceMap.has(object);
  }

  function containsEdge(object) {
    return incidenceMap.has(object);
  }

  function containsVertex(object) {
    return adjacencyMap.has(object);
  }

  function getEdgeConnecting(vertex, otherVertex) {
    const neighborMap = adjacencyMap.get(vertex);

    for (const [edge, neighbor] of neighborMap.entries()) {
      if (neighbor === otherVertex) return edge;
    }

    return null;
  }

  function getNeighborsOf(vertex) {
    return adjacencyMap.has(vertex)
      ? new Set(adjacencyMap.get(vertex).values())
      : new Set();
  }
}
