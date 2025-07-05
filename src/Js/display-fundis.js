document.addEventListener("DOMContentLoaded", () => {
  const fundiList = document.getElementById("fundiList");
  const logoutBtn = document.getElementById("logoutBtn");
  const dashboardItem = document.getElementById("dashboardNavItem");
  const loginLink = document.getElementById("loginLink");
  const registerLink = document.getElementById("registerLink");
  const requestFundiNavItem = document.getElementById("requestFundiNavItem");
  const userAvatar = document.getElementById("userAvatar");

  const user = JSON.parse(localStorage.getItem("user"));
  const userType = localStorage.getItem("userType");

  const BACKEND_URL = "https://fundilink-backend-1.onrender.com"; // ✅ deployed backend URL

  // 🔐 Navbar control
  if (user) {
    logoutBtn.style.display = "inline-block";
    userAvatar.style.display = "inline-block";
    userAvatar.src = user.photo && user.photo.startsWith("/uploads")
      ? `${BACKEND_URL}${user.photo}`
      : "assets/default-avatar.jpg";

    loginLink.style.display = "none";
    registerLink.style.display = "none";

    if (userType === "fundi") {
      dashboardItem.style.display = "inline-block";
    } else if (userType === "client") {
      requestFundiNavItem.style.display = "inline-block";
    }
  } else {
    dashboardItem.style.display = "none";
    requestFundiNavItem.style.display = "none";
  }

  // 🔓 Logout
  logoutBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      alert("👋 You have been logged out.");
      window.location.href = "login.html";
    }
  });

  // 📡 Fetch and display fundis
  fetch(`${BACKEND_URL}/api/fundis`)
    .then(res => res.json())
    .then(fundis => {
      fundiList.innerHTML = "";

      if (!fundis.length) {
        const fallback = document.createElement("div");
        fallback.style.textAlign = "center";
        fallback.innerHTML = `<p>📭 No fundis available at the moment.</p>`;
        fundiList.appendChild(fallback);
      } else {
        fundis.forEach(fundi => {
          const photoUrl = fundi.photo && fundi.photo.startsWith("/uploads")
            ? `${BACKEND_URL}${fundi.photo}`
            : "assets/default-avatar.jpg";

          const card = document.createElement("div");
          card.className = "fundi-card";

          card.innerHTML = `
            <div class="photo-wrapper">
              <img src="${photoUrl}" class="fundi-photo" />
              <span class="verified-badge">✔️</span>
            </div>
            <div class="fundi-details">
              <h4 class="fundi-name">${fundi.name}</h4>
              <div class="star-rating">⭐⭐⭐⭐☆</div>
              <p class="fundi-skill"><strong>Skill:</strong> ${fundi.skill}</p>
              <p class="fundi-location"><strong>Location:</strong> ${fundi.location}</p>
              <p class="fundi-price"><strong>Price:</strong> KES ${fundi.price}</p>
              <p class="fundi-phone" style="display:none;">${fundi.phone}</p>
              <button class="book-now-btn">Book Now</button>
            </div>
          `;

          card.querySelector(".book-now-btn").addEventListener("click", () => {
            if (!user || userType !== "client") {
              alert("⚠️ You must be logged in as a client to book a fundi.");
              window.location.href = "login.html";
              return;
            }

            const fundiInfo = {
              name: fundi.name,
              skill: fundi.skill,
              location: fundi.location,
              phone: fundi.phone,
              price: fundi.price,
            };

            const bookingInfo = {
              fundi: fundiInfo,
              clientName: user.name,
              clientMessage: `I'd like to hire you for ${fundi.skill}.`,
              bookingDate: new Date().toLocaleDateString()
            };

            localStorage.setItem("bookingInfo", JSON.stringify(bookingInfo));
            window.location.href = "payment.html";
          });

          fundiList.appendChild(card);
        });
      }

      // ➕ Add "Request a Fundi" prompt for clients
      if (userType === "client") {
        const inlineSuggestion = document.createElement("div");
        inlineSuggestion.className = "request-suggestion";
        inlineSuggestion.innerHTML = `
          <p style="margin-bottom: 0.5rem;">💡 Still can't find what you're looking for?</p>
          <a href="client-request.html" class="cta-btn">Request a Fundi</a>
        `;
        fundiList.appendChild(inlineSuggestion);

        if (!window.location.href.includes("client-request.html")) {
          const floatingBtn = document.createElement("a");
          floatingBtn.href = "client-request.html";
          floatingBtn.textContent = "➕ Request a Fundi";
          floatingBtn.className = "floating-request-btn";
          document.body.appendChild(floatingBtn);
        }
      }
    })
    .catch(err => {
      console.error("❌ Error loading fundis:", err);
      fundiList.innerHTML = "<p>❌ Failed to load fundis.</p>";
    });
});
