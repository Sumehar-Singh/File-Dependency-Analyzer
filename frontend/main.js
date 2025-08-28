const { app, BrowserWindow } = require('electron');
const path = require('path');
const net = require('net');
const fs = require('fs');
const { spawn } = require('child_process');

const isDev = !app.isPackaged;
let backendProcess;

console.log('App starting...');
console.log('isDev:', isDev);
console.log('__dirname:', __dirname);

function waitForPort(port, callback, maxAttempts = 20) {
  let attempts = 0;

  function tryConnect() {
    const client = new net.Socket();

    client.once('error', () => {
      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(tryConnect, 500);
      } else {
        console.log('Backend not responding, continuing anyway...');
        callback();
      }
    });

    client.connect({ port }, () => {
      client.end();
      console.log('Backend is ready!');
      callback();
    });
  }

  tryConnect();
}

function startBackend() {
  try {
    let backendPath;

    if (isDev) {
      backendPath = path.join(__dirname, '..', 'backend', 'server.js');
    } else {
      backendPath = path.join(process.resourcesPath, 'backend', 'server.js');
    }

    console.log('Using backend path:', backendPath);

    if (backendPath && fs.existsSync(backendPath)) {
      if (isDev) {
        backendProcess = spawn('node', [backendPath], { stdio: 'inherit' });
      } else {
        backendProcess = spawn(process.execPath, [backendPath], {
          stdio: 'inherit',
          env: {
            ...process.env,
            ELECTRON_RUN_AS_NODE: '1',
            NODE_PATH: path.join(
              process.resourcesPath,
              'backend',
              'node_modules'
            ),
          },
        });
      }

      backendProcess.on('error', (err) => {
        console.error('Backend process error:', err);
      });

      backendProcess.on('exit', (code) => {
        console.log(`Backend process exited with code ${code}`);
      });

      console.log('Backend started successfully');
    } else {
      console.warn('Backend server.js not found at', backendPath);
    }
  } catch (error) {
    console.error('Failed to start backend:', error);
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    icon: path.join(__dirname, 'icon.ico'),
    title: 'FDA - by Sumehar Singh Grewal',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
  });

  win.once('ready-to-show', () => {
    win.show();
  });

  startBackend();

  if (isDev) {
    console.log('Development mode: loading from localhost:3000');
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools();
  } else {
    console.log('Production mode: loading built files');

    const indexPath = path.join(__dirname, 'build', 'index.html');
    console.log('Looking for build files at:', indexPath);
    console.log('Build files exist:', fs.existsSync(indexPath));

    waitForPort(5000, () => {
      if (fs.existsSync(indexPath)) {
        console.log('Loading index.html...');
        win
          .loadFile(indexPath)
          .then(() => console.log('Successfully loaded application'))
          .catch((err) => console.error('Error loading application:', err));
      } else {
        console.error('Build files not found!');
        win.loadURL(
          `data:text/html;charset=utf-8,${encodeURIComponent(
            '<h1>Application Error</h1><p>Build files not found.</p>'
          )}`
        );
      }
    });
  }
}

app.whenReady().then(() => {
  console.log('App is ready');
  createWindow();
});

app.on('window-all-closed', () => {
  console.log('All windows closed');
  if (backendProcess) {
    console.log('Killing backend process...');
    backendProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});
