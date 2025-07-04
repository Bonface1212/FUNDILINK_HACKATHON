document.addEventListener("DOMContentLoaded", () => {
  const fundiList = document.getElementById("fundiList");

  fetch("https://fundilink-backend-1.onrender.com/api/fundis")
    .then(res => res.json())
    .then(data => {
      fundiList.innerHTML = "";
      data.forEach(fundi => {
        const card = document.createElement("div");
        card.className = "fundi-card";

        card.innerHTML = `
          <div class="photo-wrapper">
            <img src="${fundi.photo || './assets/default-avatar.png'}" class="fundi-photo" />
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

        // ✅ Add booking event listener
        card.querySelector(".book-now-btn").addEventListener("click", () => {
          const userType = localStorage.getItem("userType");
          const user = JSON.parse(localStorage.getItem("user"));

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
    })
    .catch(err => {
      console.error("❌ Error loading fundis:", err);
      fundiList.innerHTML = "<p>❌ Failed to load fundis.</p>";
    });
});

  // Dynamic navbar visibility
  const dashboardItem = document.getElementById("dashboardNavItem");
  const loginLink = document.getElementById("loginLink");
  const registerLink = document.getElementById("registerLink");
  const userType = localStorage.getItem("userType");

  if (userType === "fundi") {
    dashboardItem.style.display = "inline-block";
    loginLink.style.display = "none";
    registerLink.style.display = "none";
  } else if (userType === "client") {
    loginLink.style.display = "none";
    registerLink.style.display = "none";
  } else {
    dashboardItem.style.display = "none";
  };
