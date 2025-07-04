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
        clients.forEach(client => {
          const card = document.createElement('div');
          card.classList.add('card');
          card.innerHTML = `
            <h3>${client.name}</h3>
            <p><strong>Username:</strong> ${client.username}</p>
            <p><strong>Email:</strong> ${client.email}</p>
            <p><strong>Phone:</strong> ${client.phone}</p>
            <p><strong>Location:</strong> ${client.location}</p>
          `;
          clientList.appendChild(card);
        });
      } catch (error) {
        clientList.innerHTML = '<p>Error loading clients.</p>';
      }
    }
    document.addEventListener('DOMContentLoaded', loadClients);
  