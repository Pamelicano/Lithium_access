const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const i18next = require("i18next");
const Backend = require("i18next-fs-backend");
const {Web3} = require('web3');

const localhost = 'http://127.0.0.1:8545';
const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const contractABI = require("C:/Users/never/OneDrive/Рабочий стол/new program files/artifacts/contracts/Lock.sol/AccessControlList.json").abi;

let mainWindow, loginWindow, splashWindow;


if (require('electron-squirrel-startup')) {
  app.quit();
}
//0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
function createLoginWindow() {
  loginWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  loginWindow.loadFile('login.html');
}

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 600,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });
  splashWindow.loadFile('splash.html');
}


async function checkLocalHostConnection() {
  try {
    const web3 = new Web3(localhost);
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    await contract.methods.getUserRole('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266').call();
    return true;
  } catch (error) {
    console.error('Unable to connect to localhost:', error);
    return false;
  }
}


app.whenReady().then(async () => {
  createSplashWindow();

  const isConnected = await checkLocalHostConnection();

  if (isConnected) {
    splashWindow.close();
    createLoginWindow(); 
  } else {
    splashWindow.webContents.loadURL('splash.html'); 
  }

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

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createSplashWindow();
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


ipcMain.handle('login', async (event, userAddress, privateKey) => {
  console.log('Login attempt with:', { userAddress, privateKey });

  try {
    const isValid = await validateUser(userAddress, privateKey);
    return isValid;
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Login failed');
  }
});

ipcMain.handle('logout', async (event, userAddress, privateKey) => {
  console.log('Logout attempt with:', {userAddress, privateKey});
  try {
    const isValid = await validateUser(userAddress, privateKey);
    return isValid;
  } catch(error) {
    console.error('Logout error: ', error);
    throw new Error('Logout failed');
  }
});


ipcMain.handle('getUserRole', async (event, userAddress) => {
  console.log('GetUserRole attempt with:', { userAddress });

  try {
    const web3 = new Web3('http://127.0.0.1:8545');
    console.log('Web3 initialized:', web3);

    const contractData = require(contractABIPath);
    if (!contractData || !contractData.abi) {
      console.error('ABI not found in contract data');
      throw new Error('Contract ABI is missing');
    }

    const contract = new web3.eth.Contract(contractData.abi, contractAddress);
    console.log('Contract initialized:', contract);

    const userRole = await contract.methods.getUserRole(userAddress).call();
    console.log('User role retrieved:', userRole);

    const userRoleNumber = Number(userRole);
    console.log('User role as number:', userRoleNumber);

    return userRoleNumber;
  } catch (error) {
    console.error('Error retrieving user role:', error);
    throw new Error('Failed to retrieve user role');
  }
});

ipcMain.handle('registerUser', async (event, userAddress, privateKey) => {
  console.log('RegisterUser attempt with:', { userAddress, privateKey });

  try {
    const web3 = new Web3('http://127.0.0.1:8545');
    console.log('Web3 initialized:', web3);

    const contractData = require(contractABIPath);
    if (!contractData || !contractData.abi) {
      console.error('ABI not found in contract data');
      throw new Error('Contract ABI is missing');
    }

    const contract = new web3.eth.Contract(contractData.abi, contractAddress);
    console.log('Contract initialized:', contract);

    const tx = await contract.methods
      .registerUser(userAddress) 
      .send({ from: userAddress, gas: 3000000 });

    console.log('User registered:', tx);
    return 'User registered successfully';
  } catch (error) {
    console.error('Error registering user:', error);
    throw new Error('Failed to register user');
  }
});

async function validateUser(userAddress, privateKey) {
  return userAddress && privateKey; 
}

i18next
  .use(Backend)
  .init({
    lng: "en", 
    fallbackLng: "en",
    backend: {
      loadPath: path.join(__dirname, "locales", "{{lng}}.json"),
    },
  });

ipcMain.handle("getTranslation", async (_, key) => {
  return i18next.t(key);
});

ipcMain.handle("setLanguage", async (_, lang) => {
  await i18next.changeLanguage(lang);
});