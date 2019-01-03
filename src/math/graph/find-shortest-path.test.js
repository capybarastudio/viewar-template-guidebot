import test from 'tape';

import createGraph from './graph';
import findShortestPath from './find-shortest-path';

test('Graph is created', assert => {
  const graph = createGraph();

  const a = { id: 'a' };
  const b = { id: 'b' };
  const c = { id: 'c' };
  const d = { id: 'd' };
  const e = { id: 'e' };
  const f = { id: 'f' };
  const ab = { length: 7 };
  const ad = { length: 9 };
  const bf = { length: 14 };
  const bc = { length: 15 };
  const bd = { length: 10 };
  const cd = { length: 11 };
  const ce = { length: 6 };
  const df = { length: 2 };
  const ef = { length: 9 };

  graph.addEdge(ab, a, b);
  graph.addEdge(ad, a, d);
  graph.addEdge(bf, b, f);
  graph.addEdge(bc, b, c);
  graph.addEdge(bd, b, d);
  graph.addEdge(cd, c, d);
  graph.addEdge(ce, c, e);
  graph.addEdge(df, d, f);
  graph.addEdge(ef, e, f);

  const getDistanceBetween = (a, b) => graph.getEdgeConnecting(a, b).length;

  const path = findShortestPath(graph, getDistanceBetween, a, e);
  const expected = [a, d, f, e];

  assert.deepEquals(path, expected);
  assert.end();
});
