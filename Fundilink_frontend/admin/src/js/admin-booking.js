const BASE_URL = 'https://fundilink-backend-1.onrender.com';
    const bookingList = document.getElementById('bookingList');

    async function loadBookings() {
      try {
        const response = await fetch(`${BASE_URL}/api/bookings`);
        const bookings = await response.json();
        if (bookings.length === 0) {
          bookingList.innerHTML = '<p>No bookings found.</p>';
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
        bookingList.innerHTML = '<p>Error loading bookings.</p>';
      }
    }
    document.addEventListener('DOMContentLoaded', loadBookings);
  