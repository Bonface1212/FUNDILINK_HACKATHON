const BASE_URL = 'https://fundilink-backend-1.onrender.com';

document.getElementById('adminLoginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('adminUsername').value;
  const password = document.getElementById('adminPassword').value;

  const response = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const result = await response.json();

  if (response.ok) {
    localStorage.setItem('adminToken', result.token);
    window.location.href = 'admin-dashboard.html';
  } else {
    alert(result.message || 'Login failed');
  }
});

// Show/hide password
document.getElementById('togglePassword').addEventListener('click', function () {
  const password = document.getElementById('password');
  const isPassword = password.type === 'password';
  password.type = isPassword ? 'text' : 'password';
  this.textContent = isPassword ? '🙈' : '👁️';
});
