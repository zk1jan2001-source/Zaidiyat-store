// ===== TRENDING PRODUCTS DATA =====
const PRODUCTS = [
  { id:1, name:'AirPods Pro Clone', category:'electronics', price:3499, oldPrice:6000, emoji:'🎧', rating:4.7, reviews:342, badge:'hot', desc:'Premium wireless earbuds with active noise cancellation. 30hr battery life, IPX4 waterproof.' },
  { id:2, name:'Smart Watch Ultra', category:'electronics', price:5999, oldPrice:9000, emoji:'⌚', rating:4.8, reviews:218, badge:'hot', desc:'Health monitoring smartwatch with ECG, SpO2, GPS tracking and 7-day battery.' },
  { id:3, name:'Ring Light 26cm', category:'accessories', price:1999, oldPrice:3500, emoji:'💡', rating:4.6, reviews:567, badge:'sale', desc:'Professional 26cm LED ring light with tripod stand. 3 light modes, 10 brightness levels.' },
  { id:4, name:'Laptop Stand Foldable', category:'accessories', price:1499, oldPrice:2500, emoji:'💻', rating:4.5, reviews:423, badge:'sale', desc:'Ergonomic aluminum laptop stand, adjustable height, compatible with all laptops 10-17 inch.' },
  { id:5, name:'65W GaN Charger', category:'electronics', price:2299, oldPrice:4000, emoji:'🔌', rating:4.9, reviews:189, badge:'new', desc:'Ultra-compact 65W GaN charger, charges laptop + phone simultaneously. Universal compatibility.' },
  { id:6, name:'Magnetic Phone Holder', category:'accessories', price:899, oldPrice:1500, emoji:'🧲', rating:4.4, reviews:634, badge:'', desc:'Strong magnetic car phone holder, 360° rotation, compatible with all phones.' },
  { id:7, name:'Portable Blender', category:'home', price:2799, oldPrice:4500, emoji:'🥤', rating:4.6, reviews:278, badge:'hot', desc:'USB rechargeable portable blender. Makes smoothies in 30 seconds. 380ml capacity.' },
  { id:8, name:'Posture Corrector', category:'sports', price:1299, oldPrice:2000, emoji:'🦺', rating:4.3, reviews:891, badge:'sale', desc:'Adjustable back posture corrector brace. Relieves neck and back pain. Unisex design.' },
  { id:9, name:'LED Strip Lights 5m', category:'home', price:1799, oldPrice:3000, emoji:'🌈', rating:4.7, reviews:456, badge:'sale', desc:'RGB LED strip lights 5 meters with remote control. 16 million colors. App controlled.' },
  { id:10, name:'Running Shoes Air', category:'sports', price:4499, oldPrice:7000, emoji:'👟', rating:4.8, reviews:312, badge:'hot', desc:'Lightweight breathable running shoes with air cushion sole. Sizes 38-46 available.' },
  { id:11, name:'Wireless Charging Pad', category:'electronics', price:1599, oldPrice:2500, emoji:'⚡', rating:4.5, reviews:267, badge:'new', desc:'15W fast wireless charging pad compatible with iPhone, Samsung, and all Qi devices.' },
  { id:12, name:'Travel Backpack 40L', category:'accessories', price:3999, oldPrice:6000, emoji:'🎒', rating:4.9, reviews:143, badge:'new', desc:'Waterproof 40L travel backpack with USB charging port, hidden pockets, laptop compartment.' },
  { id:13, name:'Electric Shaver Men', category:'accessories', price:2599, oldPrice:4500, emoji:'🪒', rating:4.6, reviews:389, badge:'sale', desc:'Rechargeable 3-blade electric shaver, waterproof, 60min runtime per charge.' },
  { id:14, name:'Air Purifier Desk', category:'home', price:3299, oldPrice:5000, emoji:'🌬️', rating:4.7, reviews:198, badge:'new', desc:'Mini desk air purifier with HEPA filter. Ultra-quiet, covers 200 sq ft. USB powered.' },
  { id:15, name:'Resistance Bands Set', category:'sports', price:999, oldPrice:1800, emoji:'💪', rating:4.5, reviews:712, badge:'sale', desc:'Set of 5 resistance bands in different strengths. Includes carry bag and workout guide.' },
  { id:16, name:'Smart Bulb WiFi 4pc', category:'home', price:2199, oldPrice:3500, emoji:'💡', rating:4.4, reviews:334, badge:'', desc:'WiFi smart bulbs, works with Alexa and Google Home. 16M colors, schedule & timer.' },
];

const WHATSAPP_NUMBER = '923199988744';

