import Web3 from 'web3';

const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

const contractAddress = 'YOUR_CONTRACT_ADDRESS';
const contractABI = [ /* ABI */ ];
const contract = new web3.eth.Contract(contractABI, contractAddress);

async function loadWeb3() {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
    } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
}

async function login() {
    const accounts = await web3.eth.getAccounts();
    const sender = accounts[0];
    return contract.methods.login().send({ from: sender });
}

async function logout() {
    const accounts = await web3.eth.getAccounts();
    const sender = accounts[0];
    return contract.methods.logout().send({ from: sender });
}

async function registerUser(userAddress, userRole) {
    const accounts = await web3.eth.getAccounts();
    const sender = accounts[0];
    return contract.methods.registerUser(userAddress, userRole).send({ from: sender });
}

async function assignUserRole(userAddress, userRole) {
    const accounts = await web3.eth.getAccounts();
    const sender = accounts[0];
    return contract.methods.assignUserRole(userAddress, userRole).send({ from: sender });
}

async function getUserRole(userAddress) {
    return contract.methods.getUserRole(userAddress).call();
}

export { loadWeb3, login, logout, registerUser, assignUserRole, getUserRole };
