document.addEventListener("DOMContentLoaded", () => {
  const fundiDetailsDiv = document.getElementById("fundiDetails");
  const paymentForm = document.getElementById("paymentForm");
  const statusDiv = document.getElementById("status");
  const sendWhatsappBtn = document.getElementById("sendWhatsappBtn");

  // Load booking info from localStorage
  const bookingInfo = JSON.parse(localStorage.getItem("bookingInfo") || "{}");
  const fundi = bookingInfo.fundi;

  if (!fundi) {
    fundiDetailsDiv.innerHTML = "<p>Error: No fundi selected.</p>";
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
    sendWhatsappBtn.style.display = "none";

    try {
      const res = await fetch("https://fundilink-backend-1.onrender.com/api/mpesa/stk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, phone })
      });

      const data = await res.json();

      if (res.ok) {
        statusDiv.innerText = "✅ STK Push sent! Complete payment on your phone.";
        // Show WhatsApp button after payment
        setTimeout(() => {
          sendWhatsappBtn.style.display = "inline-block";
        }, 8000); // 8 seconds for user to complete payment
      } else {
        statusDiv.innerText = `❌ Payment failed: ${data.errorMessage || data.error || "Unknown error"}`;
      }
    } catch (err) {
      statusDiv.innerText = "❌ Payment request error. Check connection.";
      console.error("Payment Error:", err);
    }
  });

  sendWhatsappBtn.addEventListener("click", () => {
    if (bookingInfo && bookingInfo.fundi && bookingInfo.clientName && bookingInfo.bookingDate && bookingInfo.clientMessage) {
      const { fundi, clientName, bookingDate, clientMessage } = bookingInfo;
      const message = `Hello ${fundi.name}, I am ${clientName} and I'd like to book you as a ${fundi.skill} on ${bookingDate}. Message: ${clientMessage}`;
      const whatsappLink = `https://wa.me/${fundi.phone.replace(/^0/, '254')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappLink, "_blank"); // Open WhatsApp in a new tab
      window.location.href = "index.html"; // Redirect to home page
    } else {
      alert("Booking info missing.");
    }
  });
});
