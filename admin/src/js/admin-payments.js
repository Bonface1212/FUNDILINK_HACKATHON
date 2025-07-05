const BASE_URL = 'https://fundilink-backend-1.onrender.com';
const paymentList = document.getElementById('paymentList');
const refreshBtn = document.getElementById('refreshPayments');

async function loadPayments() {
  try {
    const response = await fetch(`${BASE_URL}/api/payments`);
    const payments = await response.json();

    paymentList.innerHTML = '';

    if (!payments.length) {
      paymentList.innerHTML = '<p>No payments recorded yet.</p>';
      return;
    }

    payments.forEach(payment => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
        <h3>Client: ${payment.clientName || 'Unknown'}</h3>
        <p><strong>Amount:</strong> KES ${payment.amount}</p>
        <p><strong>Method:</strong> ${payment.method}</p>
        <p><strong>Reference:</strong> ${payment.reference}</p>
        <p><strong>Date:</strong> ${new Date(payment.date).toLocaleString()}</p>
        <div class="card-actions">
          <button class="btn small-btn delete-btn" data-id="${payment._id}">🗑️ Delete</button>
        </div>
      `;
      paymentList.appendChild(card);
    });

    attachDeleteHandlers();
  } catch (err) {
    console.error('Error loading payments:', err);
    paymentList.innerHTML = '<p>❌ Error loading payments.</p>';
  }
}

function attachDeleteHandlers() {
  const deleteButtons = document.querySelectorAll('.delete-btn');
  deleteButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const confirmDelete = confirm('Are you sure you want to delete this payment?');
      if (!confirmDelete) return;

      try {
        const res = await fetch(`${BASE_URL}/api/payments/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          alert('✅ Payment deleted successfully.');
          loadPayments();
        } else {
          alert('❌ Failed to delete payment.');
        }
      } catch (error) {
        console.error(error);
        alert('❌ Error deleting payment.');
      }
    });
  });
}

refreshBtn?.addEventListener('click', loadPayments);
document.addEventListener('DOMContentLoaded', loadPayments);
