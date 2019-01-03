export default function createEmitter() {
  const handlers = {};

  const on = (eventName, handler) =>
    (handlers[eventName] = handlers[eventName] || new Set()).add(handler);

  const off = (eventName, handler) =>
    handler ? handlers[eventName].delete(handler) : handlers[eventName].clear();

  const once = (eventName, handler) => {
    const newHandler = (...args) => {
      handler(...args);
      off(eventName, newHandler);
    };
    on(eventName, newHandler);
  };

  const emit = (eventName, ...args) =>
    (handlers[eventName] || []).forEach(handler => handler(...args));

  return {
    on,
    off,
    once,
    emit,
  };
}
