const BASE_URL = 'https://fundilink-backend-1.onrender.com';

// DOM Elements
const fundiList = document.getElementById('fundiList');
const clientList = document.getElementById('clientList');
const bookingList = document.getElementById('bookingList');
const paymentList = document.getElementById('paymentList');

// 🔁 Utility: Render card element
function createCard(html) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.innerHTML = html;
  return card;
}

// 🚀 Fetch and render Fundis
async function loadFundis() {
  try {
    const res = await fetch(`${BASE_URL}/api/fundis`);
    const fundis = await res.json();

    if (!fundis.length) {
      fundiList.innerHTML = '<p>No fundis registered yet.</p>';
      return;
    }

    fundis.forEach(fundi => {
      fundiList.appendChild(createCard(`
        <h3>${fundi.name}</h3>
        <p><strong>Skill:</strong> ${fundi.skill}</p>
        <p><strong>Phone:</strong> ${fundi.phone}</p>
        <p><strong>Location:</strong> ${fundi.location}</p>
        <p><strong>Rate:</strong> KES ${fundi.price}</p>
        <p><strong>Description:</strong> ${fundi.description}</p>
      `));
    });
  } catch (error) {
    console.error('❌ Error loading fundis:', error);
    fundiList.innerHTML = '<p>Failed to load fundis.</p>';
  }
}

// 🚀 Fetch and render Clients
async function loadClients() {
  try {
    const res = await fetch(`${BASE_URL}/api/clients`);
    const clients = await res.json();

    if (!clients.length) {
      clientList.innerHTML = '<p>No clients registered yet.</p>';
      return;
    }

    clients.forEach(client => {
      clientList.appendChild(createCard(`
        <h3>${client.name}</h3>
        <p><strong>Username:</strong> ${client.username}</p>
        <p><strong>Email:</strong> ${client.email}</p>
        <p><strong>Phone:</strong> ${client.phone}</p>
        <p><strong>Location:</strong> ${client.location}</p>
      `));
    });
  } catch (error) {
    console.error('❌ Error loading clients:', error);
    clientList.innerHTML = '<p>Failed to load clients.</p>';
  }
}

// 🚀 Fetch and render Bookings
async function loadBookings() {
  try {
    const res = await fetch(`${BASE_URL}/api/bookings`);
    const bookings = await res.json();

    if (!bookings.length) {
      bookingList.innerHTML = '<p>No bookings yet.</p>';
      return;
    }

    bookings.forEach(booking => {
      bookingList.appendChild(createCard(`
        <h3>${booking.clientName}</h3>
        <p><strong>Fundi:</strong> ${booking.fundiName}</p>
        <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
        <p><strong>Message:</strong> ${booking.message}</p>
      `));
    });
  } catch (error) {
    console.error('❌ Error loading bookings:', error);
    bookingList.innerHTML = '<p>Failed to load bookings.</p>';
  }
}

// 🚀 Fetch and render Payments
async function loadPayments() {
  try {
    const res = await fetch(`${BASE_URL}/api/payments`);
    const payments = await res.json();

    if (!payments.length) {
      paymentList.innerHTML = '<p>No payments found.</p>';
      return;
    }

    payments.forEach(payment => {
      paymentList.appendChild(createCard(`
        <h3>Transaction</h3>
        <p><strong>Phone:</strong> ${payment.phone}</p>
        <p><strong>Amount:</strong> KES ${payment.amount}</p>
        <p><strong>Status:</strong> ${payment.status || 'Pending'}</p>
        <p><strong>Date:</strong> ${new Date(payment.date || payment.createdAt).toLocaleString()}</p>
      `));
    });
  } catch (error) {
    console.error('❌ Error loading payments:', error);
    paymentList.innerHTML = '<p>Failed to load payments.</p>';
  }
}

// 🟢 Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  if (fundiList) loadFundis();
  if (clientList) loadClients();
  if (bookingList) loadBookings();
  if (paymentList) loadPayments();
});

// 🔒 Logout Handler
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "/FUNDILINK_HACKATHON/Fundilink_frontend/login.html";
  });
}
