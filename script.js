document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        if (response.ok) {
            alert('User registered successfully');
        } else {
            const error = await response.json();
            alert(error.message);
        }
    } catch (err) {
        alert('Error: ' + err.message);
    }
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            showProfile();
        } else {
            const error = await response.json();
            alert(error.message);
        }
    } catch (err) {
        alert('Error: ' + err.message);
    }
});

document.getElementById('transactionForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('transactionType').value;

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/transaction/${type}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ amount })
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('balance').textContent = data.balance;
        } else {
            const error = await response.json();
            alert(error.message);
        }
    } catch (err) {
        alert('Error: ' + err.message);
    }
});

async function showProfile() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch('/api/user/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const user = await response.json();
            document.getElementById('welcomeMessage').textContent = `Welcome, ${user.username}`;
            document.getElementById('balance').textContent = user.balance;
            document.getElementById('register').style.display = 'none';
            document.getElementById('login').style.display = 'none';
            document.getElementById('profile').style.display = 'block';
        } else {
            localStorage.removeItem('token');
        }
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

document.addEventListener('DOMContentLoaded', showProfile);
