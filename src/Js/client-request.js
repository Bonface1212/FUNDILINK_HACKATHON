document.getElementById("openRequestForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    clientName: e.target.clientName.value.trim(),
    phone: e.target.clientPhone.value.trim(),
    location: e.target.location.value.trim(),
    message: e.target.message.value.trim(),
    skill: e.target.skill.value,
    date: new Date().toISOString(),  // ✅ Add current date
    fundiId: null,
    paidByFundi: false,
    claimed: false
  };

  try {
    const res = await fetch("https://fundilink-backend-1.onrender.com/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Failed to send request");

    alert("✅ Request sent! A fundi will contact you soon.");
    e.target.reset();
  } catch (err) {
    console.error("❌ Error:", err);
    alert("❌ Something went wrong. Please try again.");
  }
});
