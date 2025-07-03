document.addEventListener("DOMContentLoaded", () => {
  const fundiDetailsDiv = document.getElementById("fundiDetails");
  const paymentForm = document.getElementById("paymentForm");
  const statusDiv = document.getElementById("status");

  // Load fundi data from localStorage
  const fundi = JSON.parse(localStorage.getItem("selectedFundi"));
  const bookingMessage = localStorage.getItem("bookingMessage") || "";

  if (!fundi) {
    fundiDetailsDiv.innerHTML = "<p>Error: No fundi selected.</p>";
    return;
  }

  fundiDetailsDiv.innerHTML = `
    <p><strong>Fundi Name:</strong> ${fundi.name}</p>
    <p><strong>Skill:</strong> ${fundi.skill}</p>
    <p><strong>Location:</strong> ${fundi.location}</p>
    <p><strong>Phone:</strong> ${fundi.phone}</p>
  `;

  // Submit payment
  paymentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const phone = document.getElementById("clientPhone").value.trim();

    statusDiv.innerText = "📲 Sending M-Pesa STK Push...";

    try {
      const res = await fetch("https://fundilink-backend-1.onrender.com/api/mpesa/stk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 50, phone })
      });

      const data = await res.json();

      if (res.ok) {
        statusDiv.innerText = "✅ STK Push sent! Complete payment on your phone.";
        // Redirect to WhatsApp after 8 seconds
        setTimeout(() => {
          const whatsappUrl = `https://wa.me/${fundi.phone.replace(/^0/, "254")}?text=${encodeURIComponent(
            `Hi ${fundi.name}, I’m interested in your ${fundi.skill} services. ${bookingMessage}`
          )}`;
          window.location.href = whatsappUrl;
        }, 8000);
      } else {
        statusDiv.innerText = `❌ Payment failed: ${data.errorMessage || "Unknown error"}`;
      }
    } catch (err) {
      statusDiv.innerText = "❌ Payment request error. Check connection.";
      console.error("Payment Error:", err);
    }
  });
});
