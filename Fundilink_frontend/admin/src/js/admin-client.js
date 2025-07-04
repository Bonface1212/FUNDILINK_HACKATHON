const BASE_URL = 'https://fundilink-backend-1.onrender.com';
const clientList = document.getElementById('clientList');

async function loadClients() {
  try {
    const response = await fetch(`${BASE_URL}/api/clients`);
    const clients = await response.json();

    if (clients.length === 0) {
      clientList.innerHTML = '<p>No clients registered yet.</p>';
      return;
    }

    clientList.innerHTML = ''; // Clear before rendering

    clients.forEach(client => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
        <h3>${client.name}</h3>
        <p><strong>Username:</strong> ${client.username}</p>
        <p><strong>Email:</strong> ${client.email}</p>
        <p><strong>Phone:</strong> ${client.phone}</p>
        <p><strong>Location:</strong> ${client.location}</p>
        <div class="admin-actions">
          <button class="edit-btn" data-id="${client._id}">✏️ Edit</button>
          <button class="delete-btn" data-id="${client._id}">🗑️ Delete</button>
        </div>
      `;
      clientList.appendChild(card);
    });

    attachClientEditHandlers(clients);
    attachClientDeleteHandlers();
  } catch (error) {
    console.error("Error loading clients:", error);
    clientList.innerHTML = '<p>Error loading clients.</p>';
  }
}

function attachClientEditHandlers(clients) {
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const client = clients.find(c => c._id === id);
      if (!client) return;

      const updatedName = prompt("Edit Name:", client.name);
      const updatedPhone = prompt("Edit Phone:", client.phone);
      const updatedLocation = prompt("Edit Location:", client.location);

      if (updatedName && updatedPhone && updatedLocation) {
        fetch(`${BASE_URL}/api/clients/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: updatedName,
            phone: updatedPhone,
            location: updatedLocation
          })
        })
        .then(res => {
          if (res.ok) {
            alert("✅ Client updated successfully.");
            loadClients();
          } else {
            alert("❌ Failed to update client.");
          }
        })
        .catch(err => console.error("Update error:", err));
      }
    });
  });
}

function attachClientDeleteHandlers() {
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const confirmDelete = confirm("Are you sure you want to delete this client?");
      if (!confirmDelete) return;

      fetch(`${BASE_URL}/api/clients/${id}`, {
        method: 'DELETE'
      })
      .then(res => {
        if (res.ok) {
          alert("🗑️ Client deleted.");
          loadClients();
        } else {
          alert("❌ Failed to delete client.");
        }
      })
      .catch(err => console.error("Delete error:", err));
    });
  });
}

document.addEventListener('DOMContentLoaded', loadClients);
