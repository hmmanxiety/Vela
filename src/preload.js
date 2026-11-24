const { contextBridge, ipcRenderer } = require('electron');
const { pathToFileURL } = require('url');

function convertPathToFileURL(filePath) {
  if (!filePath) return '';
  if (filePath.startsWith('file://')) return filePath;
  try {
    return pathToFileURL(filePath).href;
  } catch (e) {
    const normalized = filePath.replace(/\\/g, '/');
    const parts = normalized.split('/').map(part => {
      if (/^[a-zA-Z]:$/.test(part)) return part;
      return encodeURIComponent(part);
    });
    return 'file:///' + (parts[0] === '' ? parts.slice(1) : parts).join('/');
  }
}

contextBridge.exposeInMainWorld('velaAPI', {
  // Window controls
  minimize: () => ipcRenderer.invoke('window:minimize'),
  maximize: () => ipcRenderer.invoke('window:maximize'),
  close: () => ipcRenderer.invoke('window:close'),
  isMaximized: () => ipcRenderer.invoke('window:is-maximized'),

  // Media & Dialogs
  getInitialFile: () => ipcRenderer.invoke('app:get-initial-file'),
  onOpenFile: (callback) => ipcRenderer.on('app:open-file', (event, filePath) => callback(filePath)),
  pathToFileURL: (filePath) => convertPathToFileURL(filePath),
  openFiles: () => ipcRenderer.invoke('dialog:open-files'),
  selectSavePath: (defaultName) => ipcRenderer.invoke('dialog:select-save-path', defaultName),
  trimVideo: (params) => ipcRenderer.invoke('media:trim-video', params),
  getFileDetails: (filePath) => ipcRenderer.invoke('media:get-file-details', filePath),
  loadStore: () => ipcRenderer.invoke('store:load'),
  saveStore: (data) => ipcRenderer.invoke('store:save', data),
  showInFolder: (filePath) => ipcRenderer.invoke('system:show-in-folder', filePath),
  getSiblingVideos: (filePath) => ipcRenderer.invoke('folder:get-sibling-videos', filePath),
  fetchLyrics: (params) => ipcRenderer.invoke('media:fetch-lyrics', params)
});