// ===== CART =====
function getCart() { return JSON.parse(localStorage.getItem('zaid_cart') || '[]'); }
function saveCart(cart) { localStorage.setItem('zaid_cart', JSON.stringify(cart)); updateCartCount(); }
function addToCart(productId) {
  const cart = getCart();
  const existing = cart.find(i => i.id === productId);
  if (existing) { existing.qty++; } else {
    const product = PRODUCTS.find(p => p.id === productId);
    if (product) cart.push({ ...product, qty: 1 });
  }
  saveCart(cart);
  showToast('✅ Added to cart!');
}
function removeFromCart(productId) { saveCart(getCart().filter(i => i.id !== productId)); renderCart(); }
function updateQty(productId, change) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (item) { item.qty = Math.max(1, item.qty + change); saveCart(cart); renderCart(); }
}
function updateCartCount() {
  const count = getCart().reduce((t, i) => t + i.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
}
function getCartTotal() { return getCart().reduce((t, i) => t + i.price * i.qty, 0); }

// ===== AUTH =====
function getUsers() { return JSON.parse(localStorage.getItem('zaid_users') || '[]'); }
function saveUsers(u) { localStorage.setItem('zaid_users', JSON.stringify(u)); }
function getCurrentUser() { return JSON.parse(localStorage.getItem('zaid_user') || 'null'); }
function setCurrentUser(u) { localStorage.setItem('zaid_user', JSON.stringify(u)); }

// ===== ORDERS =====
function getOrders() { return JSON.parse(localStorage.getItem('zaid_orders') || '[]'); }
function saveOrder(order) { const o = getOrders(); o.unshift(order); localStorage.setItem('zaid_orders', JSON.stringify(o)); }

// ===== UI =====
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}
function formatPrice(p) { return 'Rs. ' + p.toLocaleString(); }
function starsHtml(rating) {
  return '⭐'.repeat(Math.floor(rating)) + ` <span style="color:var(--muted); font-size:0.8rem;">${rating} (${Math.floor(Math.random()*200+50)} reviews)</span>`;
}

// ===== PRODUCT CARD =====
function productCard(p) {
  const discount = p.oldPrice ? Math.round((1 - p.price/p.oldPrice)*100) : 0;
  const badgeClass = p.badge === 'hot' ? 'badge-hot' : p.badge === 'new' ? 'badge-new' : 'badge-sale';
  const badgeHtml = p.badge ? `<div class="badge ${badgeClass}">${p.badge}</div>` : '';
  return `
    <div class="product-card" onclick="viewProduct(${p.id})">
      <div class="product-img">${p.emoji}${badgeHtml}</div>
      <div class="product-info">
        <div class="product-category">${p.category}</div>
        <h3>${p.name}</h3>
        <div class="stars">${starsHtml(p.rating)}</div>
        <div class="price-row">
          <span class="price">${formatPrice(p.price)}</span>
          ${p.oldPrice ? `<span class="price-old">${formatPrice(p.oldPrice)}</span>` : ''}
          ${discount ? `<span class="discount">-${discount}%</span>` : ''}
        </div>
        <button class="btn-cart" onclick="event.stopPropagation(); addToCart(${p.id})">🛒 Add to Cart</button>
      </div>
    </div>`;
}

function viewProduct(id) { localStorage.setItem('zaid_view_product', id); window.location.href = 'product-details.html'; }

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
        <span class="cart-remove" onclick="removeFromCart(${item.id})">🗑 Remove</span>
      </div>
      <div style="font-weight:800; font-size:1rem;">${formatPrice(item.price * item.qty)}</div>
    </div>`).join('');
  const total = getCartTotal();
  const shipping = total > 3000 ? 0 : 200;
  document.getElementById('cart-subtotal').textContent = formatPrice(total);
  document.getElementById('cart-shipping').textContent = shipping === 0 ? 'FREE' : formatPrice(shipping);
  document.getElementById('cart-total').textContent = formatPrice(total + shipping);
  const orderText = cart.map(i => `${i.name} x${i.qty} = ${formatPrice(i.price*i.qty)}`).join('%0A');
  const waLink = document.getElementById('wa-link');
  if (waLink) waLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=Hello!%0AI want to order:%0A${orderText}%0A%0ATotal: ${formatPrice(total+shipping)}`;
}

// ===== FILTER =====
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
  if (hamburger && navLinks) hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
  updateCartCount();
  const user = getCurrentUser();
  const loginLink = document.getElementById('login-link');
  const userGreet = document.getElementById('user-greet');
  if (user && loginLink) loginLink.style.display = 'none';
  if (user && userGreet) { userGreet.textContent = `👋 ${user.name}`; userGreet.style.display = 'inline'; }
}

document.addEventListener('DOMContentLoaded', initNav);
