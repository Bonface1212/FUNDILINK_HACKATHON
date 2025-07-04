const BASE_URL = 'https://fundilink-backend-1.onrender.com';

// DOM Elements
const fundiList = document.getElementById('fundiList');
const bookingList = document.getElementById('bookingList');
const paymentList = document.getElementById('paymentList');
const clientList = document.getElementById('clientList'); // ✅ New

// Fetch and display Fundis
async function loadFundis() {
  try {
    const response = await fetch(`${BASE_URL}/api/fundis`);
    const fundis = await response.json();

    if (fundis.length === 0) {
      fundiList.innerHTML = '<p>No fundis registered yet.</p>';
      return;
    }

    fundis.forEach(fundi => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
        <h3>${fundi.name}</h3>
        <p><strong>Skill:</strong> ${fundi.skill}</p>
        <p><strong>Phone:</strong> ${fundi.phone}</p>
        <p><strong>Location:</strong> ${fundi.location}</p>
        <p><strong>Rate:</strong> KES ${fundi.price}</p>
        <p><strong>Description:</strong> ${fundi.description}</p>
      `;
      fundiList.appendChild(card);
    });
  } catch (error) {
    console.error('❌ Error loading fundis:', error);
    fundiList.innerHTML = '<p>Failed to load fundis.</p>';
  }
}

// ✅ Fetch and display Clients
async function loadClients() {
  try {
    const response = await fetch(`${BASE_URL}/api/clients`);
    const clients = await response.json();

    if (clients.length === 0) {
      clientList.innerHTML = '<p>No clients registered yet.</p>';
      return;
    }

    clients.forEach(client => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
        <h3>${client.name}</h3>
        <p><strong>Username:</strong> ${client.username}</p>
        <p><strong>Email:</strong> ${client.email}</p>
        <p><strong>Phone:</strong> ${client.phone}</p>
        <p><strong>Location:</strong> ${client.location}</p>
      `;
      clientList.appendChild(card);
    });
  } catch (error) {
    console.error('❌ Error loading clients:', error);
    clientList.innerHTML = '<p>Failed to load clients.</p>';
  }
}

// Fetch and display Bookings
async function loadBookings() {
  try {
    const response = await fetch(`${BASE_URL}/api/bookings`);
    const bookings = await response.json();

    if (bookings.length === 0) {
      bookingList.innerHTML = '<p>No bookings yet.</p>';
      return;
    }

    bookings.forEach(booking => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
        <h3>${booking.clientName}</h3>
        <p><strong>Fundi:</strong> ${booking.fundiName}</p>
        <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
        <p><strong>Message:</strong> ${booking.message}</p>
      `;
      bookingList.appendChild(card);
    });
  } catch (error) {
    console.error('❌ Error loading bookings:', error);
    bookingList.innerHTML = '<p>Failed to load bookings.</p>';
  }
}

// Fetch and display Payments
async function loadPayments() {
  try {
    const response = await fetch(`${BASE_URL}/api/payments`);
    const payments = await response.json();

    if (payments.length === 0) {
      paymentList.innerHTML = '<p>No payments found.</p>';
      return;
    }

    payments.forEach(payment => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
        <h3>Transaction</h3>
        <p><strong>Phone:</strong> ${payment.phone}</p>
        <p><strong>Amount:</strong> KES ${payment.amount}</p>
        <p><strong>Status:</strong> ${payment.status || 'Pending'}</p>
        <p><strong>Date:</strong> ${new Date(payment.date || payment.createdAt).toLocaleString()}</p>
      `;
      paymentList.appendChild(card);
    });
  } catch (error) {
    console.error('❌ Error loading payments:', error);
    paymentList.innerHTML = '<p>Failed to load payments.</p>';
  }
}

// Load all data when page is ready
document.addEventListener('DOMContentLoaded', () => {
  loadFundis();
  loadClients(); // ✅ Load clients
  loadBookings();
  loadPayments();
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", function() {
  localStorage.clear();
  window.location.href = "/FUNDILINK_HACKATHON/Fundilink_frontend/login.html";
});
