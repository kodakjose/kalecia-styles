import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, serverTimestamp, query, orderBy, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBrLc_-Wx-O_fNHMSs3DVlJZEzg4uB1Aag",
  authDomain: "kalecia-styles-cc166.firebaseapp.com",
  projectId: "kalecia-styles-cc166",
  storageBucket: "kalecia-styles-cc166.firebasestorage.app",
  messagingSenderId: "198539229477",
  appId: "1:198539229477:web:8281acf3088a0b8cf082cc",
  measurementId: "G-RT9SDM3Q6Y"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage(app);
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentUser = null;

function showProducts() {
  hideAllSections();
  document.getElementById('products-section').style.display = 'block';
}

function showCart() {
  hideAllSections();
  document.getElementById('cart-section').style.display = 'block';
  const container = document.getElementById("cart-items");
  container.innerHTML = "";
  let total = 0;
  cart.forEach((item) => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `<span>${item.name}</span><span>$${item.price.toFixed(2)}</span>`;
    container.appendChild(div);
    total += item.price;
  });
  document.getElementById("cart-total").innerText = total.toFixed(2);
}

function hideAllSections() {
  document.querySelectorAll('section').forEach(sec => sec.style.display = 'none');
}

function addToCart(item) {
  cart.push(item);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  alert(`${item.name} added to cart.`);
}

function updateCartCount() {
  document.getElementById('cart-count').innerText = cart.length;
}

function checkout() {
  if (!currentUser) return alert("Please log in to place an order.");
  addDoc(collection(db, "orders"), {
    userId: currentUser.email,
    items: cart,
    status: "pending",
    timestamp: serverTimestamp()
  }).then(() => {
    alert("Order placed!");
    cart = [];
    localStorage.removeItem('cart');
    updateCartCount();
    showProducts();
  });
}

function showOrders() {
  hideAllSections();
  document.getElementById('orders-section').style.display = 'block';
  const ordersQuery = query(collection(db, "orders"), orderBy("timestamp", "desc"));
  getDocs(ordersQuery).then(snapshot => {
    const container = document.getElementById("orders-list");
    container.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      const div = document.createElement("div");
      div.innerHTML = `<p><strong>User:</strong> ${data.userId}<br><strong>Items:</strong> ${data.items.map(i => i.name).join(", ")}<br><strong>Total:</strong> $${data.items.reduce((sum, i) => sum + i.price, 0).toFixed(2)}<br><strong>Status:</strong> ${data.status}</p><hr>`;
      container.appendChild(div);
    });
  });
}

async function uploadProduct() {
  const name = document.getElementById("product-name").value.trim();
  const price = parseFloat(document.getElementById("product-price").value);
  const imageFile = document.getElementById("product-image").files[0];

  if (!name || !price || !imageFile) {
    alert("Please fill in all fields.");
    return;
  }

  const storageRef = ref(storage, `products/${Date.now()}-${imageFile.name}`);
  await uploadBytes(storageRef, imageFile);
  const imageUrl = await getDownloadURL(storageRef);

  await addDoc(collection(db, "products"), {
    name,
    price,
    imageUrl,
    timestamp: serverTimestamp()
  });

  alert("Product uploaded!");
  document.getElementById("product-name").value = "";
  document.getElementById("product-price").value = "";
  document.getElementById("product-image").value = "";
  loadProducts();
}

async function loadProducts() {
  const container = document.getElementById("product-list");
  container.innerHTML = "";
  const snapshot = await getDocs(collection(db, "products"));
  snapshot.forEach(doc => {
    const data = doc.data();
    const div = document.createElement("div");
    div.className = "product-card";
    div.innerHTML = `
      <img src="${data.imageUrl}" alt="${data.name}">
      <h4>${data.name}</h4>
      <p>$${data.price.toFixed(2)}</p>
      <button onclick='addToCart({ name: "${data.name}", price: ${data.price} })'>Add to Cart</button>
    `;
    container.appendChild(div);
  });
}

function register() {
  const email = document.getElementById('email').value;
  const pass = document.getElementById('password').value;
  createUserWithEmailAndPassword(auth, email, pass)
    .then(() => alert("Registered successfully"))
    .catch(error => alert(error.message));
}

function login() {
  const email = document.getElementById('email').value;
  const pass = document.getElementById('password').value;
  signInWithEmailAndPassword(auth, email, pass)
    .then(() => alert("Logged in"))
    .catch(error => alert(error.message));
}

function logout() {
  signOut(auth).then(() => alert("Logged out"));
}

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    document.getElementById('auth-section').style.display = 'none';
    try {
      const roleDoc = await getDoc(doc(db, "roles", user.email));
      if (roleDoc.exists() && roleDoc.data().role === "admin") {
        document.getElementById('admin-orders-btn').style.display = 'inline-block';
        document.getElementById('upload-section').style.display = 'block';
      }
    } catch (error) {
      console.error("Role check failed:", error);
    }
  } else {
    currentUser = null;
    document.getElementById('auth-section').style.display = 'block';
    document.getElementById('admin-orders-btn').style.display = 'none';
    document.getElementById('upload-section').style.display = 'none';
  }
});

window.onload = () => {
  updateCartCount();
  showProducts();
  loadProducts();
};
