import { db } from './firebase-config.js';
import { collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const productList = document.getElementById("product-list");
const businessNameEl = document.getElementById("business-name");

async function loadSettings() {
  const docRef = doc(db, "settings", "site");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    businessNameEl.textContent = docSnap.data().name;
    document.title = docSnap.data().name;
  }
}

async function loadProducts() {
  const querySnapshot = await getDocs(collection(db, "products"));
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
      <img src="${data.image}" style="width:100%; height:150px; object-fit:cover;">
      <h3>${data.name}</h3>
      <p>$${data.price}</p>
      <button>Add to Cart</button>
    `;
    productList.appendChild(card);
  });
}

loadSettings();
loadProducts();
