document.getElementById("fundiForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  const file = document.getElementById("photo").files[0];
  if (file && file.size > 1024 * 1024) {
    alert("Profile picture must be less than 1MB.");
    return;
  }

  try {
    const response = await fetch("https://fundilink-backend-1.onrender.com/api/fundis", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("Registration successful!");
      form.reset();
    } else {
      const errorData = await response.json();
      alert("Registration failed: " + errorData.message);
    }
  } catch (err) {
    console.error("Error:", err);
    alert("An error occurred while registering.");
  }
});
