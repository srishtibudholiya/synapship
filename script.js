const PRODUCTS = [
  {
    id: 1,
    name: "Milk 500ml",
    emoji: "🥛",
    price: 40,
    cat: "Dairy & Eggs",
    unit: "packet",
  },
  {
    id: 2,
    name: "Bread",
    emoji: "🍞",
    price: 30,
    cat: "Bakery",
    unit: "loaf",
  },
  {
    id: 3,
    name: "Shampoo",
    emoji: "🧴",
    price: 90,
    cat: "Personal Care",
    unit: "bottle",
  },
  {
    id: 4,
    name: "Eggs 6 pcs",
    emoji: "🥚",
    price: 60,
    cat: "Dairy & Eggs",
    unit: "pack",
  },
  {
    id: 5,
    name: "Biscuits",
    emoji: "🍪",
    price: 20,
    cat: "Snacks",
    unit: "pack",
  },
  {
    id: 6,
    name: "Bath Soap",
    emoji: "🧼",
    price: 25,
    cat: "Personal Care",
    unit: "bar",
  },
  {
    id: 7,
    name: "Rice 1kg",
    emoji: "🍚",
    price: 70,
    cat: "Staples",
    unit: "bag",
  },
  {
    id: 8,
    name: "Potato Chips",
    emoji: "🥔",
    price: 18,
    cat: "Snacks",
    unit: "pack",
  },
  {
    id: 9,
    name: "Cooking Oil 1L",
    emoji: "🛢️",
    price: 140,
    cat: "Staples",
    unit: "bottle",
  },
  {
    id: 10,
    name: "Sugar 1kg",
    emoji: "🍬",
    price: 45,
    cat: "Staples",
    unit: "bag",
  },
  {
    id: 11,
    name: "Tea Powder",
    emoji: "🍵",
    price: 120,
    cat: "Beverages",
    unit: "pack",
  },
  {
    id: 12,
    name: "Atta 5kg",
    emoji: "🌾",
    price: 220,
    cat: "Staples",
    unit: "bag",
  },
  {
    id: 13,
    name: "Instant Noodles",
    emoji: "🍜",
    price: 15,
    cat: "Snacks",
    unit: "pack",
  },
  {
    id: 14,
    name: "Cold Drink",
    emoji: "🥤",
    price: 40,
    cat: "Beverages",
    unit: "bottle",
  },
  {
    id: 15,
    name: "Toothpaste",
    emoji: "🪥",
    price: 55,
    cat: "Personal Care",
    unit: "tube",
  },
  {
    id: 16,
    name: "Detergent",
    emoji: "🫧",
    price: 110,
    cat: "Household",
    unit: "pack",
  },
  {
    id: 17,
    name: "Butter",
    emoji: "🧈",
    price: 60,
    cat: "Dairy & Eggs",
    unit: "pack",
  },
  {
    id: 18,
    name: "Cheese",
    emoji: "🧀",
    price: 100,
    cat: "Dairy & Eggs",
    unit: "pack",
  },
  {
    id: 19,
    name: "Apples 1kg",
    emoji: "🍎",
    price: 160,
    cat: "Fruits & Vegetables",
    unit: "kg",
  },
  {
    id: 20,
    name: "Bananas Dozen",
    emoji: "🍌",
    price: 60,
    cat: "Fruits & Vegetables",
    unit: "dozen",
  },
];
const CATEGORIES = [
  ["Dairy & Eggs", "🥛"],
  ["Staples", "🌾"],
  ["Snacks", "🍪"],
  ["Personal Care", "🧴"],
  ["Beverages", "🥤"],
  ["Household", "🫧"],
  ["Bakery", "🍞"],
  ["Fruits & Vegetables", "🍎"],
];
const SHOP_SEED = [
  {
    id: 1,
    name: "Sharma General Store",
    verified: true,
    prices: {},
    stock: {},
  },
  { id: 2, name: "Gupta Mart", verified: true, prices: {}, stock: {} },
  {
    id: 3,
    name: "Patel Provision",
    verified: true,
    prices: {},
    stock: {},
  },
  { id: 4, name: "Verma Kirana", verified: true, prices: {}, stock: {} },
];
const ADMIN_DEMO = {
  email: "admin@synapship.demo",
  password: "Admin@2026!",
};
const PASSWORD_HASH_ALGORITHM = "PBKDF2-SHA-256";
const PASSWORD_HASH_ITERATIONS = 210000;
let security = { attempts: 0, lockUntil: 0 };
let customProducts = [];
let passwordMigration = Promise.resolve(true);
let state = {
  user: null,
  page: "home",
  category: "All",
  query: "",
  cart: {},
  users: [],
  shops: [],
  orders: [],
  supplyRequests: [],
  authMode: "login",
};
const $ = (id) => document.getElementById(id),
  money = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
