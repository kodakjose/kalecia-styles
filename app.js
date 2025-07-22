
// Simulate cart functionality
let cart = [];

function addToCart(productName, price) {
  cart.push({ name: productName, price });
  alert(`${productName} added to cart!`);
  updateCartCount();
}

function updateCartCount() {
  const countElement = document.getElementById("cart-count");
  if (countElement) {
    countElement.innerText = cart.length;
  }
}

window.onload = () => {
  updateCartCount();
};
