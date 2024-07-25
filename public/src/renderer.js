document.addEventListener('DOMContentLoaded', () => {
    const terminal = document.getElementById('terminal');

    async function appendLog(message) {
        const logEntry = document.createElement('div');
        logEntry.textContent = message;
        terminal.appendChild(logEntry);
    }

    document.getElementById('connectButton').addEventListener('click', async () => {
        try {
            const result = await window.electronAPI.login();
            appendLog(`Login result: ${JSON.stringify(result)}`);
        } catch (error) {
            appendLog(`Error: ${error.message}`);
        }
    });
    document.getElementById('AssignUserRole').addEventListener('click', async () => {
        try {
            const result = await window.electronAPI.assignUserRole();
            appendLog(`Assigned User Role Result: ${JSON.stringify(result)}`);
        } catch (error) {
            appendLog(`Error: ${error.message}`);
        }
    });
    document.getElementById('getUserRole').addEventListener('click', async () => {
        try {
            const result = await window.electronAPI.getUserRole();
            appendLog(`User Role Result: ${JSON.stringify(result)}`);
        } catch (error) {
            appendLog(`Error: ${error.message}`);
        }
    });
    document.getElementById('registerUser').addEventListener('click', async () => {
        try {
            const result = await window.electronAPI.registerUser();
            appendLog(`User Role Result: ${JSON.stringify(result)}`);
        } catch (error) {
            appendLog(`Error: ${error.message}`);
        }
    });


});
