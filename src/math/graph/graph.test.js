import test from 'tape';

import createGraph from './graph';

test('Graph is created', assert => {
  const graph = createGraph();

  assert.ok(
    typeof graph === 'object',
    'createGraph factory should return an object.'
  );
  assert.end();
});

test('Graph has vertices', assert => {
  const graph = createGraph();

  assert.ok(typeof graph.vertices === 'object');
  assert.end();
});

test('Graph has edges', assert => {
  const graph = createGraph();

  assert.ok(typeof graph.edges === 'object');
  assert.end();
});

test('Can add vertex to graph', assert => {
  const graph = createGraph();

  const a = {};

  graph.addVertex(a);

  assert.ok(graph.vertices.includes(a));
  assert.ok(graph.contains(a));
  assert.end();
});

test('Can add edge to graph', assert => {
  const graph = createGraph();

  const a = {};
  const b = {};
  const ab = {};

  graph.addEdge(ab, a, b);

  assert.ok(graph.edges.includes(ab), 'should contain edge ab');
  assert.ok(graph.contains(ab), 'should contain edge ab');
  assert.end();
});

test('Adding an edge adds two vertices', assert => {
  const graph = createGraph();

  const a = {};
  const b = {};
  const ab = {};

  const expected = graph.vertices.length + 2;

  graph.addEdge(ab, a, b);

  const actual = graph.vertices.length;
  assert.equals(expected, actual);
  assert.end();
});

test('Adding an edge connects two vertices', assert => {
  const graph = createGraph();

  const a = {};
  const b = {};
  const ab = {};

  graph.addEdge(ab, a, b);

  assert.ok(graph.isNeighbor(a, b));
  assert.end();
});

test('Adding a single vertex creates no new edges.', assert => {
  const graph = createGraph();

  const a = {};
  const b = {};
  const c = {};
  const ab = {};

  graph.addEdge(ab, a, b);

  const before = graph.edges.length;

  graph.addVertex(c);

  const after = graph.edges.length;

  assert.equals(before, after);
  assert.end();
});

test('Attempting to add existing vertex adds no new vertices', assert => {
  const graph = createGraph();

  const a = {};

  graph.addVertex(a);

  const before = graph.vertices.length;

  graph.addVertex(a);

  const after = graph.vertices.length;

  assert.equals(before, after);
  assert.end();
});

test('Connecting new edge to existing vertex adds only one vertex', assert => {
  const graph = createGraph();

  const a = {};
  const b = {};
  const ab = {};

  graph.addVertex(a);

  const before = graph.vertices.length;

  graph.addEdge(ab, a, b);

  const after = graph.vertices.length;

  assert.equals(after, before + 1);
  assert.end();
});

test('Attempting to get degree of a non-vertex should return false', assert => {
  const graph = createGraph();

  const a = {};
  const b = {};
  const ab = {};

  graph.addEdge(ab, a, b);

  const expected = false;
  const actual = graph.getDegreeOf(ab);

  assert.equals(expected, actual);
  assert.end();
});

test('Connecting edge to vertex increases its degree by one', assert => {
  const graph = createGraph();

  const a = {};
  const b = {};
  const ab = {};

  graph.addVertex(a);

  const before = graph.getDegreeOf(a);

  graph.addEdge(ab, a, b);

  const after = graph.getDegreeOf(a);

  assert.equals(after, before + 1);
  assert.end();
});

test("Removing an edge reduces the incident vertices' degree by one", assert => {
  const graph = createGraph();

  const a = {};
  const b = {};
  const ab = {};

  graph.addEdge(ab, a, b);

  const before = graph.getDegreeOf(a);

  graph.removeEdge(ab);

  const after = graph.getDegreeOf(a);

  assert.equals(after, before - 1);
  assert.end();
});

test('Removing a vertex removes all incident edges', assert => {
  const graph = createGraph();

  const a = {};
  const b = {};
  const c = {};
  const ab = {};
  const ac = {};

  graph.addEdge(ab, a, b);
  graph.addEdge(ac, a, c);

  const before = graph.edges.length;

  graph.removeVertex(a);

  const after = graph.edges.length;

  assert.equals(after, before - 2);
  assert.end();
});

test('Removing a vertex reduces degrees of neighboring vertices by one', assert => {
  const graph = createGraph();

  const a = {};
  const b = {};
  const ab = {};

  graph.addEdge(ab, a, b);

  const before = graph.getDegreeOf(b);

  graph.removeVertex(a);

  const after = graph.getDegreeOf(b);

  assert.equals(after, before - 1);
  assert.end();
});

