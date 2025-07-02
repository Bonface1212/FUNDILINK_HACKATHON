document.getElementById('fundiForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const form = e.target;
  const fundiData = {
    name: form.name.value,
    phone: form.phone.value,
    skill: form.skill.value,
    location: form.location.value,
    price: form.price.value,
    description: form.description.value,
  };

  try {
    // 🚀 Send the form data to your backend API
    const response = await fetch("https://fundilink-backend-1.onrender.com/api/fundis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(fundiData)
    });

    if (response.ok) {
      document.getElementById("responseMsg").innerText = "✅ Registration successful!";
      form.reset();
    } else {
      const err = await response.json();
      document.getElementById("responseMsg").innerText = `❌ Error: ${err.error}`;
    }
  } catch (err) {
    console.error(err);
    document.getElementById("responseMsg").innerText = "❌ Failed to connect to server.";
  }
});
