import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { collection, addDoc, getDocs, updateDoc, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const loginSection = document.getElementById("login-section");
const productSection = document.getElementById("product-section");
const settingsSection = document.getElementById("settings-section");

document.getElementById("login-btn").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    loginSection.style.display = "none";
    productSection.style.display = "block";
    settingsSection.style.display = "block";
    loadProducts();
  } catch (error) {
    alert(error.message);
  }
});

document.getElementById("add-product-btn").addEventListener("click", async () => {
  const name = document.getElementById("product-name").value;
  const price = document.getElementById("product-price").value;
  const image = document.getElementById("product-image").value;
  await addDoc(collection(db, "products"), { name, price, image });
  alert("Product added!");
  loadProducts();
});

document.getElementById("update-site-btn").addEventListener("click", async () => {
  const siteName = document.getElementById("site-name").value;
  await setDoc(doc(db, "settings", "site"), { name: siteName });
  alert("Site name updated!");
});

async function loadProducts() {
  const productListAdmin = document.getElementById("product-list-admin");
  productListAdmin.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "products"));
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const div = document.createElement("div");
    div.innerHTML = `${data.name} - $${data.price}`;
    productListAdmin.appendChild(div);
  });
}
