document.addEventListener("DOMContentLoaded", function () {
  const userTypeSelect = document.getElementById("userType");
  const fundiFields = document.getElementById("fundiFields");
  const registerForm = document.getElementById("registerForm");
  const togglePassword = document.getElementById("togglePassword");

  userTypeSelect.addEventListener("change", function () {
    const isFundi = this.value === "fundi";
    fundiFields.style.display = isFundi ? "block" : "none";

    // Toggle required fields
    document.getElementById("skill").required = isFundi;
    document.getElementById("price").required = isFundi;
    document.getElementById("description").required = isFundi;
  });

  togglePassword.addEventListener("change", function () {
    const type = this.checked ? "text" : "password";
    document.getElementById("password").type = type;
    document.getElementById("confirmPassword").type = type;
  });

  registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(registerForm);
    const userType = formData.get("userType");
    const password = formData.get("password").trim();
    const confirmPassword = formData.get("confirmPassword").trim();
    const file = document.getElementById("photo").files[0];
    const submitBtn = registerForm.querySelector("button[type='submit']");

    if (password !== confirmPassword) {
      return alert("❌ Passwords do not match.");
    }

    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!strongPassword.test(password)) {
      return alert("❌ Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.");
    }

    if (file && file.size > 1024 * 1024) {
      return alert("❌ Profile picture must be less than 1MB.");
    }

    let endpoint = "";
    if (userType === "fundi") {
      endpoint = "https://fundilink-backend-1.onrender.com/api/fundis";
    } else if (userType === "client") {
      endpoint = "https://fundilink-backend-1.onrender.com/api/clients";
    } else {
      return alert("❌ Please select a valid user type.");
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Registering...";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("✅ Registration successful! You can now log in.");
        registerForm.reset();
        window.location.href = "login.html";
      } else {
        const contentType = response.headers.get("content-type");
        let errorMessage = "❌ Registration failed. Please check your inputs.";
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          errorMessage = data.error || errorMessage;
        }
        alert(errorMessage);
      }
    } catch (err) {
      console.error("❌ Network error:", err);
      alert("❌ Failed to connect to server.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Register Now";
    }
  });
});
