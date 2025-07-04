const BASE_URL = 'https://fundilink-backend-1.onrender.com';
const bookingList = document.getElementById('bookingList');
const refreshBtn = document.getElementById('refreshBookings');

async function loadBookings() {
  try {
    const response = await fetch(`${BASE_URL}/api/bookings`);
    const bookings = await response.json();

    bookingList.innerHTML = ''; // Clear previous content

    if (bookings.length === 0) {
      bookingList.innerHTML = '<p>No bookings found.</p>';
      return;
    }

    bookings.forEach(booking => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
        <h3>Client: ${booking.clientName}</h3>
        <p><strong>Fundi:</strong> ${booking.fundiName || 'Not yet assigned'}</p>
        <p><strong>Skill:</strong> ${booking.skill}</p>
        <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
        <p><strong>Location:</strong> ${booking.location}</p>
        <p><strong>Message:</strong> ${booking.message}</p>
        <p><strong>Paid:</strong> ${booking.paid ? '✅ Yes' : '❌ No'}</p>
        <div class="card-actions">
          <button class="btn small-btn delete-btn" data-id="${booking._id}">🗑️ Delete</button>
        </div>
      `;
      bookingList.appendChild(card);
    });

    attachDeleteHandlers();
  } catch (error) {
    console.error("Error loading bookings:", error);
    bookingList.innerHTML = '<p>❌ Error loading bookings.</p>';
  }
}

function attachDeleteHandlers() {
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const confirmDelete = confirm("Are you sure you want to delete this booking?");
      if (!confirmDelete) return;

      try {
        const res = await fetch(`${BASE_URL}/api/bookings/${id}`, { method: 'DELETE' });
        if (res.ok) {
          alert("✅ Booking deleted.");
          loadBookings();
        } else {
          alert("❌ Failed to delete booking.");
        }
      } catch (err) {
        console.error(err);
        alert("❌ Error deleting booking.");
      }
    });
  });
}

refreshBtn?.addEventListener('click', loadBookings);
document.addEventListener('DOMContentLoaded', loadBookings);