function initData() {
  try {
    state.users = JSON.parse(localStorage.getItem("ss_users") || "[]");
    state.shops =
      JSON.parse(localStorage.getItem("ss_shops") || "null") || SHOP_SEED;
    state.orders = JSON.parse(localStorage.getItem("ss_orders") || "[]");
    state.supplyRequests = JSON.parse(
      localStorage.getItem("ss_requests") || "[]",
    );
  } catch (e) {
    state.shops = SHOP_SEED;
  }
  if (!state.shops.length) state.shops = SHOP_SEED;
  state.shops.forEach((s, si) =>
    PRODUCTS.forEach((p, i) => {
      if (s.prices[p.id] == null)
        s.prices[p.id] = p.price + ([0, -4, -2, 3][si] || 0);
      if (s.stock[p.id] == null) s.stock[p.id] = [10, 8, 12, 7][(i + si) % 4];
    }),
  );
  persist();
}
function persist() {
  localStorage.setItem("ss_users", JSON.stringify(state.users));
  localStorage.setItem("ss_shops", JSON.stringify(state.shops));
  localStorage.setItem("ss_orders", JSON.stringify(state.orders));
  localStorage.setItem("ss_requests", JSON.stringify(state.supplyRequests));
}
function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}
async function hashPassword(password, saltHex) {
  const salt = saltHex
    ? Uint8Array.from(
        saltHex.match(/.{2}/g) || [],
        (byte) => Number.parseInt(byte, 16),
      )
    : crypto.getRandomValues(new Uint8Array(16));
  if (salt.length !== 16)
    throw new Error("The saved password salt is invalid.");
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt,
      iterations: PASSWORD_HASH_ITERATIONS,
    },
    key,
    256,
  );
  return {
    passwordHash: bytesToHex(new Uint8Array(bits)),
    passwordSalt: bytesToHex(salt),
    passwordAlgorithm: PASSWORD_HASH_ALGORITHM,
    passwordIterations: PASSWORD_HASH_ITERATIONS,
  };
}
async function verifyPassword(user, password) {
  if (
    user.passwordAlgorithm !== PASSWORD_HASH_ALGORITHM ||
    user.passwordIterations !== PASSWORD_HASH_ITERATIONS ||
    !/^[0-9a-f]{32}$/i.test(user.passwordSalt || "") ||
    !/^[0-9a-f]{64}$/i.test(user.passwordHash || "")
  ) {
    return false;
  }
  const candidate = await hashPassword(password, user.passwordSalt);
  let difference = 0;
  for (let i = 0; i < candidate.passwordHash.length; i++) {
    difference |=
      candidate.passwordHash.charCodeAt(i) ^
      user.passwordHash.toLowerCase().charCodeAt(i);
  }
  return difference === 0;
}
async function migrateLegacyPasswords() {
  let changed = false;
  for (const user of state.users) {
    if (typeof user.password !== "string") continue;
    const savedHash = await hashPassword(user.password);
    Object.assign(user, savedHash);
    delete user.password;
    changed = true;
  }

  let admin = state.users.find((user) => user.email === ADMIN_DEMO.email);
  if (!admin || !admin.isDemoAdmin) {
    const savedHash = await hashPassword(ADMIN_DEMO.password);
    if (!admin) {
      admin = { name: "Administrator", email: ADMIN_DEMO.email, role: "admin" };
      state.users.push(admin);
    }
    Object.assign(admin, savedHash, {
      name: "Administrator",
      role: "admin",
      isDemoAdmin: true,
    });
    delete admin.password;
    changed = true;
  }

  if (changed) persist();
  return true;
}
function toast(msg) {
  $("toast").textContent = msg;
  $("toast").classList.add("show");
  setTimeout(() => $("toast").classList.remove("show"), 2300);
}
function toggleAuth() {
  state.authMode = state.authMode === "login" ? "register" : "login";
  $("name-field").classList.toggle("hidden", state.authMode === "login");
  $("role-field").classList.toggle("hidden", state.authMode === "login");
  $("auth-title").textContent =
    state.authMode === "login" ? "Welcome back" : "Create your account";
  $("auth-sub").textContent =
    state.authMode === "login"
      ? "Sign in to continue to your local marketplace."
      : "Join SynapShip and start shopping smarter.";
  $("auth-submit").textContent =
    state.authMode === "login" ? "Sign in" : "Create account";
  $("auth-toggle-text").textContent =
    state.authMode === "login"
      ? "New to SynapShip?"
      : "Already have an account?";
  $("auth-toggle").textContent =
    state.authMode === "login" ? "Create account" : "Sign in";
}
async function authenticate() {
  const email = $("auth-email").value.trim().toLowerCase(),
    pass = $("auth-password").value;
  if (!email || !pass) return toast("Enter your email and password");
  try {
    if (!(await passwordMigration))
      return toast("Saved accounts could not be secured. Please reload.");
    if (state.authMode === "register") {
      const name = $("auth-name").value.trim();
      if (!name) return toast("Enter your name");
      if (email === ADMIN_DEMO.email)
        return toast("That email is reserved for the demo admin account.");
      if (state.users.some((u) => u.email === email))
        return toast("Account already exists. Please sign in.");
      const role = $("auth-role").value;
      if (!["customer", "shop", "delivery"].includes(role))
        return toast("Choose a valid account type.");
      const savedHash = await hashPassword(pass);
      const user = { name, email, role, ...savedHash };
      state.users.push(user);
      try {
        persist();
      } catch (error) {
        state.users.pop();
        throw error;
      }
      state.user = { name, email, role };
    } else {
      const user = state.users.find((u) => u.email === email);
      if (!user || !(await verifyPassword(user, pass)))
        return toast("Invalid email or password.");
      state.user = { name: user.name, email: user.email, role: user.role };
    }
    enterApp();
  } catch (error) {
    console.error("Unable to save or verify the account.", error);
    toast("Could not securely save or verify this account.");
  }
}
function enterApp() {
  $("auth").classList.add("hidden");
  $("app").classList.remove("hidden");
  $("user-label").textContent = state.user.name;
  $("avatar").textContent = state.user.name[0].toUpperCase();
  $("shop-nav").classList.toggle(
    "hidden",
    !["shop", "admin"].includes(state.user.role),
  );
  $("delivery-nav").classList.toggle("hidden", state.user.role !== "delivery");
  $("admin-nav").classList.toggle("hidden", state.user.role !== "admin");
  $("manage-label").classList.toggle("hidden", state.user.role === "customer");
  go(
    state.user.role === "shop"
      ? "shop"
      : state.user.role === "delivery"
        ? "delivery"
        : state.user.role === "admin"
          ? "admin"
          : "home",
  );
}
function logout() {
  state.user = null;
  state.cart = {};
  $("app").classList.add("hidden");
  $("auth").classList.remove("hidden");
  $("auth-email").value = "";
  $("auth-password").value = "";
}
function go(page) {
  state.page = page;
  document
    .querySelectorAll(".nav-item")
    .forEach((n) => n.classList.toggle("active", n.dataset.page === page));
  render();
}
function searchProducts(q) {
  state.query = q;
  go("products");
}
function add(id, d) {
  state.cart[id] = Math.max(0, (state.cart[id] || 0) + d);
  if (!state.cart[id]) delete state.cart[id];
  updateCartCount();
  render();
}
function updateCartCount() {
  $("cart-count").textContent = Object.values(state.cart).reduce(
    (a, b) => a + b,
    0,
  );
}
function availableShops(p) {
  return state.shops.filter((s) => s.verified && (s.stock[p.id] || 0) > 0);
}
function lowestPrice(p) {
  const arr = availableShops(p).map((s) => s.prices[p.id]);
  return arr.length ? Math.min(...arr) : p.price;
}
function productCard(p) {
  const shops = availableShops(p),
    qty = state.cart[p.id] || 0;
  return `<article class="product"><div class="product-top"><span class="product-emoji">${p.emoji}</span><span class="pill green">${p.cat}</span></div><h3>${p.name}</h3><div class="muted">${shops.length} local shops · per ${p.unit}</div><div class="price">From ${money(lowestPrice(p))}</div><div class="product-actions">${qty ? `<div class="qty"><button onclick="add(${p.id},-1)">−</button><span>${qty}</span><button onclick="add(${p.id},1)">+</button></div>` : `<button class="btn" style="padding:8px 12px" onclick="add(${p.id},1)">+ Add</button>`}<button class="text-btn" onclick="showProduct(${p.id})">Prices</button></div></article>`;
}
function renderHome() {
  return `<div class="welcome"><div><span class="project-note">✦ Student prototype · version 1.0</span><h1 style="margin-top:10px">Hello, ${escapeHtml(state.user.name.split(" ")[0])} 👋</h1><p>Let’s see what the shops around you can help with today.</p></div><button class="btn outline" onclick="go('compare')">⇄ Check my basket</button></div><section class="hero"><div><h2>One order.<br>More helpful local shops.</h2><p>If one store is out of stock, SynapShip asks a nearby partner before giving up on your basket.</p><button class="btn" onclick="go('products')">Browse essentials →</button></div></section><div class="section-head"><h2>Why we made SynapShip</h2><span class="muted">A simple solution to a familiar problem</span></div><div class="story-grid"><article class="story-card"><span class="num">01</span><h3>Local stock is hard to see</h3><p>Many nearby shops have what we need, but there is no easy way to check before stepping out.</p></article><article class="story-card"><span class="num">02</span><h3>One missing item ruins an order</h3><p>Instead of cancelling, a primary shop can ask another verified shop for the missing item.</p></article><article class="story-card"><span class="num">03</span><h3>Everyone stays part of the sale</h3><p>Shops keep their own prices and inventory while helping each other complete an order.</p></article></div><div class="section-head"><h2>Shop by category</h2><button class="text-btn" onclick="go('categories')">View all →</button></div><div class="category-grid">${CATEGORIES.slice(
    0,
    6,
  )
    .map(
      (c) =>
        `<button class="category" onclick="pickCategory('${c[0]}')"><span class="emoji">${c[1]}</span><b>${c[0]}</b></button>`,
    )
    .join(
      "",
    )}</div><div class="section-head"><h2>Everyday picks</h2><button class="text-btn" onclick="go('products')">See all →</button></div><div class="product-grid">${PRODUCTS.slice(0, 8).map(productCard).join("")}</div><p class="student-foot">Built as a second-year academic project. Product names, inventory, pricing and delivery actions are demo data stored in this browser.</p>`;
}
function pickCategory(cat) {
  state.category = cat;
  go("products");
}
function renderCategories() {
  return `<div class="welcome"><div><h1>Categories</h1><p>Explore everyday essentials by category.</p></div></div><div class="category-grid">${CATEGORIES.map((c) => `<button class="category" onclick="pickCategory('${c[0]}')"><span class="emoji">${c[1]}</span><b>${c[0]}</b></button>`).join("")}</div>`;
}
function renderProducts() {
  let arr = PRODUCTS.filter(
    (p) =>
      (state.category === "All" || p.cat === state.category) &&
      p.name.toLowerCase().includes(state.query.toLowerCase()),
  );
  return `<div class="welcome"><div><h1>${state.category === "All" ? "All products" : escapeHtml(state.category)}</h1><p>Choose items and compare prices from verified neighbourhood shops.</p></div><select class="control" style="max-width:190px" onchange="state.category=this.value;render()"><option>All</option>${CATEGORIES.map((c) => `<option ${state.category === c[0] ? "selected" : ""}>${c[0]}</option>`).join("")}</select></div><div class="product-grid">${arr.length ? arr.map(productCard).join("") : '<div class="panel empty">No products found.</div>'}</div>`;
}
function basketTotals() {
  const items = Object.entries(state.cart).map(([id, q]) => ({
    p: PRODUCTS.find((p) => p.id == id),
    q: +q,
  }));
  return state.shops
    .filter((s) => s.verified)
    .map((s) => {
      let total = 0,
        ok = true,
        details = [];
      items.forEach(({ p, q }) => {
        const stock = s.stock[p.id] || 0,
          price = s.prices[p.id] ?? p.price;
        if (stock < q) ok = false;
        total += price * q;
        details.push({ p, q, price, stock, available: stock >= q });
      });
      return { s, total, ok, details };
    })
    .sort((a, b) => (a.ok ? 0 : 1) - (b.ok ? 0 : 1) || a.total - b.total);
}
function renderCompare() {
  const items = Object.entries(state.cart).map(([id, q]) => ({
    p: PRODUCTS.find((p) => p.id == id),
    q: +q,
  }));
  if (!items.length)
    return `<div class="welcome"><div><h1>Smart price comparison</h1><p>See which shop gives you the best total for your exact basket.</p></div></div><div class="panel empty"><div class="big">🧺</div><b>Your basket is empty</b><p>Add a few products to compare shop prices.</p><button class="btn" onclick="go('products')">Browse products</button></div>`;
  const rows = basketTotals(),
    best = rows.find((r) => r.ok);
  return `<div class="welcome"><div><h1>Smart price comparison</h1><p>Prices are calculated using the quantities in your basket.</p></div><button class="btn outline" onclick="go('cart')">Edit basket</button></div><div class="two-col"><section class="panel"><h2>Compare total basket price</h2><div class="muted" style="margin:-7px 0 12px">${items.length} products · ${items.reduce((a, x) => a + x.q, 0)} total units</div><div class="table-wrap"><table class="compare-table"><thead><tr><th>Shop</th><th>Basket total</th><th>Availability</th><th></th></tr></thead><tbody>${rows.map((r, i) => `<tr class="${r.ok && best && r.s.id === best.s.id ? "best-row" : ""}"><td><b>${escapeHtml(r.s.name)}</b>${r.ok && best && r.s.id === best.s.id ? '<br><span class="best-tag">CHEAPEST COMPLETE BASKET</span>' : ""}</td><td><b>${r.ok ? money(r.total) : "—"}</b></td><td>${r.ok ? '<span class="pill green">All items in stock</span>' : '<span class="pill orange">Missing item(s)</span>'}</td><td>${r.ok ? `<button class="btn ${best && r.s.id === best.s.id ? "" : "outline"}" onclick="checkoutAt(${r.s.id})" style="padding:7px 10px">${best && r.s.id === best.s.id ? "Choose shop" : "Select"}</button>` : '<button class="btn outline" style="padding:7px 10px" onclick="showShopGaps(' + r.s.id + ')">Details</button>'}</td></tr>`).join("")}</tbody></table></div>${best ? `<p class="muted" style="margin:12px 0 0">Best complete basket: <b>${escapeHtml(best.s.name)}</b> at ${money(best.total)} (before delivery).</p>` : '<p class="muted">No single shop has every item in stock. Your basket may need to be split across shops.</p>'}</section><section class="panel"><h2>Cheapest shop per item</h2>${items
    .map(({ p, q }) => {
      const options = availableShops(p)
        .filter((s) => (s.stock[p.id] || 0) >= q)
        .sort((a, b) => a.prices[p.id] - b.prices[p.id]);
      return `<div class="cart-line"><div class="cart-name"><span class="mini-emoji">${p.emoji}</span><div><b>${p.name} × ${q}</b><div class="muted">${options.length ? escapeHtml(options[0].name) : "Not available in required quantity"}</div></div></div><b>${options.length ? money(options[0].prices[p.id] * q) : "—"}</b></div>`;
    })
    .join("")}</section></div>`;
}
function showShopGaps(id) {
  const s = state.shops.find((x) => x.id === id);
  const missing = Object.entries(state.cart)
    .filter(([p, q]) => (s.stock[p] || 0) < q)
    .map(
      ([p, q]) =>
        PRODUCTS.find((x) => x.id == p).name +
        " (need " +
        q +
        ", stock " +
        (s.stock[p] || 0) +
        ")",
    );
  if (
    confirm(
      s.name +
        " is missing: " +
        missing.join(", ") +
        ".\n\nUse SynapShip partner shops to complete this basket?",
    )
  )
    checkoutAt(id, true);
  else toast("You can choose another shop or edit your basket.");
}
function renderCart() {
  const entries = Object.entries(state.cart),
    totals = basketTotals(),
    best = totals.find((x) => x.ok);
  if (!entries.length)
    return `<div class="welcome"><div><h1>My basket</h1><p>Your selected everyday essentials.</p></div></div><div class="panel empty"><div class="big">🛒</div><b>Your basket is waiting</b><p>Add products to see your estimated total and best shop.</p><button class="btn" onclick="go('products')">Explore products</button></div>`;
  return `<div class="welcome"><div><h1>My basket</h1><p>Update quantities, then compare local shops.</p></div><button class="btn outline" onclick="go('compare')">⇄ Compare prices</button></div><div class="two-col"><section class="panel"><h2>Basket items</h2>${entries
    .map(([id, q]) => {
      const p = PRODUCTS.find((x) => x.id == id);
      return `<div class="cart-line"><div class="cart-name"><span class="mini-emoji">${p.emoji}</span><div><b>${p.name}</b><div class="muted">From ${money(lowestPrice(p))} / ${p.unit}</div></div></div><div class="qty"><button onclick="add(${p.id},-1)">−</button><span>${q}</span><button onclick="add(${p.id},1)">+</button></div></div>`;
    })
    .join(
      "",
    )}</section><section class="panel"><h2>Basket summary</h2><div class="summary-row"><span>Products</span><b>${entries.length}</b></div><div class="summary-row"><span>Total units</span><b>${entries.reduce((a, [, q]) => a + q, 0)}</b></div><div class="summary-row"><span>Best complete basket</span><b>${best ? money(best.total) : "Not available"}</b></div><div class="summary-row total"><span>Estimated total</span><span>${best ? money(best.total) : "Compare shops"}</span></div><p class="muted">Delivery charges, discounts and taxes are not included in this demo estimate.</p><button class="btn full" onclick="go('compare')">Find cheapest shop →</button></section></div>`;
}
function checkoutAt(shopId, allowCollaboration = false) {
  const s = state.shops.find((x) => x.id === shopId),
    items = Object.entries(state.cart).map(([p, q]) => ({
      product: +p,
      qty: +q,
      price: s.prices[p],
    }));
  const gaps = items.filter((i) => (s.stock[i.product] || 0) < i.qty);
  if (gaps.length && !allowCollaboration) {
    toast("This shop needs partner support for part of your basket.");
    return;
  }
  const requests = [];
  for (const item of items) {
    const available = Math.min(s.stock[item.product] || 0, item.qty);
    if (available) s.stock[item.product] -= available;
    const needed = item.qty - available;
    if (needed) {
      const supplier = state.shops
        .filter(
          (x) =>
            x.id !== s.id &&
            x.verified &&
            (x.stock[item.product] || 0) >= needed,
        )
        .sort((a, b) => a.prices[item.product] - b.prices[item.product])[0];
      if (!supplier) {
        toast(
          "No partner shop can supply " +
            PRODUCTS.find((p) => p.id === item.product).name +
            ". Please change basket.",
        );
        return;
      }
      supplier.stock[item.product] -= needed;
      requests.push({
        id: Date.now() + requests.length,
        orderId: null,
        product: item.product,
        qty: needed,
        fromShop: supplier.id,
        fromName: supplier.name,
        toShop: s.id,
        toName: s.name,
        transferPrice: supplier.prices[item.product],
        status: "Accepted",
      });
    }
  }
  const total = items.reduce((a, x) => a + x.qty * x.price, 0),
    order = {
      id: Date.now(),
      customer: state.user.name,
      shop: shopId,
      shopName: s.name,
      items,
      total,
      status: "Placed",
      created: new Date().toISOString(),
      collaboration: requests.length,
    };
  requests.forEach((r) => (r.orderId = order.id));
  state.supplyRequests.unshift(...requests);
  state.orders.unshift(order);
  persist();
  state.cart = {};
  updateCartCount();
  toast(
    requests.length
      ? "Order placed — " + requests.length + " partner request(s) accepted."
      : "Demo order placed with " + s.name,
  );
  go("orders");
}
function renderOrders() {
  const orders = state.orders.filter((o) => o.customer === state.user.name);
  return `<div class="welcome"><div><h1>My orders</h1><p>Keep track of your recent purchases.</p></div></div>${orders.length ? orders.map((o) => `<div class="panel"><div style="display:flex;justify-content:space-between;gap:10px"><b>Order #${String(o.id).slice(-6)}</b><span class="pill green">${o.status}</span></div><p class="muted">${escapeHtml(o.shopName)} · ${new Date(o.created).toLocaleString()}</p><div class="cart-line"><span>${o.items.map((i) => PRODUCTS.find((p) => p.id === i.product).name + " × " + i.qty).join(" · ")}</span><b>${money(o.total)}</b></div></div>`).join("") : '<div class="panel empty"><div class="big">📦</div><b>No orders yet</b><p>Your placed orders will appear here.</p></div>'}`;
}
function renderCollaboration() {
  const relevant =
    state.user.role === "admin"
      ? state.supplyRequests
      : state.supplyRequests.filter((r) =>
          state.user.role === "shop"
            ? r.toShop === 1 || r.fromShop === 1
            : state.orders.some(
                (o) => o.id === r.orderId && o.customer === state.user.name,
              ),
        );
  return `<div class="welcome"><div><h1>Shop collaboration</h1><p>The core SynapShip workflow: nearby shops help complete a customer's basket.</p></div></div><div class="panel"><h2>How a shared order moves</h2><div class="flow"><div class="flow-step active">Customer places order</div><span class="flow-arrow">→</span><div class="flow-step active">Primary shop checks stock</div><span class="flow-arrow">→</span><div class="flow-step active">Partner shop accepts request</div><span class="flow-arrow">→</span><div class="flow-step active">Order is prepared</div><span class="flow-arrow">→</span><div class="flow-step active">Delivery completed</div></div></div>${
    relevant.length
      ? `<div class="panel"><h2>Active supply requests</h2>${relevant
          .map((r) => {
            const p = PRODUCTS.find((x) => x.id === r.product);
            return `<article class="request-card"><div style="display:flex;justify-content:space-between;gap:12px"><div><b>${p.emoji} ${p.name} × ${r.qty}</b><div class="muted">${escapeHtml(r.fromName)} supplies ${escapeHtml(r.toName)} · Transfer value ${money(r.transferPrice * r.qty)}</div></div><span class="pill green">${r.status}</span></div></article>`;
          })
          .join("")}</div>`
      : `<div class="panel empty"><div class="big">🤝</div><b>No collaboration requests yet</b><p>When a selected shop is short of an item, choose “Details” in price comparison and let a partner shop fulfill it.</p></div>`
  }`;
}
function renderShop() {
  const s = state.shops[0];
  const incoming = state.orders.filter((o) => o.shop === s.id);
  return `<div class="welcome"><div><h1>Shop dashboard</h1><p>Manage your store inventory and selling prices.</p></div><span class="pill green">Demo store: ${escapeHtml(s.name)}</span></div><div class="stat-grid"><div class="stat"><span>Products listed</span><b>${PRODUCTS.length}</b></div><div class="stat"><span>Orders received</span><b>${incoming.length}</b></div><div class="stat"><span>Store status</span><b style="font-size:18px">Active</b></div><div class="stat"><span>Marketplace</span><b style="font-size:18px">Local</b></div></div><div class="panel"><h2>Inventory and pricing</h2><p class="muted">Edit the demo store's stock and price. Changes immediately affect customer comparisons.</p><div class="table-wrap"><table class="data"><tr><th>Product</th><th>Stock</th><th>Price (₹)</th><th>Category</th></tr>${PRODUCTS.map((p) => `<tr><td>${p.emoji} ${p.name}</td><td><input class="control" style="width:85px;padding:7px" type="number" min="0" value="${s.stock[p.id]}" onchange="updateShop(${s.id},${p.id},'stock',this.value)"></td><td><input class="control" style="width:95px;padding:7px" type="number" min="1" value="${s.prices[p.id]}" onchange="updateShop(${s.id},${p.id},'prices',this.value)"></td><td>${p.cat}</td></tr>`).join("")}</table></div></div><div class="panel"><h2>Recent orders</h2>${incoming.length ? incoming.map((o) => `<div class="cart-line"><span>Order #${String(o.id).slice(-6)} · ${o.items.length} product types · <span class="pill">${o.status}</span></span>${o.status === "Placed" ? `<button class="btn" style="padding:7px 10px" onclick="setOrderStatus(${o.id},'Ready')">Mark ready</button>` : `<b>${money(o.total)}</b>`}</div>`).join("") : '<p class="muted">No orders received yet.</p>'}</div>`;
}
function updateShop(shopId, pid, field, value) {
  const s = state.shops.find((x) => x.id === shopId);
  s[field][pid] = Math.max(0, Number(value) || 0);
  persist();
  toast("Inventory updated");
}

