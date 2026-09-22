const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

const CLAUDE_MD_PATH = path.join(__dirname, 'CLAUDE.md');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

function createWindow() {
  const win = new BrowserWindow({
    width: 560,
    height: 640,
    resizable: false,
    title: 'Claude 메모리 & 파일 입력',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.setMenuBarVisibility(false);
  win.loadFile('index.html');
  return win;
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('load-claude-md', () => {
  try {
    return fs.readFileSync(CLAUDE_MD_PATH, 'utf-8');
  } catch {
    return '';
  }
});

ipcMain.handle('pick-files', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections'],
  });
  if (result.canceled) return [];
  return result.filePaths;
});

ipcMain.handle('save-all', (_event, { content, filePaths }) => {
  fs.writeFileSync(CLAUDE_MD_PATH, content, 'utf-8');

  const savedFiles = [];
  if (filePaths && filePaths.length > 0) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    for (const srcPath of filePaths) {
      const destPath = path.join(UPLOADS_DIR, path.basename(srcPath));
      fs.copyFileSync(srcPath, destPath);
      savedFiles.push(path.basename(srcPath));
    }
  }

  return { claudeMdPath: CLAUDE_MD_PATH, savedFiles };
});
