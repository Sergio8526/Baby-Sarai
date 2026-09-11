/* ==========================================================================
   Baby Saraí — Lógica de interfaz
   Carrito persistido en localStorage + interacciones de cada página
   ========================================================================== */

const CART_KEY = 'babysarai_cart';
const FAV_KEY = 'babysarai_favorites';
const SHIPPING_COST = 8000;

/* ---------- Catálogo de productos (fuente única de verdad) ---------- */
const PRODUCTS = [
  { id: '1',  name: 'Body manga larga',              price: 28000, cat: 'ninas',         talla: '0-3',  estado: 'nuevo',     color: '#F1CFD6', material: 'Algodón orgánico',   desc: 'Body de manga larga fabricado en algodón orgánico, suave para la piel del bebé. Cierre a presión en la entrepierna para facilitar el cambio de pañal.' },
  { id: '2',  name: 'Conjunto de algodón',            price: 45000, cat: 'ninas',         talla: '3-6',  estado: 'seminuevo', color: '#C9DCE3', material: 'Algodón peinado',     desc: 'Conjunto de dos piezas en algodón peinado, ideal para el día a día. Producto seminuevo en muy buen estado.' },
  { id: '3',  name: 'Pijama orgánica',                price: 32000, cat: 'ninas',         talla: '6-12', estado: 'nuevo',     color: '#F3D6C0', material: 'Algodón orgánico',   desc: 'Pijama de una pieza en algodón orgánico certificado, costuras planas para mayor comodidad al dormir.' },
  { id: '5',  name: 'Vestido floral',                 price: 38000, cat: 'ninas',         talla: '0-3',  estado: 'nuevo',     color: '#E3E0EE', material: 'Popelina de algodón', desc: 'Vestido con estampado floral y forro interior suave. Cierre trasero con botones.' },
  { id: '6',  name: 'Enterizo a rayas',                price: 41000, cat: 'ninos',         talla: '3-6',  estado: 'seminuevo', color: '#DCE8DC', material: 'Algodón elástico',    desc: 'Enterizo a rayas con broches en la entrepierna, tela elástica que acompaña el movimiento.' },
  { id: '7',  name: 'Chaqueta suave',                 price: 52000, cat: 'ninos',         talla: '6-12', estado: 'nuevo',     color: '#F0DFA8', material: 'Poliéster afelpado',  desc: 'Chaqueta afelpada por dentro, cierre frontal y capota, ideal para días de clima fresco.' },
  { id: '8',  name: 'Overol denim',                   price: 47000, cat: 'ninos',         talla: '0-3',  estado: 'nuevo',     color: '#C9DCE3', material: 'Denim liviano',       desc: 'Overol en denim liviano con broches ajustables, combina fácil con cualquier body.' },
  { id: '9',  name: 'Pijama de dinosaurios',          price: 30000, cat: 'ninos',         talla: '3-6',  estado: 'seminuevo', color: '#DCE8DC', material: 'Algodón perchado',    desc: 'Pijama térmica con estampado de dinosaurios, tela perchada por dentro para mayor abrigo.' },
  { id: '10', name: 'Ajuar recién nacido (5 piezas)', price: 65000, cat: 'recien-nacido', talla: '0-3',  estado: 'nuevo',     color: '#F3D6C0', material: 'Algodón orgánico',   desc: 'Set de 5 piezas para la llegada del bebé: body, pantalón, gorro, escarpines y babero.' },
  { id: '11', name: 'Gorro + escarpines',             price: 18000, cat: 'recien-nacido', talla: '0-3',  estado: 'nuevo',     color: '#E3E0EE', material: 'Algodón suave',       desc: 'Set de gorro y escarpines tejidos a mano en algodón suave, ideales para los primeros días.' },
  { id: '12', name: 'Cobija envolvente',              price: 36000, cat: 'recien-nacido', talla: '0-3',  estado: 'seminuevo', color: '#F1CFD6', material: 'Muselina de algodón', desc: 'Cobija envolvente en muselina de algodón, transpirable y suave para el descanso del bebé.' },
  { id: '13', name: 'Body manga corta pack x3',       price: 42000, cat: 'recien-nacido', talla: '0-3',  estado: 'nuevo',     color: '#C9DCE3', material: 'Algodón orgánico',   desc: 'Pack de 3 bodies de manga corta en algodón orgánico, básicos imprescindibles para el ajuar.' },
];

const CATEGORY_LABELS = {
  'ninas': 'Niñas',
  'ninos': 'Niños',
  'recien-nacido': 'Recién nacido',
  'ofertas': 'Ofertas',
};

/* ---------- Utilidades de carrito (compartidas por todas las páginas) ---------- */
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(item) {
  const cart = getCart();
  const existing = cart.find((i) => i.id === item.id && i.size === item.size);
  if (existing) {
    existing.qty += item.qty;
  } else {
    cart.push(item);
  }
  saveCart(cart);
}

