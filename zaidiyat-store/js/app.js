// ===== DATA =====
const PRODUCTS = [
  { id: 1, name: 'Wireless Earbuds Pro', category: 'electronics', price: 2999, oldPrice: 4500, emoji: '🎧', rating: 4.5, reviews: 124, badge: 'sale', desc: 'High quality wireless earbuds with noise cancellation, 24hr battery life.' },
  { id: 2, name: 'Smart Watch Series 5', category: 'electronics', price: 5499, oldPrice: 8000, emoji: '⌚', rating: 4.8, reviews: 89, badge: 'hot', desc: 'Feature-rich smartwatch with heart rate monitor, step counter, and notifications.' },
  { id: 3, name: 'Phone Stand Holder', category: 'accessories', price: 799, oldPrice: 1200, emoji: '📱', rating: 4.3, reviews: 210, badge: 'new', desc: 'Adjustable phone stand for desk, perfect for video calls and streaming.' },
  { id: 4, name: 'USB-C Fast Charger', category: 'electronics', price: 1299, oldPrice: 2000, emoji: '🔌', rating: 4.6, reviews: 315, badge: 'sale', desc: 'Fast charging 65W USB-C charger compatible with all major devices.' },
  { id: 5, name: 'Portable Power Bank', category: 'electronics', price: 3499, oldPrice: 5000, emoji: '🔋', rating: 4.7, reviews: 178, badge: '', desc: '20000mAh power bank with dual USB ports and fast charging.' },
  { id: 6, name: 'LED Desk Lamp', category: 'home', price: 1899, oldPrice: 2500, emoji: '💡', rating: 4.4, reviews: 93, badge: 'new', desc: 'Eye-friendly LED desk lamp with 3 brightness levels and USB charging port.' },
  { id: 7, name: 'Silicone Phone Case', category: 'accessories', price: 499, oldPrice: 800, emoji: '📲', rating: 4.2, reviews: 456, badge: '', desc: 'Protective silicone case available for all iPhone and Samsung models.' },
  { id: 8, name: 'Bluetooth Speaker', category: 'electronics', price: 4299, oldPrice: 6000, emoji: '🔊', rating: 4.9, reviews: 67, badge: 'hot', desc: 'Waterproof bluetooth speaker with 360° surround sound and 12hr battery.' },
  { id: 9, name: 'Kitchen Knife Set', category: 'home', price: 2199, oldPrice: 3500, emoji: '🔪', rating: 4.5, reviews: 88, badge: '', desc: 'Professional 5-piece stainless steel kitchen knife set with wooden block.' },
  { id: 10, name: 'Yoga Mat Premium', category: 'sports', price: 1599, oldPrice: 2200, emoji: '🧘', rating: 4.6, reviews: 142, badge: 'sale', desc: 'Non-slip premium yoga mat, 6mm thickness, ideal for all exercises.' },
  { id: 11, name: 'Running Shoes', category: 'sports', price: 4999, oldPrice: 7000, emoji: '👟', rating: 4.8, reviews: 203, badge: 'hot', desc: 'Lightweight breathable running shoes with cushioned sole.' },
  { id: 12, name: 'Backpack Travel Bag', category: 'accessories', price: 3299, oldPrice: 4500, emoji: '🎒', rating: 4.7, reviews: 175, badge: '', desc: '35L waterproof travel backpack with laptop compartment and USB port.' },
];

const WHATSAPP_NUMBER = '923001234567';

// ===== CART =====
function getCart() {
  return JSON.parse(localStorage.getItem('zaid_cart') || '[]');
}
function saveCart(cart) {
  localStorage.setItem('zaid_cart', JSON.stringify(cart));
  updateCartCount();
}
function addToCart(productId) {
  const cart = getCart();
  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.qty++;
  } else {
    const product = PRODUCTS.find(p => p.id === productId);
    if (product) cart.push({ ...product, qty: 1 });
  }
  saveCart(cart);
  showToast('✅ کارٹ میں شامل ہو گیا!');
}
function removeFromCart(productId) {
  const cart = getCart().filter(i => i.id !== productId);
  saveCart(cart);
  renderCart();
}
function updateQty(productId, change) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.qty = Math.max(1, item.qty + change);
    saveCart(cart);
    renderCart();
  }
}
function updateCartCount() {
  const count = getCart().reduce((t, i) => t + i.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
}
function getCartTotal() {
  return getCart().reduce((t, i) => t + i.price * i.qty, 0);
}

// ===== AUTH =====
function getUsers() { return JSON.parse(localStorage.getItem('zaid_users') || '[]'); }
function saveUsers(users) { localStorage.setItem('zaid_users', JSON.stringify(users)); }
function getCurrentUser() { return JSON.parse(localStorage.getItem('zaid_user') || 'null'); }
function setCurrentUser(user) { localStorage.setItem('zaid_user', JSON.stringify(user)); }
function logout() {
  localStorage.removeItem('zaid_user');
  window.location.href = 'login.html';
}

// ===== ORDERS =====
function getOrders() { return JSON.parse(localStorage.getItem('zaid_orders') || '[]'); }
function saveOrder(order) {
  const orders = getOrders();
  orders.unshift(order);
  localStorage.setItem('zaid_orders', JSON.stringify(orders));
}

// ===== UI HELPERS =====
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}
function stars(rating) {
  const full = Math.floor(rating);
  let s = '';
  for (let i = 0; i < full; i++) s += '⭐';
  return s + ` (${rating})`;
}
function formatPrice(p) { return 'Rs. ' + p.toLocaleString(); }

