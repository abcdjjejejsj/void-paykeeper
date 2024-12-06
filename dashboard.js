document.addEventListener('DOMContentLoaded', function () {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        alert('You are not signed in. Redirecting to sign-in page.');
        window.location.href = 'signin.html';
        return;
    }

    const userTransactionsKey = `transactions_${user.email}`;

    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-email').textContent = user.email;
    document.getElementById('user-mobile').textContent = user.mobile;
    document.getElementById('user-type').textContent = user.userType;
    document.getElementById('user-shop-name').textContent = user.userType === 'shopkeeper' ? user.shopName : 'N/A';

    document.getElementById('add-transaction').addEventListener('click', function () {
        const personName = document.getElementById('person-name').value.trim();
        const transactionType = document.getElementById('transaction-type').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const transactionDate = document.getElementById('transaction-date').value;

        if (!personName || isNaN(amount) || amount <= 0 || !transactionDate) {
            showPopupMessage('Please fill in all fields correctly. Amount must be a positive number.', 'error');
            return;
        }

        const transaction = { personName, transactionType, amount, transactionDate };
        const transactions = JSON.parse(localStorage.getItem(userTransactionsKey)) || [];
        transactions.push(transaction);
        localStorage.setItem(userTransactionsKey, JSON.stringify(transactions));

        displayTransactions();
        showPopupMessage('Transaction added successfully!', 'success');

        // Clear the form fields
        document.getElementById('person-name').value = '';
        document.getElementById('transaction-type').value = 'give'; // Reset to default value
        document.getElementById('amount').value = '';
        document.getElementById('transaction-date').value = '';
    });

    function displayTransactions() {
        const transactions = JSON.parse(localStorage.getItem(userTransactionsKey)) || [];
        const tableBody = document.querySelector('#transaction-table tbody');
        tableBody.innerHTML = '';

        if (transactions.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" align="center">No transactions added yet</td></tr>`;
            updateTotals();
            return;
        }

        transactions.forEach((transaction, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaction.personName}</td>
                <td>${transaction.transactionType}</td>
                <td>${transaction.amount}</td>
                <td>${new Date(transaction.transactionDate).toLocaleDateString()}</td>
                <td><button class="remove-btn" data-index="${index}">Remove</button></td>
            `;
            tableBody.appendChild(row);
        });

        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', function () {
                const index = parseInt(this.dataset.index, 10);
                removeTransaction(index);
            });
        });

        updateTotals();
    }

    function removeTransaction(index) {
        const transactions = JSON.parse(localStorage.getItem(userTransactionsKey)) || [];
        transactions.splice(index, 1);
        localStorage.setItem(userTransactionsKey, JSON.stringify(transactions));

        displayTransactions();
        showPopupMessage('Transaction removed successfully!', 'success');
    }

    function updateTotals() {
        const transactions = JSON.parse(localStorage.getItem(userTransactionsKey)) || [];
        let totalGiven = 0;
        let totalTaken = 0;

        transactions.forEach(transaction => {
            if (transaction.transactionType === 'give') {
                totalGiven += transaction.amount;
            } else if (transaction.transactionType === 'take') {
                totalTaken += transaction.amount;
            }
        });

        document.getElementById('total-given').textContent = `Total Given: ₹${totalGiven}`;
        document.getElementById('total-taken').textContent = `Total Taken: ₹${totalTaken}`;
    }

    document.getElementById('clear-history').addEventListener('click', function () {
        localStorage.removeItem(userTransactionsKey);
        displayTransactions();
        showPopupMessage('Transaction history cleared.', 'success');
    });

    function showPopupMessage(message, type) {
        const popup = document.getElementById('popup-message');
        const popupText = document.getElementById('popup-text');
        const popupClose = document.getElementById('popup-close');
        popupText.textContent = message;

        // Apply success or error style
        if (type === 'success') {
            popupText.classList.add('success-message');
            popupText.classList.remove('error-message');
        } else {
            popupText.classList.add('error-message');
            popupText.classList.remove('success-message');
        }

        popup.style.display = 'flex';

        popupClose.addEventListener('click', function () {
            popup.style.display = 'none';
        });

        setTimeout(function () {
            popup.style.display = 'none';
        }, 1400);
    }

    displayTransactions();
});
