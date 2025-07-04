const BASE_URL = 'https://fundilink-backend-1.onrender.com';

document.getElementById('adminLoginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  try {
    const response = await fetch(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) throw new Error('Invalid credentials');

    const data = await response.json();
    localStorage.setItem('adminToken', data.token || 'dummy-token');
    window.location.href = 'admin.html';
  } catch (err) {
    document.getElementById('loginError').style.display = 'block';
  }
});

// Show/hide password
document.getElementById('togglePassword').addEventListener('click', function () {
  const password = document.getElementById('password');
  const isPassword = password.type === 'password';
  password.type = isPassword ? 'text' : 'password';
  this.textContent = isPassword ? '🙈' : '👁️';
});