function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
}

function cartTotals(cart) {
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = cart.length ? SHIPPING_COST : 0;
  return { subtotal, shipping, total: subtotal + shipping };
}

function formatCOP(value) {
  return '$' + value.toLocaleString('es-CO');
}

function updateCartBadge() {
  const count = getCart().reduce((sum, i) => sum + i.qty, 0);
  document.querySelectorAll('[data-cart-count]').forEach((el) => {
    el.textContent = count;
  });
}

function setText(selector, text) {
  const el = document.querySelector(selector);
  if (el) el.textContent = text;
}

/* ---------- Utilidades de favoritos (compartidas por todas las páginas) ---------- */
function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveFavorites(favs) {
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
  updateFavoritesBadge();
}

function isFavorite(id) {
  return getFavorites().includes(id);
}

function toggleFavorite(id) {
  const favs = getFavorites();
  const index = favs.indexOf(id);
  if (index === -1) favs.push(id);
  else favs.splice(index, 1);
  saveFavorites(favs);
  return index === -1;
}

function updateFavoritesBadge() {
  const count = getFavorites().length;
  document.querySelectorAll('[data-fav-count]').forEach((el) => {
    el.textContent = count;
  });
}

const HEART_ICON = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7.5-4.7-10-9.3C.5 8 2 4.5 5.5 4c2-.3 3.8.7 6.5 3.3C14.7 4.7 16.5 3.7 18.5 4c3.5.5 5 4 3.5 7.7C19.5 16.3 12 21 12 21z"/></svg>';

function favToggleHtml(id) {
  const active = isFavorite(id);
  return `<button class="fav-toggle" data-fav-toggle="${id}" aria-pressed="${active}" aria-label="Guardar en favoritos" onclick="event.preventDefault(); event.stopPropagation(); handleFavClick(this)">${HEART_ICON}</button>`;
}

function handleFavClick(btn) {
  const id = btn.dataset.favToggle;
  const nowActive = toggleFavorite(id);
  document.querySelectorAll(`[data-fav-toggle="${id}"]`).forEach((el) => {
    el.setAttribute('aria-pressed', String(nowActive));
  });
  if (typeof renderFavoritesPage === 'function') renderFavoritesPage();
}

function initFavoriteButtons() {
  document.querySelectorAll('[data-fav-toggle]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(isFavorite(btn.dataset.favToggle)));
  });
}

/* ---------- Menú móvil ---------- */
function initMobileNav() {
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-main-nav]');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}

/* ---------- Buscador (funciona en todas las páginas) ---------- */
function initSearch() {
  const toggleBtn = document.querySelector('[data-search-toggle]');
  const box = document.querySelector('[data-search-box]');
  const input = document.querySelector('[data-search-input]');
  if (!toggleBtn || !box || !input) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = box.classList.toggle('is-open');
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) input.focus();
  });

  const onCategoryPage = !!document.querySelector('[data-product-grid]');

  input.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const term = input.value.trim();
    if (onCategoryPage) {
      renderCategoryPage();
    } else if (term) {
      window.location.href = `categoria.html?search=${encodeURIComponent(term)}`;
    }
  });

  if (onCategoryPage) {
    input.addEventListener('input', () => renderCategoryPage());
    const params = new URLSearchParams(window.location.search);
    const search = params.get('search');
    if (search) {
      input.value = search;
      box.classList.add('is-open');
    }
  }
}

