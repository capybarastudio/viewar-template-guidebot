import test from 'tape';

import createOfflineStorage from './offline-storage';

const asyncNoop = async () => {};

test('Offline storage provides methods to read and write to storage', assert => {
  const offlineStorage = createOfflineStorage({ storage: {} });

  assert.equals(typeof offlineStorage.read, 'function');
  assert.equals(typeof offlineStorage.write, 'function');

  assert.end();
});

test('Offline storage uses local read function if offline', async assert => {
  const storage = {
    local: {
      read: async () => assert.pass(),
      write: asyncNoop,
    },
    cloud: {
      read: asyncNoop,
      write: asyncNoop,
    },
  };

  const offlineStorage = createOfflineStorage({
    storage,
    navigator: { onLine: false },
  });

  assert.plan(1);
  await offlineStorage.read();
});

test('Offline storage uses cloud read function if online', async assert => {
  const storage = {
    local: {
      read: asyncNoop,
      write: asyncNoop,
    },
    cloud: {
      read: async () => assert.pass(),
      write: asyncNoop,
    },
  };

  const offlineStorage = createOfflineStorage({
    storage,
    navigator: { onLine: true },
  });

  assert.plan(1);
  await offlineStorage.read();
});

test("Offline storage don't write changes if offline", async assert => {
  const storage = {
    local: {
      read: asyncNoop,
      write: async () => assert.fail(),
    },
    cloud: {
      read: asyncNoop,
      write: asyncNoop,
    },
  };

  const offlineStorage = createOfflineStorage({
    storage,
    navigator: { onLine: false },
  });

  await offlineStorage.write();
  assert.end();
});

test('Offline storage uses cloud write function if online', async assert => {
  const storage = {
    local: {
      read: asyncNoop,
      write: asyncNoop,
    },
    cloud: {
      read: asyncNoop,
      write: async () => assert.pass(),
    },
  };

  const offlineStorage = createOfflineStorage({
    storage,
    navigator: { onLine: true },
  });

  assert.plan(1);
  await offlineStorage.write();
});

test('Offline storage passes arguments to local read function', assert => {
  const args = [1, { b: 2 }];
  const storage = {
    local: {
      read: (...passedArgs) => assert.deepEquals(args, passedArgs),
      write: asyncNoop,
    },
    cloud: {
      read: async () => assert.fail(),
      write: asyncNoop,
    },
  };

  const offlineStorage = createOfflineStorage({
    storage,
    navigator: { onLine: false },
  });

  assert.plan(1);
  offlineStorage.read(...args);
});

test('Offline storage passes arguments to cloud read function', async assert => {
  const args = [1, { b: 2 }];
  const storage = {
    cloud: {
      read: (...passedArgs) => assert.deepEquals(args, passedArgs),
      write: asyncNoop,
    },
    local: {
      read: asyncNoop,
      write: asyncNoop,
    },
  };

  const offlineStorage = createOfflineStorage({
    storage,
    navigator: { onLine: true },
  });

  assert.plan(1);
  await offlineStorage.read(...args);
});

test('Offline storage passes arguments to cloud write function', async assert => {
  const args = [1, { b: 2 }];
  const storage = {
    cloud: {
      read: asyncNoop,
      write: async (...passedArgs) => assert.deepEquals(args, passedArgs),
    },
    local: {
      read: asyncNoop,
      write: asyncNoop,
    },
  };

  const offlineStorage = createOfflineStorage({
    storage,
    navigator: { onLine: true },
  });

  assert.plan(1);
  await offlineStorage.write(...args);
});

test('Offline storage creates a local backup of every read cloud file', async assert => {
  const fileName = 'filename';
  const fileContent = 'sample content';
  const storage = {
    cloud: {
      read: async () => fileContent,
      write: asyncNoop,
    },
    local: {
      read: asyncNoop,
      write: async (newFileName, newFileContent) => {
        assert.equals(newFileContent, fileContent);
        assert.equals(newFileName, fileName);
      },
    },
  };

  const offlineStorage = createOfflineStorage({
    storage,
    navigator: { onLine: true },
  });

  assert.plan(2);
  await offlineStorage.read(fileName, fileContent);
});

test('Offline storage creates a local backup of every written cloud file', async assert => {
  const fileName = 'filename';
  const fileContent = 'sample content';
  const storage = {
    cloud: {
      read: asyncNoop,
      write: async () => assert.pass(),
    },
    local: {
      read: asyncNoop,
      write: async (newFileName, newFileContent) => {
        assert.equals(newFileContent, fileContent);
        assert.equals(newFileName, fileName);
      },
    },
  };

  const offlineStorage = createOfflineStorage({
    storage,
    navigator: { onLine: true },
  });

  assert.plan(3);
  await offlineStorage.write(fileName, fileContent);
});

test('Offline storage only creates a local backup of every read cloud file if the file has any content', async assert => {
  const fileName = 'filename';
  const fileContent = null;
  const storage = {
    cloud: {
      read: async () => fileContent,
      write: asyncNoop,
    },
    local: {
      read: asyncNoop,
      write: async () => assert.fail(),
    },
  };

  const offlineStorage = createOfflineStorage({
    storage,
    navigator: { onLine: true },
  });

  await offlineStorage.read(fileName, fileContent);
  assert.end();
});

test('Offline storage uses cloud remove function if online', async assert => {
  const storage = {
    local: {
      read: asyncNoop,
      write: asyncNoop,
      remove: asyncNoop,
    },
    cloud: {
      read: asyncNoop,
      write: asyncNoop,
      remove: async () => assert.pass(),
    },
  };

  const offlineStorage = createOfflineStorage({
    storage,
    navigator: { onLine: true },
  });

  assert.plan(1);
  await offlineStorage.remove();
});

test("Offline storage don't remove files if offline", async assert => {
  const storage = {
    local: {
      read: asyncNoop,
      write: asyncNoop,
      remove: async () => assert.fail(),
    },
    cloud: {
      read: asyncNoop,
      write: asyncNoop,
      remove: async () => assert.fail(),
    },
  };

  const offlineStorage = createOfflineStorage({
    storage,
    navigator: { onLine: false },
  });

  await offlineStorage.remove();
  assert.end();
});

test('Offline storage passes arguments to cloud remove function', async assert => {
  const args = [1, { b: 2 }];
  const storage = {
    cloud: {
      remove: (...passedArgs) => assert.deepEquals(args, passedArgs),
      write: asyncNoop,
    },
    local: {
      remove: asyncNoop,
      read: asyncNoop,
      write: asyncNoop,
    },
  };

  const offlineStorage = createOfflineStorage({
    storage,
    navigator: { onLine: true },
  });

  assert.plan(1);
  await offlineStorage.remove(...args);
});