test('Vertex of degree one is a leaf', assert => {
  const graph = createGraph();

  const a = {};
  const b = {};
  const c = {};
  const d = {};
  const ab = {};
  const ac = {};

  graph.addEdge(ab, a, b);
  graph.addEdge(ac, a, c);
  graph.addVertex(d);

  assert.notOk(graph.isLeaf(a));
  assert.ok(graph.isLeaf(b));
  assert.ok(graph.isLeaf(c));
  assert.notOk(graph.isLeaf(d));
  assert.end();
});

test('Merging one vertex into another removes the first but keeps the other vertex', assert => {
  const graph = createGraph();

  const a = {};
  const b = {};

  graph.addVertex(a);
  graph.addVertex(b);

  graph.mergeInto(a, b);

  assert.ok(graph.contains(b));
  assert.notOk(graph.contains(a));
  assert.end();
});

test("Vertex being merged into takes over all of the other vertex' edges", assert => {
  const graph = createGraph();

  const a = {};
  const b = {};
  const c = {};
  const d = {};
  const ab = {};
  const ac = {};
  const bc = {};
  const cd = {};

  graph.addEdge(ab, a, b);
  graph.addEdge(ac, a, c);
  graph.addEdge(bc, b, c);
  graph.addEdge(cd, c, d);

  graph.mergeInto(c, d);

  assert.ok(graph.isNeighbor(a, d), 'a and d should be connected');
  assert.ok(graph.isNeighbor(b, d), 'b and d should be connected');
  assert.end();
});

test("Incident edges of the vertex being merged into overrides all of the other vertex' edges", assert => {
  const graph = createGraph();

  const a = {};
  const b = {};
  const c = {};
  const ab = {};
  const ac = {};

  graph.addEdge(ab, a, b);
  graph.addEdge(ac, a, c);

  graph.mergeInto(b, c);

  assert.ok(graph.contains(ac), 'should contain ac');
  assert.notOk(graph.contains(ab), 'should not contain ab');
  assert.end();
});

test('Attempting to remove non-existing vertex does not change the graph state.', assert => {
  const graph = createGraph();

  const a = {};
  const b = {};
  const c = {};

  graph.addVertex(a);
  graph.addVertex(b);

  assert.doesNotThrow(() => graph.removeVertex(c), 'removing should not fail');
  assert.notOk(graph.contains(c), 'graph should not contain c');
  assert.ok(graph.contains(a), 'graph should contain a');
  assert.ok(graph.contains(b), 'graph should contain b');
  assert.end();
});

test('Attempting to remove non-existing edge does not change the graph state.', assert => {
  const graph = createGraph();

  const a = {};
  const b = {};
  const c = {};
  const ab = {};
  const ac = {};
  const bc = {};

  graph.addEdge(ab, a, b);
  graph.addEdge(ac, a, c);

  assert.doesNotThrow(() => graph.removeEdge(bc), 'removing should not fail');
  assert.notOk(graph.contains(bc), 'graph should not contain ad');
  assert.ok(graph.contains(ab), 'graph should contain ab');
  assert.ok(graph.contains(ac), 'graph should contain ac');
  assert.end();
});

test('Attempting to reconnect an edge so that it creates multiple edges does not change the graph state.', assert => {
  const graph = createGraph();

  const a = {};
  const b = {};
  const c = {};
  const ab = {};
  const ac = {};

  graph.addEdge(ab, a, b);
  graph.addEdge(ac, a, c);

  graph.reconnectEdge(ac, c, b);

  const incidentVertices = graph.getIncidentVerticesOf(ac);

  assert.ok(incidentVertices.has(a), 'ac edge should remain attached to a');
  assert.ok(incidentVertices.has(c), 'ac edge should remain attached to c');
  assert.end();
});

test('Graph does not allow multiple edges between the same two vertices', assert => {
  const graph = createGraph();

  const a = {};
  const b = {};
  const ab = {};
  const ab2 = {};

  graph.addEdge(ab, a, b);
  graph.addEdge(ab2, a, b);

  assert.ok(graph.contains(ab));
  assert.notOk(graph.contains(ab2));
  assert.end();
});

test('Graph: clearing deletes all edges and vertices', assert => {
  const graph = createGraph();

  const a = {};
  const b = {};
  const ab = {};
  const ab2 = {};

  graph.addEdge(ab, a, b);
  graph.addEdge(ab2, a, b);

  graph.clear();

  assert.equal(graph.edges.length, 0);
  assert.equal(graph.vertices.length, 0);
  assert.end();
});

test('Graph: can retrieve an edge connecting two vertices', assert => {
  const graph = createGraph();

  const a = {};
  const b = {};
  const ab = {};

  graph.addEdge(ab, a, b);

  const expected = ab;
  const actual = graph.getEdgeConnecting(a, b);

  assert.equals(actual, expected);
  assert.end();
});
