document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const response = await fetch("https://fundilink-backend-1.onrender.com/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  const msgBox = document.getElementById("responseMsg");

  if (response.ok) {
    localStorage.setItem("user", JSON.stringify(data.user));
    msgBox.textContent = "✅ Login successful! Redirecting...";
    msgBox.style.color = "green";
    setTimeout(() => window.location.href = "booking-details.html", 2000);
  } else {
    msgBox.textContent = `❌ ${data.error || "Login failed."}`;
    msgBox.style.color = "red";
  }
});
