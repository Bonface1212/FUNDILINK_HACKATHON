document.addEventListener("DOMContentLoaded", () => {
  const skillFilter = document.getElementById("skillFilter");
  if (skillFilter) {
    skillFilter.addEventListener("change", () => loadFundis(skillFilter.value));
  }
  loadFundis();
});

function loadFundis(skill = "") {
  fetch("https://fundilink-backend-1.onrender.com/api/fundis")
    .then((response) => response.json())
    .then((fundis) => {
      const container = document.getElementById("fundiContainer");
      container.innerHTML = "";

      fundis
        .filter(fundi => !skill || fundi.skill.toLowerCase() === skill.toLowerCase())
        .forEach(fundi => {
          const card = document.createElement("div");
          card.className = "fundi-card";

          const avatar = fundi.photo
            ? `https://fundilink-backend-1.onrender.com${fundi.photo}`
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(fundi.name)}&background=047857&color=fff`;

          card.innerHTML = `
            <img src="${avatar}" alt="${fundi.name}" class="w-20 h-20 rounded-full mb-2 mx-auto">
            <h3 class="text-center font-bold">${fundi.name}</h3>
            <p><strong>Skill:</strong> ${fundi.skill}</p>
            <p><strong>Location:</strong> ${fundi.location}</p>
            <p><strong>Rate:</strong> ${fundi.price}</p>
            <div class="text-center">
              <button class="cta-button mt-2" onclick='showBookingModal(${JSON.stringify(fundi)})'>Book Now</button>
            </div>
          `;

          container.appendChild(card);
        });
    })
    .catch((err) => {
      console.error("Failed to load fundis:", err);
    });
}

let selectedFundi = null;

function showBookingModal(fundi) {
  selectedFundi = fundi;

  document.getElementById("modalName").textContent = fundi.name;
  document.getElementById("modalSkill").textContent = fundi.skill;
  document.getElementById("modalPhone").textContent = fundi.phone;
  document.getElementById("modalLocation").textContent = fundi.location;
  document.getElementById("modalPrice").textContent = fundi.price;
  document.getElementById("modalDescription").textContent = fundi.description;

  document.getElementById("bookingModal").classList.remove("hidden");
}
document.addEventListener('DOMContentLoaded', () => {
  const bookNowButtons = document.querySelectorAll('.book-now-btn');
  const modal = document.getElementById('bookingModal');
  const modalFundiName = document.getElementById('modalFundiName');
  const modalFundiSkill = document.getElementById('modalFundiSkill');
  const modalPhone = document.getElementById('modalPhone');
  const confirmBtn = document.getElementById('confirmBookingBtn');
  const closeModalBtn = document.getElementById('closeModal');

  let selectedFundiPhone = '';

  // Show modal when Book Now is clicked
  bookNowButtons.forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.fundi-card');
      const name = card.querySelector('.fundi-name').textContent;
      const skill = card.querySelector('.fundi-skill').textContent;
      const phone = card.getAttribute('data-phone');

      modalFundiName.textContent = name;
      modalFundiSkill.textContent = skill;
      modalPhone.textContent = phone;
      selectedFundiPhone = phone;

      modal.style.display = 'block';
    });
  });

  // Send WhatsApp and redirect to payment
  confirmBtn.addEventListener('click', () => {
    const message = encodeURIComponent(`Hello, I'm interested in your services via FundiLink.`);
    
    // Open WhatsApp in new tab
    window.open(`https://wa.me/${selectedFundiPhone}?text=${message}`, '_blank');

    // Redirect to payment page after a delay
    setTimeout(() => {
      window.location.href = 'payment.html';
    }, 3000);
  });

  // Close modal
  closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Optional: Close modal when clicking outside
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
});

function closeModal(event) {
  if (!event || event.target.id === "bookingModal" || event.target.classList.contains("close-btn")) {
    document.getElementById("bookingModal").classList.add("hidden");

    // Optional smooth scroll back to fundi list
    const fundiSection = document.querySelector(".fundis-section");
    if (fundiSection) {
      fundiSection.scrollIntoView({ behavior: "smooth" });
    }
  }
}

function submitBooking() {
  const clientName = document.getElementById("clientName").value;
  const bookingDate = document.getElementById("bookingDate").value;
  const clientMessage = document.getElementById("clientMessage").value;

  if (!clientName || !bookingDate || !clientMessage) {
    alert("Please fill in all fields.");
    return;
  }

  const message = `Hello ${selectedFundi.name}, I am ${clientName} and I'd like to book you as a ${selectedFundi.skill} on ${bookingDate}. Message: ${clientMessage}`;
  const whatsappLink = `https://wa.me/${selectedFundi.phone.replace(/^0/, '254')}?text=${encodeURIComponent(message)}`;

  window.open(whatsappLink, "_blank");
  closeModal();
}
