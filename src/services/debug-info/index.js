export function initDebugInfo() {
  window.debugInfo = {};
  window.debugLog = [];

  const infoContainer = document.getElementById('output-container');
  const logContainer = document.getElementById('log-container');

  window.updateDebugInfo = function() {
    if (config.debug.showDebugOutput) {
      infoContainer.style.display = 'block';
      logContainer.style.display = 'block';

      document.getElementById('output').innerHTML = JSON.stringify(
        debugInfo,
        null,
        '  '
      );
      document.getElementById('log').innerHTML = JSON.stringify(
        debugLog,
        null,
        '  '
      );

      logContainer.scrollTop = logContainer.scrollHeight;
    } else {
      infoContainer.style.display = 'none';
      logContainer.style.display = 'none';
    }
  };

  infoContainer.addEventListener('click', async () => {
    const body = new FormData();
    body.append('data', JSON.stringify(window.debugLog));

    try {
      await fetch(
        'https://dev2.viewar.com/api40/log/note:guidebot-log/type:Test/',
        {
          method: 'POST',
          body,
        }
      );
    } catch (error) {
      alert(error);
    }

    alert('OK!');
  });
}
