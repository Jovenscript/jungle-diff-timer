const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('lol', {
  aoReceberDados: (fn) => ipcRenderer.on('lol:dados', (_e, d) => fn(d)),
  aoTerminar: (fn) => ipcRenderer.on('lol:fim', () => fn()),
  aoTravar: (fn) => ipcRenderer.on('ui:travado', (_e, v) => fn(v)),
  aoZerar: (fn) => ipcRenderer.on('ui:zerar', () => fn()),
  capturarMouse: (v) => ipcRenderer.send('mouse:capturar', v),
  mover: (dx, dy) => ipcRenderer.send('janela:mover', { dx, dy })
});
