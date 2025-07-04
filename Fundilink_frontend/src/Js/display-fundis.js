document.addEventListener("DOMContentLoaded", () => {
  const fundiList = document.getElementById("fundiList");
  const modal = document.getElementById("bookingModal");
  const closeModal = document.getElementById("closeModal");
  const bookBtn = document.getElementById("submitBookingBtn");

  // Load fundis from backend
  fetch("https://fundilink-backend-1.onrender.com/api/fundis")
    .then(res => res.json())
    .then(data => {
      fundiList.innerHTML = "";
      data.forEach(fundi => {
        const card = document.createElement("div");
        card.className = "fundi-card";
        card.innerHTML = `
          <img src="${fundi.photo || './assets/default-avatar.png'}" alt="${fundi.name}" />
          <h4>${fundi.name}</h4>
          <p><strong>Skill:</strong> ${fundi.skill}</p>
          <p><strong>Location:</strong> ${fundi.location}</p>
          <p><strong>Price:</strong> KES ${fundi.price}</p>
          <button class="bookNowBtn">Book Now</button>
        `;
        card.querySelector(".bookNowBtn").addEventListener("click", () => {
          const user = JSON.parse(localStorage.getItem("user"));
          const userType = localStorage.getItem("userType");
          if (!user || userType !== "client") {
            alert("You must be logged in as a client to book a fundi.");
            window.location.href = "login.html";
            return;
          }

          localStorage.setItem("selectedFundi", JSON.stringify(fundi));
          window.location.href = "payment.html"; // Enforce payment before contact
        });
        fundiList.appendChild(card);
      });
    })
    .catch(err => {
      console.error("❌ Error loading fundis:", err);
      fundiList.innerHTML = "<p>❌ Failed to load fundis. Please try again later.</p>";
    });

  // Close modal (if modal is used in future)
  if (closeModal) {
    closeModal.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  // Close modal on outside click
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Dynamic navbar logic
  const dashboardItem = document.getElementById("dashboardNavItem");
  const loginLink = document.getElementById("loginLink");
  const registerLink = document.getElementById("registerLink");
  const userType = localStorage.getItem("userType");

  if (userType === "fundi") {
    dashboardItem.style.display = "inline-block";
    loginLink.style.display = "none";
    registerLink.style.display = "none";
  } else {
    dashboardItem.style.display = "none";
  }
});
