document.addEventListener("DOMContentLoaded", () => {
  const userType = localStorage.getItem("userType");
  const fundi = JSON.parse(localStorage.getItem("user")); // ✅ Correct key

  if (userType !== "fundi" || !fundi) {
    alert("Access denied. Fundi only.");
    window.location.href = "login.html";
    return;
  }

  // ✅ Populate fundi profile
  document.getElementById("fundiName").textContent = fundi.name || "Fundi";
  document.getElementById("fundiSkill").textContent = fundi.skill || "N/A";
  document.getElementById("fundiLocation").textContent = fundi.location || "N/A";
  document.getElementById("fundiEmail").textContent = fundi.email || "N/A";
  document.getElementById("fundiPhone").textContent = fundi.phone || "N/A";
  document.getElementById("fundiPrice").textContent = fundi.price || "N/A";

  const img = document.getElementById("fundiPhoto");
  img.src = fundi.photo || "assets/default-avatar.png";
  img.onerror = () => {
    img.src = "assets/default-avatar.png";
  };

  // 📋 Load job requests
  const jobList = document.getElementById("jobList");

  function loadBookings() {
    jobList.innerHTML = "<p>Loading job requests...</p>";
    fetch("https://fundilink-backend-1.onrender.com/api/bookings")
      .then(res => res.json())
      .then(bookings => {
        jobList.innerHTML = "";

        const myBookings = bookings.filter(b => b.fundiId === fundi.id || b.fundiId === fundi._id);

        if (!myBookings.length) {
          jobList.innerHTML = "<p>No client requests at the moment.</p>";
          return;
        }

        myBookings.forEach(b => {
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

  // 🔓 Logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
  });

  // 🌙 Theme Toggle
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    themeToggleBtn.textContent = newTheme === "dark" ? "☀️" : "🌙";
  });
});
