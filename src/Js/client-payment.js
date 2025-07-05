document.addEventListener("DOMContentLoaded", () => {
  const fundiDetailsDiv = document.getElementById("fundiDetails");
  const paymentForm = document.getElementById("paymentForm");
  const statusDiv = document.getElementById("status");
  const sendWhatsappBtn = document.getElementById("sendWhatsappBtn");

  const bookingInfo = JSON.parse(localStorage.getItem("bookingInfo") || "{}");
  const fundi = bookingInfo.fundi;

  if (!fundi) {
    fundiDetailsDiv.innerHTML = "<p>❌ Error: No fundi selected.</p>";
    paymentForm.style.display = "none";
    return;
  }

  fundiDetailsDiv.innerHTML = `
    <p><strong>Fundi Name:</strong> ${fundi.name}</p>
    <p><strong>Skill:</strong> ${fundi.skill}</p>
    <p><strong>Location:</strong> ${fundi.location}</p>
    <p><strong>Phone:</strong> ${fundi.phone}</p>
  `;

  paymentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const phone = document.getElementById("clientPhone").value.trim();
    const amount = document.getElementById("paymentAmount").value.trim();

    if (!phone || !amount) {
      statusDiv.innerText = "❌ Please enter your phone and amount.";
      return;
    }

    statusDiv.innerText = "📲 Sending M-Pesa STK Push...";

    try {
      const res = await fetch("https://fundilink-backend-1.onrender.com/api/mpesa/stk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, phone })
      });

      const data = await res.json();

      if (res.ok) {
        statusDiv.innerText = "✅ STK Push sent! Complete payment on your phone.";
        setTimeout(() => {
          sendWhatsappBtn.style.display = "inline-block";
        }, 8000);
      } else {
        statusDiv.innerText = `❌ Payment failed: ${data.errorMessage || "Unknown error"}`;
      }
    } catch (err) {
      console.error("Payment error:", err);
      statusDiv.innerText = "❌ Network error.";
    }
  });

  sendWhatsappBtn.addEventListener("click", () => {
    const { fundi, clientName, bookingDate, clientMessage } = bookingInfo;
    const whatsappLink = `https://wa.me/${fundi.phone.replace(/^0/, '254')}?text=${encodeURIComponent(
      `Hello ${fundi.name}, I am ${clientName}. I want to hire you for ${fundi.skill} on ${bookingDate}. Message: ${clientMessage}`
    )}`;
    window.open(whatsappLink, "_blank");

    // ✅ Clear session after booking
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
    localStorage.removeItem("bookingInfo");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);
  });
});
