document.addEventListener("DOMContentLoaded", () => {
  const bookNowButtons = document.querySelectorAll(".book-now-btn");
  const modal = document.getElementById("bookingModal");
  const closeModal = document.querySelector(".close-modal");
  const bookingForm = document.getElementById("bookingForm");

  let selectedFundi = {};
document.addEventListener("DOMContentLoaded", () => {
  // Attach to all 'Book Now' buttons inside fundi cards
  document.querySelectorAll(".book-now-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const fundiCard = btn.closest(".fundi-card");

      const fundiObject = {
        name: fundiCard.querySelector(".fundi-name").innerText,
        skill: fundiCard.querySelector(".fundi-skill").innerText,
        location: fundiCard.querySelector(".fundi-location").innerText,
        phone: fundiCard.querySelector(".fundi-phone").innerText
      };

      const bookingMessage = `I'm interested in your ${fundiObject.skill} services.`;

      // ✅ Store data in localStorage
      localStorage.setItem("selectedFundi", JSON.stringify(fundiObject));
      localStorage.setItem("bookingMessage", bookingMessage);

      // ✅ Redirect to payment page
      window.location.href = "payment.html";
    });
  });
});

  // Open modal when "Book Now" is clicked
  bookNowButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      selectedFundi = {
        name: btn.getAttribute("data-name"),
        phone: btn.getAttribute("data-phone"),
        skill: btn.getAttribute("data-skill"),
        location: btn.getAttribute("data-location"),
      };
      modal.style.display = "block";
    });
  });

  // Close modal
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Submit booking
  bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const clientName = document.getElementById("clientName").value;
    const clientPhone = document.getElementById("clientPhone").value;
    const bookingMessage = document.getElementById("bookingMessage").value;

    // Save booking to backend (optional logging)
    await fetch("https://fundilink-backend-1.onrender.com/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientName,
        clientPhone,
        message: bookingMessage,
        fundi: selectedFundi,
      }),
    });

    // M-Pesa STK Push Payment
    const mpesaResponse = await fetch("https://fundilink-backend-1.onrender.com/api/mpesa/stk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: 50,
        phone: clientPhone
      }),
    });

    const result = await mpesaResponse.json();
    if (mpesaResponse.ok) {
      alert("📲 M-Pesa STK Push sent! Complete payment on your phone.");
      // Wait for payment completion (you could poll backend or add delay)
      setTimeout(() => {
        const whatsappUrl = `https://wa.me/${selectedFundi.phone.replace(/^0/, "254")}?text=${encodeURIComponent(
          `Hi ${selectedFundi.name}, I’m ${clientName}. I saw your ${selectedFundi.skill} services on FundiLink. ${bookingMessage}`
        )}`;
        window.location.href = whatsappUrl;
      }, 8000); // 8 seconds wait
    } else {
      alert("❌ Payment failed: " + (result.errorMessage || "Unknown error"));
    }
    modal.style.display = "none";
  });
});
