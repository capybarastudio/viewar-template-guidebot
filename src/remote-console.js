/**
 * Responsible for sending console output to webpack-dev-server, so
 * you can remotely see your device's console output where you've
 * started npm run start:mock/npm run start.
 */

// Persist original console output functions.
const original = {
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error,
};

// Log to remote console + original console output.
const remoteConsole = (type, args) => {
  // Original console output.
  original[type](...args);

  // Send to remote console.
  const url = '/remote-console';
  const xhr = new XMLHttpRequest();
  xhr.open('POST', url);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(
    JSON.stringify({
      type,
      args,
    })
  );
};

// Hijack console output functions.
Object.assign(window.console, {
  log: (...args) => remoteConsole('log', args),
  info: (...args) => remoteConsole('info', args),
  warn: (...args) => remoteConsole('warn', args),
  error: (...args) => remoteConsole('error', args),
});