// ===== PRODUCTS RENDER =====
function productCard(p) {
  const badgeHtml = p.badge ? `<div class="badge ${p.badge === 'new' ? 'new' : ''}">${p.badge.toUpperCase()}</div>` : '';
  return `
    <div class="product-card" onclick="viewProduct(${p.id})">
      <div class="product-img">${p.emoji}${badgeHtml}</div>
      <div class="product-info">
        <div class="product-category">${p.category}</div>
        <h3>${p.name}</h3>
        <div class="stars">${stars(p.rating)} · ${p.reviews} reviews</div>
        <div class="price-row">
          <span class="price">${formatPrice(p.price)}</span>
          ${p.oldPrice ? `<span class="price-old">${formatPrice(p.oldPrice)}</span>` : ''}
        </div>
        <button class="btn-cart" onclick="event.stopPropagation(); addToCart(${p.id})">🛒 کارٹ میں شامل کریں</button>
      </div>
    </div>`;
}
function viewProduct(id) {
  localStorage.setItem('zaid_view_product', id);
  window.location.href = 'product-details.html';
}

// ===== CART RENDER =====
function renderCart() {
  const container = document.getElementById('cart-items');
  const emptyState = document.getElementById('cart-empty');
  const cartContent = document.getElementById('cart-content');
  if (!container) return;

  const cart = getCart();
  if (cart.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    if (cartContent) cartContent.style.display = 'none';
    return;
  }
  if (emptyState) emptyState.style.display = 'none';
  if (cartContent) cartContent.style.display = 'grid';

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">${item.emoji}</div>
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <div class="cart-item-price">${formatPrice(item.price)}</div>
        <div class="qty-control">
          <button class="qty-btn" onclick="updateQty(${item.id}, -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
        </div>
        <span class="cart-remove" onclick="removeFromCart(${item.id})">🗑️ ہٹائیں</span>
      </div>
      <div style="font-weight:800; color:var(--green)">${formatPrice(item.price * item.qty)}</div>
    </div>`).join('');

  const total = getCartTotal();
  const shipping = total > 3000 ? 0 : 200;
  document.getElementById('cart-subtotal').textContent = formatPrice(total);
  document.getElementById('cart-shipping').textContent = shipping === 0 ? 'مفت' : formatPrice(shipping);
  document.getElementById('cart-total').textContent = formatPrice(total + shipping);

  const orderText = cart.map(i => `${i.name} x${i.qty} = ${formatPrice(i.price * i.qty)}`).join('%0A');
  const waLink = document.getElementById('wa-link');
  if (waLink) waLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=السلام علیکم!%0Aمیں یہ آرڈر کرنا چاہتا ہوں:%0A${orderText}%0A%0Aکل: ${formatPrice(total + shipping)}`;
}

// ===== WHATSAPP ORDER =====
function orderOnWhatsApp() {
  const cart = getCart();
  if (cart.length === 0) { showToast('⚠️ کارٹ خالی ہے!'); return; }
  const total = getCartTotal();
  const orderText = cart.map(i => `${i.name} x${i.qty} = ${formatPrice(i.price * i.qty)}`).join('%0A');
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=السلام علیکم!%0Aمیرا آرڈر:%0A${orderText}%0A%0Aکل رقم: ${formatPrice(total)}`, '_blank');
}

// ===== SEARCH =====
function filterProducts(query, category) {
  return PRODUCTS.filter(p => {
    const matchQ = !query || p.name.toLowerCase().includes(query.toLowerCase());
    const matchC = !category || category === 'all' || p.category === category;
    return matchQ && matchC;
  });
}

// ===== HAMBURGER NAV =====
function initNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
  }
  updateCartCount();

  const user = getCurrentUser();
  const loginLink = document.getElementById('login-link');
  const userGreet = document.getElementById('user-greet');
  if (user && loginLink) loginLink.style.display = 'none';
  if (user && userGreet) { userGreet.textContent = `👋 ${user.name}`; userGreet.style.display = 'inline'; }
}

document.addEventListener('DOMContentLoaded', initNav);
