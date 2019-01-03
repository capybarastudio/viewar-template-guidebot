import test from 'tape';

import createPair from './pair';

test('pair is created', assert => {
  const pair = createPair({}, {});

  assert.ok(typeof pair === 'object');
  assert.end();
});

test('pair must be created with two objects.', assert => {
  assert.throws(() => createPair(), 'both objects should be passed');
  assert.throws(() => createPair({}), 'both objects should be passed');
  assert.end();
});

test('passed objects must be distinct.', assert => {
  const a = {};
  assert.throws(() => createPair(a, a), 'elements must be distinct');
  assert.end();
});

test('values can be retrieved', assert => {
  const a = {};
  const b = {};

  const pair = createPair(a, b);

  assert.ok(pair.has(a), 'pair must contain a');
  assert.ok(pair.has(b), 'pair must contain b');
  assert.end();
});

test('pair can be iterated', assert => {
  const a = {};
  const b = {};

  const pair = createPair(a, b);

  let foundA = false;
  let foundB = false;
  for (const value of pair) {
    if (value === a) foundA = true;
    if (value === b) foundB = true;
  }

  assert.ok(foundA);
  assert.ok(foundB);
  assert.end();
});

test('given a pair member the other member is retrievable', assert => {
  const a = {};
  const b = {};

  const pair = createPair(a, b);
  const other = pair.getOther(a);

  assert.equals(
    other,
    b,
    'b should be retrieved as the other value in the pair'
  );
  assert.end();
});

test('elements can be replaced', assert => {
  const a = {};
  const b = {};
  const c = {};

  const pair = createPair(a, b);
  pair.replace(b, c);

  assert.notOk(pair.has(b));
  assert.ok(pair.has(c));
  assert.end();
});

test('element cannot be replaced by the other element in the pair', assert => {
  const a = {};
  const b = {};

  const pair = createPair(a, b);
  pair.replace(b, a);

  assert.ok(pair.has(a));
  assert.ok(pair.has(b));
  assert.end();
});

test('elements can be accessed by index for convenience', assert => {
  const a = {};
  const b = {};

  const pair = createPair(a, b);

  assert.equals(a, pair[0]);
  assert.equals(b, pair[1]);
  assert.end();
});
