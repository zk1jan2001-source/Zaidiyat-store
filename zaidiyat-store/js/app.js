// ===== GOOGLE SHEETS CONFIG =====
// اپنی Google Sheet ID یہاں ڈالیں
const SHEET_ID = '1Ma-VswmslDojYvRgKbCN2-hGkdXApKXPMr7UU0kJeBE';
const SHEET_NAME = 'Products';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;

const WHATSAPP_NUMBER = '923199988744';

// ===== LOAD PRODUCTS FROM GOOGLE SHEETS =====
let PRODUCTS = [];

async function loadProducts() {
  try {
    const res = await fetch(SHEET_URL);
    const text = await res.text();
    const json = JSON.parse(text.substring(47, text.length - 2));
    const rows = json.table.rows;

    PRODUCTS = rows.map((row, index) => {
      const c = row.c;
      return {
        id: index + 1,
        name: c[0]?.v || '',
        category: (c[1]?.v || 'other').toLowerCase(),
        price: parseInt(c[2]?.v) || 0,
        oldPrice: parseInt(c[3]?.v) || 0,
        emoji: c[4]?.v || '📦',
        rating: parseFloat(c[5]?.v) || 4.5,
        reviews: parseInt(c[6]?.v) || 0,
        badge: c[7]?.v || '',
        desc: c[8]?.v || '',
      };
    }).filter(p => p.name); // خالی rows ہٹائیں

    return PRODUCTS;
  } catch (err) {
    console.error('Sheets load error:', err);
    // Fallback products اگر Sheets نہ کھلے
    PRODUCTS = [
      { id: 1, name: 'Wireless Earbuds Pro', category: 'electronics', price: 2999, oldPrice: 4500, emoji: '🎧', rating: 4.5, reviews: 124, badge: 'sale', desc: 'High quality wireless earbuds.' },
      { id: 2, name: 'Smart Watch Series 5', category: 'electronics', price: 5499, oldPrice: 8000, emoji: '⌚', rating: 4.8, reviews: 89, badge: 'hot', desc: 'Feature-rich smartwatch.' },
      { id: 3, name: 'Phone Stand Holder', category: 'accessories', price: 799, oldPrice: 1200, emoji: '📱', rating: 4.3, reviews: 210, badge: 'new', desc: 'Adjustable phone stand.' },
    ];
    return PRODUCTS;
  }
}

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
  window.location.href = '../login.html';
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

// ===== SEARCH =====
function filterProducts(query, category) {
  return PRODUCTS.filter(p => {
    const matchQ = !query || p.name.toLowerCase().includes(query.toLowerCase());
    const matchC = !category || category === 'all' || p.category === category;
    return matchQ && matchC;
  });
}

// ===== NAV =====
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
