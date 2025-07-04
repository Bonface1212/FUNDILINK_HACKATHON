document.addEventListener("DOMContentLoaded", () => {
  const userType = localStorage.getItem("userType");
  if (userType !== "fundi") {
    alert("Access denied. Fundi only.");
    window.location.href = "login.html";
    return;
  }

  const fundi = JSON.parse(localStorage.getItem("fundi"));
  if (!fundi) {
    alert("Please log in as a Fundi to view this page.");
    window.location.href = "login.html";
    return;
  }

  // Populate fundi profile
  document.getElementById("fundiName").textContent = fundi.name;
  document.getElementById("fundiSkill").textContent = fundi.skill || "N/A";
  document.getElementById("fundiLocation").textContent = fundi.location || "N/A";
  document.getElementById("fundiPhoto").src = fundi.photo || "./assets/default-avatar.png";

  const jobList = document.getElementById("jobList");

  function loadBookings() {
    jobList.innerHTML = "<p>Loading job requests...</p>";
    fetch("https://fundilink-backend-1.onrender.com/api/bookings")
      .then(res => res.json())
      .then(bookings => {
        jobList.innerHTML = "";
        if (!bookings.length) {
          jobList.innerHTML = "<p>No client requests at the moment.</p>";
          return;
        }

        bookings.forEach(b => {
          const card = document.createElement("div");
          card.className = "job-card";
          card.innerHTML = `
            <h4>${b.name}</h4>
            <p><strong>Location:</strong> ${b.location}</p>
            <p><strong>Message:</strong> ${b.message}</p>
            <button class="whatsappBtn" data-phone="${b.phone}" data-paid="${b.paid}">Contact via WhatsApp</button>
          `;
          jobList.appendChild(card);
        });

        document.querySelectorAll(".whatsappBtn").forEach(btn => {
          btn.addEventListener("click", () => {
            const phone = btn.dataset.phone;
            const paid = btn.dataset.paid === "true";
            if (!paid) {
              alert("⚠️ Please complete payment to unlock contact.");
              return;
            }
            window.open(`https://wa.me/${phone}`, "_blank");
          });
        });
      })
      .catch(err => {
        console.error("Error loading bookings:", err);
        jobList.innerHTML = "<p>❌ Failed to load requests.</p>";
      });
  }

  loadBookings();

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("fundi");
    localStorage.removeItem("userType");
    window.location.href = "login.html";
  });

  // Theme Toggle
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    themeToggleBtn.textContent = newTheme === "dark" ? "☀️" : "🌙";
  });
});
