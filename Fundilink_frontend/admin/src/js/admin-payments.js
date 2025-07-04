const BASE_URL = 'https://fundilink-backend-1.onrender.com';

    async function fetchSummaryCounts() {
      try {
        const [fundiRes, clientRes, bookingRes, paymentRes] = await Promise.all([
          fetch(`${BASE_URL}/api/fundis`),
          fetch(`${BASE_URL}/api/clients`),
          fetch(`${BASE_URL}/api/bookings`),
          fetch(`${BASE_URL}/api/payments`)
        ]);

        const [fundis, clients, bookings, payments] = await Promise.all([
          fundiRes.json(),
          clientRes.json(),
          bookingRes.json(),
          paymentRes.json()
        ]);

        document.getElementById('totalFundis').textContent = fundis.length;
        document.getElementById('totalClients').textContent = clients.length;
        document.getElementById('totalBookings').textContent = bookings.length;
        document.getElementById('totalPayments').textContent = payments.length;

      } catch (error) {
        console.error('❌ Error loading summary:', error);
      }
    }

    document.getElementById("logoutBtn").addEventListener("click", function() {
      localStorage.clear();
      window.location.href = "/FUNDILINK_HACKATHON/Fundilink_frontend/login.html";
    });

    document.addEventListener('DOMContentLoaded', fetchSummaryCounts);
  