document.addEventListener("DOMContentLoaded", function() {
  const userTypeSelect = document.getElementById("userType");
  const fundiFields = document.getElementById("fundiFields");
  const skill = document.getElementById("skill");
  const price = document.getElementById("price");
  const description = document.getElementById("description");
  const registerForm = document.getElementById("registerForm");

  // Show/hide Fundi fields
  userTypeSelect.addEventListener("change", function() {
    if (this.value === "fundi") {
      fundiFields.style.display = "block";
      skill.required = true;
      price.required = true;
      description.required = true;
    } else {
      fundiFields.style.display = "none";
      skill.required = false;
      price.required = false;
      description.required = false;
    }
  });

  registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(registerForm);
    const userType = userTypeSelect.value;
    const file = document.getElementById("photo").files[0];

    // Validate file size
    if (file && file.size > 1024 * 1024) {
      alert("Profile picture must be less than 1MB.");
      return;
    }

    // Show loading state
    const submitBtn = registerForm.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.textContent = "Registering...";

    // Choose endpoint based on user type
    let endpoint = "";
    if (userType === "fundi") {
      endpoint = "https://fundilink-backend-1.onrender.com/api/fundis";
    } else if (userType === "client") {
      endpoint = "https://fundilink-backend-1.onrender.com/api/clients";
    } else {
      alert("Please select user type.");
      submitBtn.disabled = false;
      submitBtn.textContent = "Register Now";
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Registration successful! You can now log in.");
        registerForm.reset();
        window.location.href = "login.html";
      } else {
        const errorData = await response.json();
        alert("Registration failed: " + (errorData.message || "Please check your details."));
      }
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred while registering.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Register Now";
    }
  });
});
