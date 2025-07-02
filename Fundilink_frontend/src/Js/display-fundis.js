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
        .forEach((fundi) => {
          const card = document.createElement("div");
          card.className = "fundi-card";

          const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
            fundi.name
          )}&background=047857&color=fff`;

          card.innerHTML = `
            <img src="${avatarUrl}" alt="${fundi.name}" class="w-20 h-20 rounded-full mb-2">
            <h3>${fundi.name}</h3>
            <p><strong>Skill:</strong> ${fundi.skill}</p>
            <p><strong>Location:</strong> ${fundi.location}</p>
            <p><strong>Phone:</strong> ${fundi.phone}</p>
            <p><strong>Rate:</strong> ${fundi.price}</p>
            <p>${fundi.description}</p>
            <button class="cta-button mt-2" onclick='showBookingModal(${JSON.stringify(
              fundi
            )})'>Book Now</button>
          `;

          container.appendChild(card);
        });
    })
    .catch((err) => {
      console.error("Failed to load fundis:", err);
    });
}

function showBookingModal(fundi) {
  document.getElementById("modalName").textContent = fundi.name;
  document.getElementById("modalSkill").textContent = fundi.skill;
  document.getElementById("modalPhone").textContent = fundi.phone;
  document.getElementById("modalLocation").textContent = fundi.location;
  document.getElementById("modalPrice").textContent = fundi.price;
  document.getElementById("modalDescription").textContent = fundi.description;
  document.getElementById("callNowBtn").href = `tel:${fundi.phone}`;

  document.getElementById("bookingModal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("bookingModal").classList.add("hidden");
}
