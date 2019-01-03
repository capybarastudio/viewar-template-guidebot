import test from 'tape';

import createGraph from './graph';
import { importGraphState, exportGraphState } from './graph-utils';

test('exportGraphState works properly', assert => {
  const graph = createGraph();

  const a = { $id: 'a' };
  const b = { $id: 'b' };
  const c = { $id: 'c' };
  const d = { $id: 'd' };
  const e = { $id: 'e' };
  const f = { $id: 'f' };
  const ab = { $id: 'ab' };
  const ad = { $id: 'ad' };
  const bf = { $id: 'bf' };
  const bc = { $id: 'bc' };
  const bd = { $id: 'bd' };
  const cd = { $id: 'cd' };
  const ce = { $id: 'ce' };
  const df = { $id: 'df' };
  const ef = { $id: 'ef' };

  graph.addEdge(ab, a, b);
  graph.addEdge(ad, a, d);
  graph.addEdge(bf, b, f);
  graph.addEdge(bc, b, c);
  graph.addEdge(bd, b, d);
  graph.addEdge(cd, c, d);
  graph.addEdge(ce, c, e);
  graph.addEdge(df, d, f);
  graph.addEdge(ef, e, f);

  const expected = JSON.parse(
    JSON.stringify({
      vertices: { a, b, c, d, e, f },
      edges: { ab, ad, bf, bc, bd, cd, ce, df, ef },
      adjacency: {
        a: {
          ab: 'b',
          ad: 'd',
        },
        b: {
          ab: 'a',
          bf: 'f',
          bc: 'c',
          bd: 'd',
        },
        c: {
          bc: 'b',
          cd: 'd',
          ce: 'e',
        },
        d: {
          ad: 'a',
          bd: 'b',
          cd: 'c',
          df: 'f',
        },
        e: {
          ce: 'c',
          ef: 'f',
        },
        f: {
          bf: 'b',
          df: 'd',
          ef: 'e',
        },
      },
    })
  );

  const actual = exportGraphState(graph);

  assert.deepEquals(actual, expected);
  assert.end();
});

test('importGraphState works properly', assert => {
  assert.plan(1);

  const a = { $id: 'a' };
  const b = { $id: 'b' };
  const c = { $id: 'c' };
  const d = { $id: 'd' };
  const e = { $id: 'e' };
  const f = { $id: 'f' };
  const ab = { $id: 'ab' };
  const ad = { $id: 'ad' };
  const bf = { $id: 'bf' };
  const bc = { $id: 'bc' };
  const bd = { $id: 'bd' };
  const cd = { $id: 'cd' };
  const ce = { $id: 'ce' };
  const df = { $id: 'df' };
  const ef = { $id: 'ef' };

  const graphState = JSON.parse(
    JSON.stringify({
      vertices: { a, b, c, d, e, f },
      edges: { ab, ad, bf, bc, bd, cd, ce, df, ef },
      adjacency: {
        a: {
          ab: 'b',
          ad: 'd',
        },
        b: {
          ab: 'a',
          bf: 'f',
          bc: 'c',
          bd: 'd',
        },
        c: {
          bc: 'b',
          cd: 'd',
          ce: 'e',
        },
        d: {
          ad: 'a',
          bd: 'b',
          cd: 'c',
          df: 'f',
        },
        e: {
          ce: 'c',
          ef: 'f',
        },
        f: {
          bf: 'b',
          df: 'd',
          ef: 'e',
        },
      },
    })
  );

  const graph = createGraph();

  importGraphState(graph, graphState);

  assert.deepEquals(exportGraphState(graph), graphState);
});
