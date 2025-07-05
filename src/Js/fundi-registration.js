document.getElementById('fundiForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  try {
    const response = await fetch('https://fundilink-backend-1.onrender.com/api/fundis', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    const responseMsg = document.getElementById('responseMsg');
    if (response.ok) {
      responseMsg.textContent = "✅ Fundi registered successfully!";
      form.reset();
    } else {
      responseMsg.textContent = "❌ " + (result.error || "Registration failed.");
    }
  } catch (error) {
    document.getElementById('responseMsg').textContent = "❌ Error occurred while submitting form.";
    console.error(error);
  }
});
