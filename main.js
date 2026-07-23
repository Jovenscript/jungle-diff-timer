const { app, BrowserWindow, globalShortcut, ipcMain, screen } = require('electron');
const https = require('https');
const path = require('path');

let win = null;
let travado = true;          // travado = não arrasta, clique atravessa pro jogo
let visivel = true;

/* ---------- API oficial da Riot (Live Client Data) ----------
   Roda só enquanto você está DENTRO de uma partida.
   Certificado é auto-assinado pela Riot, por isso rejectUnauthorized:false. */
function pegar(rota) {
  return new Promise((resolve) => {
    const req = https.get(
      { host: '127.0.0.1', port: 2999, path: rota, rejectUnauthorized: false, timeout: 1500 },
      (res) => {
        let buf = '';
        res.on('data', (d) => (buf += d));
        res.on('end', () => { try { resolve(JSON.parse(buf)); } catch { resolve(null); } });
      }
    );
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
  });
}

let emPartida = false;

async function pesquisarPartida() {
  const dados = await pegar('/liveclientdata/allgamedata');
  if (!win || win.isDestroyed()) return;

  if (dados && dados.gameData && typeof dados.gameData.gameTime === 'number') {
    if (!emPartida) { emPartida = true; if (visivel) win.showInactive(); }
    win.webContents.send('lol:dados', {
      tempo: dados.gameData.gameTime,
      modo: dados.gameData.gameMode,
      eventos: (dados.events && dados.events.Events) || []
    });
  } else if (emPartida) {
    emPartida = false;
    win.webContents.send('lol:fim');
  }
}

function criarJanela() {
  const { width } = screen.getPrimaryDisplay().workAreaSize;

  win = new BrowserWindow({
    width: 300,
    height: 340,
    x: width - 330,
    y: 90,
    frame: false,
    transparent: true,
    resizable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    focusable: false,
    hasShadow: false,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true }
  });

  // 'screen-saver' é o nível que fica acima do LoL em modo Sem Bordas
  win.setAlwaysOnTop(true, 'screen-saver');
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.loadFile(path.join(__dirname, 'app', 'index.html'));

  // Clique atravessa a janela; o renderer libera quando o mouse
  // está em cima de um campo clicável.
  win.setIgnoreMouseEvents(true, { forward: true });

  setInterval(pesquisarPartida, 2000);
}

/* ---------- Comunicação com a interface ---------- */
ipcMain.on('mouse:capturar', (_e, capturar) => {
  if (!win || travado === false) return;
  win.setIgnoreMouseEvents(!capturar, { forward: true });
});

ipcMain.on('janela:mover', (_e, { dx, dy }) => {
  if (!win || travado) return;
  const [x, y] = win.getPosition();
  win.setPosition(Math.round(x + dx), Math.round(y + dy));
});

app.whenReady().then(() => {
  criarJanela();

  // Ctrl+Shift+J → mostra/esconde
  globalShortcut.register('CommandOrControl+Shift+J', () => {
    visivel = !visivel;
    visivel ? win.showInactive() : win.hide();
  });

  // Ctrl+Shift+L → trava/destrava a posição
  globalShortcut.register('CommandOrControl+Shift+L', () => {
    travado = !travado;
    win.setIgnoreMouseEvents(travado, { forward: true });
    win.webContents.send('ui:travado', travado);
  });

  // Ctrl+Shift+R → zera os timers manualmente
  globalShortcut.register('CommandOrControl+Shift+R', () => {
    win.webContents.send('ui:zerar');
  });
});

app.on('window-all-closed', () => app.quit());
app.on('will-quit', () => globalShortcut.unregisterAll());
