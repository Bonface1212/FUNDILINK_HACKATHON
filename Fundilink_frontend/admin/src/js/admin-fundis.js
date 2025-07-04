const BASE_URL = 'https://fundilink-backend-1.onrender.com';
    const fundiList = document.getElementById('fundiList');

    async function loadFundis() {
      try {
        const response = await fetch(`${BASE_URL}/api/fundis`);
        const fundis = await response.json();
        if (fundis.length === 0) {
          fundiList.innerHTML = '<p>No fundis registered yet.</p>';
          return;
        }
        fundis.forEach(fundi => {
          const card = document.createElement('div');
          card.classList.add('card');
          card.innerHTML = `
            <h3>${fundi.name}</h3>
            <p><strong>Skill:</strong> ${fundi.skill}</p>
            <p><strong>Phone:</strong> ${fundi.phone}</p>
            <p><strong>Location:</strong> ${fundi.location}</p>
            <p><strong>Rate:</strong> KES ${fundi.price}</p>
            <p><strong>Description:</strong> ${fundi.description}</p>
          `;
          fundiList.appendChild(card);
        });
      } catch (error) {
        fundiList.innerHTML = '<p>Error loading fundis.</p>';
      }
    }
    document.addEventListener('DOMContentLoaded', loadFundis);
  