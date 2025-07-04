document.addEventListener("DOMContentLoaded", () => {
  const userType = localStorage.getItem("userType");
  const fundi = JSON.parse(localStorage.getItem("user"));

  if (userType !== "fundi" || !fundi) {
    alert("Access denied. Fundis only.");
    window.location.href = "login.html";
    return;
  }

  const jobList = document.getElementById("jobList");
  const openList = document.getElementById("openRequestList");
  const filterSelect = document.getElementById("filterJobs");
  const refreshBtn = document.getElementById("refreshBtn");

  // Load profile info
  document.getElementById("fundiName").textContent = fundi.name;
  document.getElementById("fundiSkill").textContent = fundi.skill;
  document.getElementById("fundiLocation").textContent = fundi.location;
  document.getElementById("fundiEmail").textContent = fundi.email;
  document.getElementById("fundiPhone").textContent = fundi.phone;
  document.getElementById("fundiPrice").textContent = fundi.price;
  const img = document.getElementById("fundiPhoto");
  img.src = fundi.photo || "assets/default-avatar.png";

  // Theme toggle
  const themeBtn = document.getElementById("themeToggleBtn");
  const currentTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", currentTheme);
  themeBtn.textContent = currentTheme === "dark" ? "☀️" : "🌙";

  themeBtn.addEventListener("click", () => {
    const newTheme = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    themeBtn.textContent = newTheme === "dark" ? "☀️" : "🌙";
  });

  function showToast(msg, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 100);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  let allBookings = [];

  function renderBookings(filtered) {
    jobList.innerHTML = "";
    if (!filtered.length) {
      jobList.innerHTML = "<p>📭 No job requests found.</p>";
      return;
    }

    document.getElementById("totalJobs").textContent = filtered.length;
    document.getElementById("totalEarnings").textContent = "KES " + filtered.filter(b => b.paid).length * 100;
    document.getElementById("totalClients").textContent = new Set(filtered.map(b => b.clientId)).size;

    filtered.forEach(b => {
      const card = document.createElement("div");
      card.className = "job-card";
      card.innerHTML = `
        <h4>${b.name}</h4>
        <p><strong>Location:</strong> ${b.location}</p>
        <p><strong>Message:</strong> ${b.message}</p>
        <p><strong>Date:</strong> ${new Date(b.date).toLocaleDateString()}</p>
        <div class="job-actions">
          <button class="whatsappBtn" data-phone="${b.phone}" data-paid="${b.paid}">WhatsApp</button>
          <button class="completeBtn" data-id="${b._id}">✅ Complete</button>
        </div>
      `;
      jobList.appendChild(card);
    });

    document.querySelectorAll(".whatsappBtn").forEach(btn => {
      btn.addEventListener("click", () => {
        const phone = btn.dataset.phone;
        const paid = btn.dataset.paid === "true";
        if (!paid) {
          alert("⚠️ Please pay to unlock this contact.");
        } else {
          window.open(`https://wa.me/${phone}`, "_blank");
        }
      });
    });

    document.querySelectorAll(".completeBtn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        fetch(`https://fundilink-backend-1.onrender.com/api/bookings/${id}`, { method: "DELETE" })
          .then(res => {
            if (res.ok) {
              showToast("✅ Job marked as complete.");
              loadBookings();
            } else {
              showToast("❌ Failed to mark complete.", "error");
            }
          });
      });
    });
  }

  function applyFilter() {
    const val = filterSelect.value;
    if (val === "paid") renderBookings(allBookings.filter(b => b.paid));
    else if (val === "unpaid") renderBookings(allBookings.filter(b => !b.paid));
    else renderBookings(allBookings);
  }

  function loadBookings() {
    fetch("https://fundilink-backend-1.onrender.com/api/bookings")
      .then(res => res.json())
      .then(data => {
        allBookings = data.filter(b => b.fundiId === fundi.id || b.fundiId === fundi._id);
        applyFilter();
      });
  }

  function loadOpenRequests() {
    openList.innerHTML = "Loading...";
    fetch("https://fundilink-backend-1.onrender.com/api/bookings")
      .then(res => res.json())
      .then(data => {
        const open = data.filter(b => !b.fundiId && b.skill === fundi.skill);
        if (!open.length) {
          openList.innerHTML = "<p>📭 No open requests</p>";
          return;
        }

        openList.innerHTML = "";
        open.forEach(b => {
          const div = document.createElement("div");
          div.className = "job-card";
          div.innerHTML = `
            <h4>${b.clientName}</h4>
            <p><strong>Location:</strong> ${b.location}</p>
            <p><strong>Message:</strong> ${b.message}</p>
            <button class="claimBtn" data-id="${b._id}" data-phone="${b.phone}">Claim & Pay</button>
          `;
          openList.appendChild(div);
        });

        document.querySelectorAll(".claimBtn").forEach(btn => {
          btn.addEventListener("click", async () => {
            const bookingId = btn.dataset.id;
            const phone = btn.dataset.phone;
            const confirmPay = confirm("Pay KES 50 via M-PESA to claim?");

            if (!confirmPay) return;

            try {
              // Step 1: Trigger STK Push
              const stk = await fetch("https://fundilink-backend-1.onrender.com/api/mpesa/stk", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: fundi.phone, amount: 50 })
              });
              const stkRes = await stk.json();
              if (!stk.ok) throw new Error(stkRes.error || "Payment failed");
              alert("📲 M-PESA prompt sent. Complete payment...");

              // Step 2: Claim Booking
              const claim = await fetch(`https://fundilink-backend-1.onrender.com/api/bookings/${bookingId}/claim`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fundiId: fundi._id, paidByFundi: true, claimed: true })
              });

              if (claim.ok) {
                alert("✅ Claimed successfully. Opening WhatsApp...");
                window.open(`https://wa.me/${phone}`, "_blank");
                loadOpenRequests();
              } else {
                alert("❌ Claim failed.");
              }

            } catch (err) {
              console.error("❌ Error:", err);
              alert("❌ Something went wrong. Try again.");
            }
          });
        });
      });
  }

  refreshBtn.addEventListener("click", loadBookings);
  filterSelect.addEventListener("change", applyFilter);
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
  });

  loadBookings();
  loadOpenRequests();
});
