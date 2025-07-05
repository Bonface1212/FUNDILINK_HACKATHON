const BASE_URL = 'https://fundilink-backend-1.onrender.com';
const fundiList = document.getElementById('fundiList');
const refreshBtn = document.getElementById('refreshFundis');

async function loadFundis() {
  fundiList.innerHTML = "⏳ Loading...";
  try {
    const res = await fetch(`${BASE_URL}/api/fundis`);
    const fundis = await res.json();
    fundiList.innerHTML = "";

    if (!fundis.length) {
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
  <div class="admin-actions">
    <button class="edit-btn" data-id="${fundi._id}">✏️ Edit</button>
    <button class="delete-btn" data-id="${fundi._id}">🗑️ Delete</button>
  </div>
`;

      fundiList.appendChild(card);
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const confirmDelete = confirm("Are you sure you want to delete this fundi?");
        if (!confirmDelete) return;
        try {
          const delRes = await fetch(`${BASE_URL}/api/fundis/${id}`, { method: 'DELETE' });
          if (delRes.ok) {
            alert("✅ Fundi deleted successfully");
            loadFundis();
          } else {
            alert("❌ Failed to delete fundi");
          }
        } catch (err) {
          alert("❌ Error deleting fundi");
        }
      });
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.id;
    const fundi = fundis.find(f => f._id === id);
    const name = prompt("Edit name:", fundi.name);
    const price = prompt("Edit rate:", fundi.price);

    if (name && price) {
      fetch(`${BASE_URL}/api/fundis/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price })
      })
      .then(res => {
        if (res.ok) {
          alert("✅ Updated!");
          loadFundis();
        } else {
          alert("❌ Failed to update");
        }
      });
    }
  });
});


  } catch (error) {
    fundiList.innerHTML = '<p>❌ Error loading fundis.</p>';
    console.error("Error:", error);
  }
}

document.addEventListener('DOMContentLoaded', loadFundis);
refreshBtn.addEventListener('click', loadFundis);
