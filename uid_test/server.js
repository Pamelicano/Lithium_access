require('dotenv').config();
const { Web3 } = require('web3');
const { SerialPort, ReadlineParser } = require('serialport');

const web3 = new Web3(process.env.RPC_URL);
const contractABI = require("C:/Users/never/OneDrive/Рабочий стол/new program files/artifacts/contracts/Lock.sol/AccessControlList.json").abi;
const contract = new web3.eth.Contract(contractABI, process.env.CONTRACT_ADDRESS);

const userAddresses = {
    "UID:52DF716C": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 
    "UID:6225576C": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8" 
};

const privateKeys = {
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266": process.env.OWNER_PRIVATE_KEY,
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8": process.env.ADMIN_PRIVATE_KEY
};

const port = new SerialPort({ path: 'COM5', baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

parser.on('data', async (uid) => {
    console.log(`Исходный UID: '${uid}'`);
    
    const formattedUID = uid.replace(/\s/g, '').toUpperCase(); 
    console.log(`Форматированный UID: '${formattedUID}'`);

    if (!userAddresses[formattedUID]) {
        console.log("❌ UID не найден в системе. Доступ запрещён.");
        return;
    }

    const userAddress = userAddresses[formattedUID];
    
    try {
        const role = await contract.methods.getUserRole(userAddress).call();

        if (role == 0 || role == 1 || role == 2) { 
            console.log(`✅ Доступ разрешён! Роль: ${role}`);
        } else {
            console.log(`❌ Доступ запрещён! Роль не найдена.`);
        }

    } catch (error) {
        console.error(`Ошибка при проверке роли в блокчейне: ${error.message}`);
    }
});

/// UID:52DF716C'
/// UID:6225576C