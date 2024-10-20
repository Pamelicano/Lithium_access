import Web3 from "web3";

let web3;
let contract;

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const contractABI = require("C:/Users/never/OneDrive/Рабочий стол/new program files/artifacts/contracts/Lock.sol/AccessControlList.json").abi;

export async function loadWeb3() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({method: 'eth_requestAccounts'});
            console.log('Web3 connected');
        } catch(error) {
            console.error('Can not connect to Metamask:', error);
        }
    } else {
        alert('Donwload Metamask to work with the application.');
    }
    contract = new Web3.eth.Contract(contractABI, contractAddress);
}

export async function registerUser(userAddress, userRole) {
    try {
        const accounts  = await web3.eth.getAccounts();
        const role = parseInt(userRole);
        const receipt = await contract.methods.registerUser(userAddress, role).send({
            from: accounts[0]
        });
        console.log('Transaction made: ', receipt.transactionHash);
        return receipt;
    } catch(error) {
        console.error('Error in registration:', error);
        throw error;
    }    
}

export async function login() {
    try {
        const accounts = await web3.eth.getAccounts();
        const receipt = await contract.methods.login().send({from: accounts[0]});
        console.log('Login success', receipt.transactionHash);
        return receipt;
    } catch(error) {
        console.error('Error in login', error);
        throw error;
    }
}

export async function logout() {
    try {
      const accounts = await web3.eth.getAccounts();
      const receipt = await contract.methods.logout().send({ from: accounts[0] });
  
      console.log('LogOut success:', receipt.transactionHash);
      return receipt;
    } catch (error) {
      console.error('Error in logout:', error);
      throw error;
    }
}

export async function getUserRole(userAddress) {
    try {
        const role = await contract.methods.getUserRole(userAddress).call();
        console.log('User Role ${userAddress} : ${role}');
        return role;
    } catch (error) {
        console.error('Error in getting user role:', error);
        throw error;
    }
}

// async function login() {
//     const accounts = await web3.eth.getAccounts();
//     const sender = accounts[0];
//     return contract.methods.login().send({ from: sender });
// }

// async function logout() {
//     const accounts = await web3.eth.getAccounts();
//     const sender = accounts[0];
//     return contract.methods.logout().send({ from: sender });
// }

// async function registerUser(userAddress, userRole) {
//     const accounts = await web3.eth.getAccounts();
//     const sender = accounts[0];
//     return contract.methods.registerUser(userAddress, userRole).send({ from: sender });
// }

// async function assignUserRole(userAddress, userRole) {
//     const accounts = await web3.eth.getAccounts();
//     const sender = accounts[0];
//     return contract.methods.assignUserRole(userAddress, userRole).send({ from: sender });
// }

// async function getUserRole(userAddress) {
//     return contract.methods.getUserRole(userAddress).call();
// }

// export { loadWeb3, login, logout, registerUser, assignUserRole, getUserRole };
