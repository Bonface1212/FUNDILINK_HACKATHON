document.addEventListener("DOMContentLoaded", () => {
  const bookNowButtons = document.querySelectorAll(".book-now-btn");

  bookNowButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const fundiCard = btn.closest(".fundi-card");

      // ✅ Extract data safely
      const name = fundiCard.querySelector(".fundi-name")?.innerText || "Unknown";
      const skill = fundiCard.querySelector(".fundi-skill")?.innerText || "Skill";
      const location = fundiCard.querySelector(".fundi-location")?.innerText || "Location";
      const phone = fundiCard.querySelector(".fundi-phone")?.innerText || "0700000000";

      const fundiObject = { name, skill, location, phone };

      const bookingInfo = {
        fundi: fundiObject,
        clientName: "",           // Optional: Can collect later
        clientMessage: `I'm interested in your ${skill} services.`,
        bookingDate: new Date().toISOString().split("T")[0]
      };

      // ✅ Store in localStorage
      localStorage.setItem("selectedFundi", JSON.stringify(fundiObject));
      localStorage.setItem("bookingInfo", JSON.stringify(bookingInfo));

      // ✅ Redirect to payment page
      window.location.href = "payment.html";
    });
  });
});
