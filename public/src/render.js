window.electronAPI.onLog((event, message) => {
    const logDiv = document.getElementById('log');
    const newLog = document.createElement('div');
    newLog.textContent = message;
    logDiv.appendChild(newLog);
    logDiv.scrollTop = logDiv.scrollHeight; 
  });
  