/* ---------- Página: Categoría (render dinámico + filtros + búsqueda) ---------- */
function renderCategoryPage() {
  const grid = document.querySelector('[data-product-grid]');
  if (!grid) return;

  const params = new URLSearchParams(window.location.search);
  const cat = params.get('cat') || 'ofertas';
  const searchInput = document.querySelector('[data-search-input]');
  const searchTerm = (searchInput ? searchInput.value : (params.get('search') || '')).trim().toLowerCase();

  const activeSizes = Array.from(document.querySelectorAll('[data-filter="talla"]:checked')).map((c) => c.value);
  const activeStates = Array.from(document.querySelectorAll('[data-filter="estado"]:checked')).map((c) => c.value);

  const showAllCats = cat === 'ofertas';
  let results = PRODUCTS.filter((p) => {
    const matchesCat = showAllCats || p.cat === cat;
    const matchesSize = activeSizes.length === 0 || activeSizes.includes(p.talla);
    const matchesState = activeStates.length === 0 || activeStates.includes(p.estado);
    const matchesSearch = !searchTerm || p.name.toLowerCase().includes(searchTerm);
    return matchesCat && matchesSize && matchesState && matchesSearch;
  });

  grid.innerHTML = results.map((p) => `
    <a href="producto.html?id=${p.id}" class="product-link">
      <article class="product-card">
        <div class="product-thumb" style="background-color:${p.color}">
          <span class="product-badge">${p.estado === 'nuevo' ? 'Nuevo' : 'Seminuevo'}</span>
          ${favToggleHtml(p.id)}
        </div>
        <div class="product-info">
          <h3>${p.name}</h3>
          <p class="product-price">${formatCOP(p.price)}</p>
        </div>
      </article>
    </a>
  `).join('');

  const heading = document.querySelector('[data-category-heading]');
  const crumb = document.querySelector('[data-category-crumb]');
  const summary = document.querySelector('[data-results-summary]');
  const label = searchTerm
    ? `Resultados para "${searchTerm}"`
    : (CATEGORY_LABELS[cat] || 'Todos los productos');

  if (heading) heading.textContent = label;
  if (crumb) crumb.textContent = label;
  document.title = `${label} — Baby Saraí`;

  if (summary) {
    summary.textContent = `${results.length} producto${results.length === 1 ? '' : 's'} encontrado${results.length === 1 ? '' : 's'}`;
  }

  const emptyState = document.querySelector('[data-empty-state]');
  if (emptyState) emptyState.classList.toggle('is-visible', results.length === 0);

  document.querySelectorAll('.main-nav a[data-cat-link]').forEach((link) => {
    if (link.dataset.catLink === cat && !searchTerm) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

function initCategoryFilters() {
  const grid = document.querySelector('[data-product-grid]');
  if (!grid) return;
  document.querySelectorAll('[data-filter]').forEach((cb) => cb.addEventListener('change', renderCategoryPage));
  renderCategoryPage();
}

/* ---------- Página: Producto (render dinámico según ?id=) ---------- */
function renderProductPage() {
  const root = document.querySelector('[data-product-root]');
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || '1';
  const product = PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];

  document.title = `${product.name} — Baby Saraí`;
  setText('[data-product-title]', product.name);
  setText('[data-product-price]', formatCOP(product.price));
  setText('[data-product-desc]', product.desc);
  setText('[data-product-material]', product.material);
  setText('[data-product-estado]', product.estado === 'nuevo' ? 'Nuevo con etiqueta' : 'Seminuevo, buen estado');

  const crumbCat = document.querySelector('[data-product-crumb-cat]');
  if (crumbCat) {
    crumbCat.textContent = CATEGORY_LABELS[product.cat];
    crumbCat.setAttribute('href', `categoria.html?cat=${product.cat}`);
  }
  const crumbName = document.querySelector('[data-product-crumb-name]');
  if (crumbName) crumbName.textContent = product.name;

  const image = document.querySelector('[data-product-image]');
  if (image) {
    image.style.backgroundColor = product.color;
    image.innerHTML = favToggleHtml(product.id);
  }

  const addBtn = document.querySelector('[data-add-to-cart]');
  if (addBtn) {
    addBtn.dataset.id = product.id;
    addBtn.dataset.name = product.name;
    addBtn.dataset.price = product.price;
  }
}

function initProductDetail() {
  const addBtn = document.querySelector('[data-add-to-cart]');
  if (!addBtn) return;

  renderProductPage();

  const sizeChips = document.querySelectorAll('[data-size-chip]');
  const qtyValue = document.querySelector('[data-qty-value]');
  const confirm = document.querySelector('[data-add-confirm]');
  let selectedSize = sizeChips.length ? sizeChips[0].dataset.sizeChip : null;
  let qty = 1;

  sizeChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      sizeChips.forEach((c) => c.setAttribute('aria-pressed', 'false'));
      chip.setAttribute('aria-pressed', 'true');
      selectedSize = chip.dataset.sizeChip;
    });
  });

  document.querySelectorAll('[data-qty-btn]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const delta = Number(btn.dataset.qtyBtn);
      qty = Math.max(1, qty + delta);
      if (qtyValue) qtyValue.textContent = qty;
    });
  });

  addBtn.addEventListener('click', () => {
    const { id, name, price } = addBtn.dataset;
    addToCart({ id, name, price: Number(price), size: selectedSize, qty });
    if (confirm) {
      confirm.classList.add('is-visible');
      confirm.textContent = `Agregado: ${qty} × ${name} (talla ${selectedSize})`;
    }
  });
}

