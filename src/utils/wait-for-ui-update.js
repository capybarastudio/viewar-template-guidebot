export default () =>
  new Promise(resolve => setTimeout(() => requestAnimationFrame(resolve), 0));
