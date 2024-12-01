document.addEventListener("DOMContentLoaded", () => {
    fetchAccounts();
});

async function fetchAccounts() {
    try {
        const response = await fetch('/api/accounts'); // Backend endpoint for accounts
        const accounts = await response.json();

        const accountsList = document.getElementById('accounts-list');
        accountsList.innerHTML = ""; // Clear any existing rows

        accounts.forEach(account => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${account.username}</td>
                <td>${account.status}</td>
                <td>${account.farming ? 'Yes' : 'No'}</td>
                <td>${account.guardCode || 'N/A'}</td>
                <td>
                    <button onclick="startFarming('${account.id}')">Start Farming</button>
                    <button onclick="stopFarming('${account.id}')">Stop Farming</button>
                    <button onclick="viewTrades('${account.id}')">View Trades</button>
                </td>
            `;
            accountsList.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching accounts:", error);
    }
}

async function startFarming(accountId) {
    try {
        await fetch(`/api/start-farming/${accountId}`, { method: 'POST' });
        alert(`Started farming for account ${accountId}`);
        fetchAccounts();
    } catch (error) {
        console.error(`Error starting farming for account ${accountId}:`, error);
    }
}

async function stopFarming(accountId) {
    try {
        await fetch(`/api/stop-farming/${accountId}`, { method: 'POST' });
        alert(`Stopped farming for account ${accountId}`);
        fetchAccounts();
    } catch (error) {
        console.error(`Error stopping farming for account ${accountId}:`, error);
    }
}

async function viewTrades(accountId) {
    alert(`View trades for account ${accountId}`); // Will get replaced with actual logic later
}