/* ---------- Página: Carrito ---------- */
function renderCartPage() {
  const list = document.querySelector('[data-cart-list]');
  if (!list) return;
  const empty = document.querySelector('[data-cart-empty]');
  const cart = getCart();

  list.innerHTML = '';
  if (cart.length === 0) {
    if (empty) empty.style.display = 'block';
    list.style.display = 'none';
  } else {
    if (empty) empty.style.display = 'none';
    list.style.display = 'block';
    cart.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <div class="cart-item-thumb" style="background-color:${swatch(index)}"></div>
        <div>
          <p class="cart-item-name">${item.name}</p>
          <p class="cart-item-meta">Talla ${item.size} · Cantidad: ${item.qty}</p>
          <button class="cart-item-remove" data-remove-index="${index}">Eliminar</button>
        </div>
        <p class="cart-item-price">${formatCOP(item.price * item.qty)}</p>
      `;
      list.appendChild(row);
    });
  }

  const { subtotal, shipping, total } = cartTotals(cart);
  setText('[data-subtotal]', formatCOP(subtotal));
  setText('[data-shipping]', cart.length ? formatCOP(shipping) : '—');
  setText('[data-total]', formatCOP(total));
  setText('[data-cart-title]', `Tu carrito (${cart.reduce((s, i) => s + i.qty, 0)} producto${cart.length === 1 ? '' : 's'})`);

  const checkoutLink = document.querySelector('[data-go-checkout]');
  if (checkoutLink) {
    if (cart.length === 0) checkoutLink.setAttribute('disabled', 'true');
    else checkoutLink.removeAttribute('disabled');
  }

  list.querySelectorAll('[data-remove-index]').forEach((btn) => {
    btn.addEventListener('click', () => {
      removeFromCart(Number(btn.dataset.removeIndex));
      renderCartPage();
    });
  });
}

function swatch(index) {
  const colors = ['#F1CFD6', '#C9DCE3', '#F3D6C0', '#E3E0EE', '#DCE8DC'];
  return colors[index % colors.length];
}

/* ---------- Página: Checkout ---------- */
function initCheckout() {
  const form = document.querySelector('[data-checkout-form]');
  if (!form) return;
  const cart = getCart();
  const { total } = cartTotals(cart);
  setText('[data-checkout-total]', formatCOP(total));

  const payOptions = document.querySelectorAll('[data-pay-option]');
  let selectedPay = payOptions.length ? payOptions[0].dataset.payOption : null;
  payOptions.forEach((opt) => {
    opt.addEventListener('click', () => {
      payOptions.forEach((o) => o.setAttribute('aria-pressed', 'false'));
      opt.setAttribute('aria-pressed', 'true');
      selectedPay = opt.dataset.payOption;
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('[required]').forEach((input) => {
      const field = input.closest('.form-field');
      if (!input.value.trim()) {
        field.classList.add('has-error');
        valid = false;
      } else {
        field.classList.remove('has-error');
      }
    });
    if (!valid) return;

    form.style.display = 'none';
    document.querySelector('[data-order-summary-card]')?.style.setProperty('display', 'none');
    const confirmation = document.querySelector('[data-confirmation]');
    if (confirmation) {
      confirmation.classList.add('is-visible');
      const orderNumber = 'BS-' + Math.floor(100000 + Math.random() * 900000);
      setText('[data-order-number]', orderNumber);
      setText('[data-order-total]', formatCOP(total));
    }
    localStorage.removeItem(CART_KEY);
    updateCartBadge();
  });
}

/* ---------- Página: Contacto ---------- */
function initContactForm() {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('[required]').forEach((input) => {
      const field = input.closest('.form-field');
      const isEmail = input.type === 'email';
      const emailOk = !isEmail || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      if (!input.value.trim() || !emailOk) {
        field.classList.add('has-error');
        valid = false;
      } else {
        field.classList.remove('has-error');
      }
    });
    if (!valid) return;

    form.style.display = 'none';
    const confirmation = document.querySelector('[data-contact-confirm]');
    if (confirmation) confirmation.classList.add('is-visible');
  });
}

/* ---------- Página: Favoritos ---------- */
function renderFavoritesPage() {
  const grid = document.querySelector('[data-fav-grid]');
  if (!grid) return;
  const empty = document.querySelector('[data-fav-empty]');
  const favIds = getFavorites();
  const items = PRODUCTS.filter((p) => favIds.includes(p.id));

  if (items.length === 0) {
    grid.style.display = 'none';
    if (empty) empty.style.display = 'block';
    return;
  }
  grid.style.display = '';
  if (empty) empty.style.display = 'none';

  grid.innerHTML = items.map((p) => `
    <a href="producto.html?id=${p.id}" class="product-link">
      <article class="product-card">
        <div class="product-thumb" style="background-color:${p.color}">
          <span class="product-badge">${p.estado === 'nuevo' ? 'Nuevo' : 'Seminuevo'}</span>
          ${favToggleHtml(p.id)}
        </div>
        <div class="product-info">
          <h3>${p.name}</h3>
          <p class="product-price">${formatCOP(p.price)}</p>
        </div>
      </article>
    </a>
  `).join('');
}

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  updateFavoritesBadge();
  initMobileNav();
  initSearch();
  initCategoryFilters();
  initProductDetail();
  initFavoriteButtons();
  renderCartPage();
  renderFavoritesPage();
  initCheckout();
  initContactForm();
});
