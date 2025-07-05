const BASE_URL = 'https://fundilink-backend-1.onrender.com';

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const identifierInput = document.getElementById("identifier");
  const passwordInput = document.getElementById("password");
  const userTypeInput = document.getElementById("userType");
  const msgBox = document.getElementById("responseMsg");
  const togglePassword = document.getElementById("togglePassword");

  // ✅ Toggle show/hide password
  togglePassword.addEventListener("change", () => {
    passwordInput.type = togglePassword.checked ? "text" : "password";
  });

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const identifier = identifierInput.value.trim();
    const password = passwordInput.value.trim();
    const userType = userTypeInput.value;

    if (!identifier || !password || !userType) {
      msgBox.textContent = "❌ Please fill in all fields.";
      msgBox.style.color = "red";
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password })
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("❌ Server returned non-JSON response");
      }

      const data = await res.json();

      if (res.ok) {
        const role = data.user.role;

        // ✅ Save a consistent key: "user"
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("userType", role);

        msgBox.textContent = "✅ Login successful! Redirecting...";
        msgBox.style.color = "green";

        setTimeout(() => {
          if (role === "fundi") {
            window.location.href = "fundi-dashboard.html";
          } else {
            window.location.href = "index.html";
          }
        }, 1500);
      } else {
        msgBox.textContent = `❌ ${data.error || "Login failed."}`;
        msgBox.style.color = "red";
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      msgBox.textContent = "❌ An error occurred. Please try again.";
      msgBox.style.color = "red";
    }
  });
});
