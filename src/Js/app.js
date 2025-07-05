document.addEventListener("DOMContentLoaded", () => {
  const fundis = [
    {
      name: "James Mwangi",
      skill: "Plumber",
      location: "Kasarani",
      price: "KES 500/hr",
      contact: "https://wa.me/254796682070",
    },
    {
      name: "Mercy Achieng",
      skill: "Electrician",
      location: "Githurai",
      price: "KES 700/hr",
      contact: "https://wa.me/254796682070",
    },
  ];

  const fundiList = document.getElementById("fundiList");

  fundis.forEach((fundi) => {
    const card = `
      <div class="bg-white rounded-lg shadow p-4">
        <h2 class="text-xl font-semibold">${fundi.name}</h2>
        <p>${fundi.skill} - ${fundi.location}</p>
        <p class="text-green-700 font-bold">${fundi.price}</p>
        <a href="${fundi.contact}" target="_blank" class="mt-2 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Book on WhatsApp
        </a>
      </div>
    `;
    fundiList.innerHTML += card;
  });
});
