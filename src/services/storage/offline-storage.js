export default function createOfflineStorage({
  storage: { local, cloud },
  navigator,
}) {
  return {
    write,
    read,
    remove,
  };

  async function write(...args) {
    if (navigator.onLine) {
      const result = await cloud.write(...args);
      await local.write(...args);
      return result;
    } else {
      // Don't save changes if offline to avoid online/offline mismatches
      return true;
    }
  }

  async function read(...args) {
    if (navigator.onLine) {
      const content = await cloud.read(...args);
      if (content) {
        await local.write(args[0], content);
      }
      return content;
    } else {
      return await local.read(...args);
    }
  }

  async function remove(...args) {
    if (navigator.onLine) {
      await cloud.remove(...args);
    } else {
      // Don't remove files if offline to avoid online/offline mismatches
      return true;
    }
  }
}
