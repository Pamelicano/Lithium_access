const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
// const {Web3} = require('web3');

// const localhost = '';
// const contractAddress = '';
// const contractABI = require("").abi;

let mainWindow;
let loginWindow;

if (require('electron-squirrel-startup')) {
  app.quit();
}

function createLoginWindow() {
  loginWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      enableRemoteModule: false,
    },
  });

  loginWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  createLoginWindow();
  // connectToLocalHost(); 
});


const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      enableRemoteModule: false 
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
};

// async function connectToLocalHost() {
//   try {
//     const web3 = new Web3(localhost);
//     const contract = new web3.eth.Contract(contractABI, contractAddress);
//     if (typeof contract.methods.getUserRole === "function") {
//       const userAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
//       const userRole = await contract.methods.getUserRole(userAddress).call();
//       console.log('User Role is: ', userRole);
//     } else {
//       console.error('getUserRole is not a function');
//     }
//   } catch (error) {
//     console.error('Error connecting to local host:', error);
//   }
// }
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createLoginWindow();
  }
});

ipcMain.on('login-success', () => {
  console.log('Login success event received');
  if (loginWindow) {
    loginWindow.close();
  }
  createWindow();
});


ipcMain.on('navigate', (event, page) => {
  if (mainWindow) {
    mainWindow.loadFile(page);
  }
});


ipcMain.handle('login', async () => {
  const result = await login();
  return result;
});

ipcMain.handle('logout', async () => {
  const result = await logout();
  return result;
});

ipcMain.handle('registerUser', async (event, userAddress, userRole) => {
  const result = await registerUser(userAddress, userRole);
  return result;
});

ipcMain.handle('assignUserRole', async (event, userAddress, userRole) => {
  const result = await assignUserRole(userAddress, userRole);
  return result;
});

ipcMain.handle('getUserRole', async (event, userAddress) => {
  const result = await getUserRole(userAddress);
  return result;
});