function setOrderStatus(id, status) {
  const o = state.orders.find((x) => x.id === id);
  if (o) {
    o.status = status;
    persist();
    render();
    toast("Order status updated");
  }
}
function renderDelivery() {
  const jobs = state.orders.filter((o) =>
    ["Ready", "Picked up"].includes(o.status),
  );
  return `<div class="welcome"><div><h1>Delivery dashboard</h1><p>Manage orders ready for collection and delivery.</p></div></div><div class="stat-grid"><div class="stat"><span>Available jobs</span><b>${jobs.filter((o) => o.status === "Ready").length}</b></div><div class="stat"><span>Completed</span><b>${state.orders.filter((o) => o.status === "Delivered").length}</b></div><div class="stat"><span>Active deliveries</span><b>${jobs.filter((o) => o.status === "Picked up").length}</b></div><div class="stat"><span>Partner status</span><b style="font-size:18px">Online</b></div></div><div class="panel"><h2>Delivery assignments</h2>${jobs.length ? jobs.map((o) => `<div class="cart-line"><div><b>Order #${String(o.id).slice(-6)}</b><div class="muted">${escapeHtml(o.shopName)} → ${escapeHtml(o.customer)} · ${money(o.total)}</div><span class="pill ${o.status === "Ready" ? "orange" : "green"}">${o.status}</span></div>${o.status === "Ready" ? `<button class="btn" onclick="setOrderStatus(${o.id},'Picked up')">Pick up</button>` : `<button class="btn" onclick="setOrderStatus(${o.id},'Delivered')">Mark delivered</button>`}</div>`).join("") : '<div class="empty">No delivery jobs right now.</div>'}</div>`;
}

