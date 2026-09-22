const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  loadClaudeMd: () => ipcRenderer.invoke('load-claude-md'),
  pickFiles: () => ipcRenderer.invoke('pick-files'),
  saveAll: (content, filePaths) => ipcRenderer.invoke('save-all', { content, filePaths }),
});
