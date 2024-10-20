const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (channel, data) => ipcRenderer.send(channel, data),
});

contextBridge.exposeInMainWorld('api', {
  navigate: (page) => ipcRenderer.send('navigate', page),
});

contextBridge.exposeInMainWorld('electronAPI', {
  login: (userAddress, privateKey) => ipcRenderer.invoke('login', userAddress, privateKey), 
  logout: () => ipcRenderer.invoke('logout'),
  registerUser: (userAddress, userRole) => ipcRenderer.invoke('registerUser', userAddress, userRole),
  assignUserRole: (userAddress, userRole) => ipcRenderer.invoke('assignUserRole', userAddress, userRole),
  getUserRole: (userAddress) => ipcRenderer.invoke('getUserRole', userAddress),
});
