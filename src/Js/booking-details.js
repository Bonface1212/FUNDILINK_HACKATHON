// src/Js/booking-modal.js

document.addEventListener('DOMContentLoaded', () => {
  // Example: Load booking data from localStorage (or fetch from backend if needed)
  // Here, I'm using localStorage keys for demonstration.
  
  const fundiName = localStorage.getItem('booking_fundiName') || 'N/A';
  const fundiSkill = localStorage.getItem('booking_fundiSkill') || 'N/A';
  const fundiPhone = localStorage.getItem('booking_fundiPhone') || 'N/A';
  const fundiLocation = localStorage.getItem('booking_fundiLocation') || 'N/A';
  const fundiPrice = localStorage.getItem('booking_fundiPrice') || 'N/A';
  const fundiDescription = localStorage.getItem('booking_fundiDescription') || 'N/A';

  // Set the values into HTML
  document.getElementById('fundiName').textContent = fundiName;
  document.getElementById('fundiSkill').textContent = fundiSkill;
  document.getElementById('fundiPhone').textContent = fundiPhone;
  document.getElementById('fundiLocation').textContent = fundiLocation;
  document.getElementById('fundiPrice').textContent = fundiPrice;
  document.getElementById('fundiDescription').textContent = fundiDescription;

  const whatsappLink = document.getElementById('whatsappShare');
  const messageInput = document.getElementById('shareMessage');

  // Update WhatsApp share URL with message and phone number
  function updateWhatsAppLink() {
    const userMessage = messageInput.value.trim();
    // WhatsApp URL format: https://wa.me/<phone>?text=<encoded text>
    const text = encodeURIComponent(
      `Hello ${fundiName},\n` + (userMessage || 'I am interested in your services.')
    );
    // Ensure phone number has no spaces or special chars
    const phone = fundiPhone.replace(/\D/g, '');
    whatsappLink.href = `https://wa.me/${phone}?text=${text}`;
  }

  // Initialize link
  updateWhatsAppLink();

  // Update link as user types
  messageInput.addEventListener('input', updateWhatsAppLink);

  // Logout button functionality
  const logoutBtn = document.getElementById('logoutBtn');
  logoutBtn.addEventListener('click', () => {
    localStorage.clear(); // or remove specific keys
    window.location.href = 'login.html';
  });
});
