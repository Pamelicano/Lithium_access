const Web3 = require('web3');

const web3 = new Web3('https://blockchain-node-url');

const contractAddress = 'YOUR_CONTRACT_ADDRESS';
const contractABI = [/* YOUR_CONTRACT_ABI */];

const contract = new web3.eth.Contract(contractABI, contractAddress);

async function loadUsers() {
  try {
    const users = await contract.methods.getUsers().call();

    const tableBody = document.getElementById('usersTable').getElementsByTagName('tbody')[0];

    tableBody.innerHTML = '';

    users.forEach(user => {
      const row = tableBody.insertRow();
      const cellId = row.insertCell(0);
      const cellName = row.insertCell(1);
      const cellRole = row.insertCell(2);
      cellId.textContent = user.id;
      cellName.textContent = user.name;
      cellRole.textContent = user.role;
    });
  } catch (error) {
    console.error('Error loading users:', error);
  }
}


window.onload = loadUsers;