function renderAdmin() {
  const revenue = state.orders.reduce((a, o) => a + o.total, 0);
  return `<div class="welcome"><div><h1>Admin overview</h1><p>Marketplace activity and shop management.</p></div></div><div class="stat-grid"><div class="stat"><span>Total customers</span><b>${state.users.filter((u) => u.role === "customer").length}</b></div><div class="stat"><span>Registered shops</span><b>${state.shops.length}</b></div><div class="stat"><span>Total orders</span><b>${state.orders.length}</b></div><div class="stat"><span>Order value</span><b>${money(revenue)}</b></div></div><div class="panel"><h2>User accounts</h2><p class="muted">Passwords are stored as salted hashes and are never displayed.</p><div class="table-wrap"><table class="data"><thead><tr><th>Name</th><th>Email / username</th><th>Role</th><th>Password storage</th></tr></thead><tbody>${state.users.map((user) => `<tr><td>${escapeHtml(user.name)}</td><td>${escapeHtml(user.email)}</td><td>${escapeHtml(user.role)}</td><td><span class="pill ${user.passwordHash ? "green" : "orange"}">${user.passwordHash ? "Protected" : "Needs migration"}</span></td></tr>`).join("")}</tbody></table></div><p class="muted">This demo stores account data only in this browser; it is not a shared or production database.</p></div><div class="panel"><h2>Shops</h2><div class="table-wrap"><table class="data"><tr><th>Shop</th><th>Status</th><th>Action</th></tr>${state.shops.map((s) => `<tr><td>${escapeHtml(s.name)}</td><td><span class="pill ${s.verified ? "green" : "orange"}">${s.verified ? "Verified" : "Pending"}</span></td><td><button class="btn ${s.verified ? "danger" : "light"}" style="padding:7px 10px" onclick="verifyShop(${s.id})">${s.verified ? "Suspend" : "Verify"}</button></td></tr>`).join("")}</table></div></div><div class="panel"><h2>Recent marketplace orders</h2>${
    state.orders.length
      ? state.orders
          .slice(0, 10)
          .map(
            (o) =>
              `<div class="cart-line"><span>#${String(o.id).slice(-6)} · ${escapeHtml(o.customer)} · ${escapeHtml(o.shopName)}</span><b>${money(o.total)}</b></div>`,
          )
          .join("")
      : '<p class="muted">No orders yet.</p>'
  }</div><div class="panel"><button class="btn outline" onclick="resetDemo()">↺ Reset demo marketplace data</button></div>`;
}
function verifyShop(id) {
  const s = state.shops.find((x) => x.id === id);
  s.verified = !s.verified;
  persist();
  render();
}
function resetDemo() {
  if (!confirm("Reset demo shops, prices, stock and orders?")) return;
  localStorage.removeItem("ss_shops");
  localStorage.removeItem("ss_orders");
  localStorage.removeItem("ss_requests");
  initData();
  state.orders = [];
  state.supplyRequests = [];
  render();
  toast("Demo data reset");
}
function showProduct(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  const options = availableShops(p).sort(
    (a, b) => a.prices[p.id] - b.prices[p.id],
  );
  alert(
    p.name +
      " — shop prices\n" +
      options
        .map(
          (s) =>
            s.name +
            ": " +
            money(s.prices[p.id]) +
            " (" +
            s.stock[p.id] +
            " in stock)",
        )
        .join("\n"),
  );
}
function escapeHtml(s) {
  return String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c],
  );
}
function render() {
  updateCartCount();
  const pages = {
    home: renderHome,
    categories: renderCategories,
    products: renderProducts,
    compare: renderCompare,
    cart: renderCart,
    orders: renderOrders,
    collaboration: renderCollaboration,
    shop: renderShop,
    delivery: renderDelivery,
    admin: renderAdmin,
  };
  $("view").innerHTML = (pages[state.page] || renderHome)();
}
initData();

try {
  const savedProducts = JSON.parse(localStorage.getItem("ss_products") || "[]");
  if (!Array.isArray(savedProducts))
    throw new TypeError("Saved products must be an array.");
  customProducts = savedProducts;
  PRODUCTS.push(...customProducts);
} catch (error) {
  console.error("Unable to load saved shop products.", error);
  customProducts = [];
}

function persistProducts() {
  localStorage.setItem("ss_products", JSON.stringify(customProducts));
  persist();
}
function availableShops(p) {
  if (p.deleted) return [];
  return state.shops.filter(
    (s) =>
      s.verified &&
      (!p.custom || p.shopId === s.id) &&
      (s.stock[p.id] || 0) > 0,
  );
}
function productCard(p) {
  const shops = availableShops(p),
    qty = state.cart[p.id] || 0;
  return `<article class="product"><div class="product-top"><span class="product-emoji">${escapeHtml(p.emoji)}</span><span class="pill green">${escapeHtml(p.cat)}</span></div><h3>${escapeHtml(p.name)}</h3><div class="muted">${shops.length} local shops · per ${escapeHtml(p.unit)}</div><div class="price">From ${money(lowestPrice(p))}</div><div class="product-actions">${qty ? `<div class="qty"><button onclick="add(${p.id},-1)">−</button><span>${qty}</span><button onclick="add(${p.id},1)">+</button></div>` : `<button class="btn" style="padding:8px 12px" onclick="add(${p.id},1)">+ Add</button>`}<button class="text-btn" onclick="showProduct(${p.id})">Prices</button></div></article>`;
}
function renderProducts() {
  const products = PRODUCTS.filter(
    (p) =>
      !p.deleted &&
      (state.category === "All" || p.cat === state.category) &&
      p.name.toLowerCase().includes(state.query.toLowerCase()),
  );
  return `<div class="welcome"><div><h1>${state.category === "All" ? "All products" : escapeHtml(state.category)}</h1><p>Choose items and compare prices from verified neighbourhood shops.</p></div><select class="control" style="max-width:190px" onchange="state.category=this.value;render()"><option>All</option>${CATEGORIES.map((c) => `<option ${state.category === c[0] ? "selected" : ""}>${escapeHtml(c[0])}</option>`).join("")}</select></div><div class="product-grid">${products.length ? products.map(productCard).join("") : '<div class="panel empty">No products found.</div>'}</div>`;
}
function renderShop() {
  const s = state.shops[0],
    incoming = state.orders.filter((o) => o.shop === s.id),
    products = PRODUCTS.filter(
      (p) => !p.deleted && (!p.custom || p.shopId === s.id),
    );
  return `<div class="welcome"><div><h1>Shop dashboard</h1><p>Manage your store inventory and selling prices.</p></div><span class="pill green">Demo store: ${escapeHtml(s.name)}</span></div>
 <div class="stat-grid"><div class="stat"><span>Products listed</span><b>${products.length}</b></div><div class="stat"><span>Orders received</span><b>${incoming.length}</b></div><div class="stat"><span>Store status</span><b style="font-size:18px">Active</b></div><div class="stat"><span>Marketplace</span><b style="font-size:18px">Local</b></div></div>
 <div class="panel"><h2>Add a product</h2><p class="muted">New products appear in the marketplace and are listed for this demo store.</p>
 <form onsubmit="event.preventDefault();addShopProduct()"><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:12px;align-items:end">
 <div class="field"><label for="new-product-name">Product name</label><input id="new-product-name" maxlength="60" required placeholder="e.g. Orange juice"></div>
 <div class="field"><label for="new-product-category">Category</label><select id="new-product-category" required>${CATEGORIES.map((c) => `<option value="${escapeHtml(c[0])}">${escapeHtml(c[0])}</option>`).join("")}</select></div>
 <div class="field"><label for="new-product-unit">Unit</label><input id="new-product-unit" maxlength="20" required placeholder="e.g. bottle"></div>
 <div class="field"><label for="new-product-price">Price (₹)</label><input id="new-product-price" type="number" min="0.01" step="0.01" required placeholder="Price"></div>
 <div class="field"><label for="new-product-stock">Stock</label><input id="new-product-stock" type="number" min="0" step="1" required placeholder="Quantity"></div>
 <div class="field"><label for="new-product-emoji">Emoji (optional)</label><input id="new-product-emoji" maxlength="8" placeholder="📦"></div>
 </div><button class="btn" type="submit">Add product</button></form></div>
 <div class="panel"><h2>Inventory and pricing</h2><p class="muted">Edit stock and price. Changes immediately affect customer comparisons.</p><div class="table-wrap"><table class="data"><tr><th>Product</th><th>Stock</th><th>Price (₹)</th><th>Category</th><th>Action</th></tr>${products.map((p) => `<tr><td>${escapeHtml(p.emoji)} ${escapeHtml(p.name)}</td><td><input class="control" style="width:85px;padding:7px" type="number" min="0" step="1" value="${s.stock[p.id] ?? 0}" onchange="updateShop(${s.id},${p.id},'stock',this.value)"></td><td><input class="control" style="width:95px;padding:7px" type="number" min="0.01" step="0.01" value="${s.prices[p.id] ?? p.price}" onchange="updateShop(${s.id},${p.id},'prices',this.value)"></td><td>${escapeHtml(p.cat)}</td><td>${p.custom ? `<button class="btn danger" style="padding:7px 10px" onclick="deleteShopProduct(${p.id})">Delete</button>` : '<span class="muted">Standard</span>'}</td></tr>`).join("")}</table></div></div>
 <div class="panel"><h2>Recent orders</h2>${incoming.length ? incoming.map((o) => `<div class="cart-line"><span>Order #${String(o.id).slice(-6)} · ${o.items.length} product types · <span class="pill">${escapeHtml(o.status)}</span></span>${o.status === "Placed" ? `<button class="btn" style="padding:7px 10px" onclick="setOrderStatus(${o.id},'Ready')">Mark ready</button>` : `<b>${money(o.total)}</b>`}</div>`).join("") : '<p class="muted">No orders received yet.</p>'}</div>`;
}
function addShopProduct() {
  if (state.user?.role !== "shop")
    return toast("Only shopkeepers can add products.");
  const name = $("new-product-name").value.trim(),
    category = $("new-product-category").value,
    unit = $("new-product-unit").value.trim(),
    price = Number($("new-product-price").value),
    stock = Number($("new-product-stock").value),
    emoji = $("new-product-emoji").value.trim() || "📦",
    shop = state.shops[0];
  if (!name || name.length > 60 || !unit || unit.length > 20)
    return toast("Enter a product name and unit.");
  if (/[<>]/.test(name + unit + emoji))
    return toast("Product details cannot contain < or >.");
  if (!CATEGORIES.some((c) => c[0] === category))
    return toast("Choose a valid product category.");
  if (!Number.isFinite(price) || price <= 0)
    return toast("Enter a price greater than zero.");
  if (!Number.isInteger(stock) || stock < 0)
    return toast("Enter a whole-number stock quantity of zero or more.");
  let id = Date.now();
  while (PRODUCTS.some((p) => p.id === id)) id++;
  const product = {
    id,
    name,
    emoji,
    price,
    cat: category,
    unit,
    custom: true,
    shopId: shop.id,
  };
  customProducts.push(product);
  PRODUCTS.push(product);
  shop.prices[id] = price;
  shop.stock[id] = stock;
  persistProducts();
  toast("Product added to your shop.");
  render();
}
function deleteShopProduct(id) {
  if (state.user?.role !== "shop")
    return toast("Only shopkeepers can delete products.");
  const product = customProducts.find(
    (p) => p.id === id && p.shopId === state.shops[0].id,
  );
  if (!product) return toast("Product not found in your shop.");
  if (!confirm(`Delete "${product.name}" from your shop?`)) return;
  product.deleted = true;
  delete state.shops[0].prices[id];
  delete state.shops[0].stock[id];
  delete state.cart[id];
  persistProducts();
  toast("Product deleted.");
  render();
}
function resetDemo() {
  if (!confirm("Reset demo shops, products, prices, stock and orders?")) return;
  localStorage.removeItem("ss_products");
  localStorage.removeItem("ss_shops");
  localStorage.removeItem("ss_orders");
  localStorage.removeItem("ss_requests");
  customProducts = [];
  for (let i = PRODUCTS.length - 1; i >= 0; i--)
    if (PRODUCTS[i].custom) PRODUCTS.splice(i, 1);
  initData();
  state.orders = [];
  state.supplyRequests = [];
  persist();
  render();
  toast("Demo data reset");
}
passwordMigration = migrateLegacyPasswords().catch((error) => {
  console.error("Unable to secure saved account passwords.", error);
  toast("Saved passwords could not be secured. Account sign-in is unavailable.");
  return false;
});
