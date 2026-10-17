// ============================================================
// GASMART — Cart & Checkout Logic
// ============================================================

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ===== TAMBAH ITEM =====
function addToCart(name, price, desc, img) {
  const existing = cart.find((item) => item.name === name);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, desc, img, qty: 1 });
  }

  saveCart();
  renderCart();
  flashCartPanel();
}

// ===== UBAH QTY =====
function changeQty(index, change) {
  cart[index].qty += change;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  saveCart();
  renderCart();
}

// ===== HAPUS ITEM =====
function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

// ===== SIMPAN KE LOCALSTORAGE =====
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ===== RENDER CART =====
function renderCart() {
  const cartItemsEl  = document.getElementById("cartItems");
  const totalEl      = document.getElementById("totalHarga");
  const countEl      = document.getElementById("cartCount");

  let total = 0;

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `
      <p style="
        text-align:center;
        padding: 16px 0;
        font-size: 12px;
        color: var(--muted);
        font-family: var(--font-mono);
        letter-spacing: 0.08em;
      ">— Keranjang kosong —</p>
    `;
  } else {
    cartItemsEl.innerHTML = cart
      .map((item, index) => {
        const subtotal = item.price * item.qty;
        total += subtotal;

        return `
          <div class="cart-item">
            <img src="${item.img || "images/logo.png"}" alt="${item.name}" />
            <div class="info">
              <strong>${item.name}</strong>
              <p>${item.desc || ""}</p>
              <div class="qty">
                <button onclick="changeQty(${index}, -1)" aria-label="Kurangi ${item.name}">−</button>
                <span>${item.qty}</span>
                <button onclick="changeQty(${index}, 1)" aria-label="Tambah ${item.name}">+</button>
              </div>
              <small>Rp${subtotal.toLocaleString("id-ID")}</small>
            </div>
            <button
              class="remove-btn"
              onclick="removeItem(${index})"
              aria-label="Hapus ${item.name}"
            >✕</button>
          </div>
        `;
      })
      .join("");
  }

  // update total
  const totalFormatted = total.toLocaleString("id-ID");
  totalEl.innerHTML    = `Total: <strong>Rp${totalFormatted}</strong>`;

  // update item count badge
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  countEl.textContent = totalQty === 0
    ? "0 item"
    : `${totalQty} item`;
}

// ===== FLASH ANIMASI CART PANEL =====
function flashCartPanel() {
  const panel = document.getElementById("cartPanel");
  if (!panel) return;
  panel.style.borderTopColor = "var(--accent)";
  setTimeout(() => {
    panel.style.borderTopColor = "";
  }, 400);
}

// ===== CHECKOUT VIA WHATSAPP =====
function orderWA() {
  const nama   = document.getElementById("nama").value.trim();
  const alamat = document.getElementById("alamat").value.trim();

  if (!nama || !alamat) {
    // scroll ke form & highlight
    document.getElementById("order").scrollIntoView({ behavior: "smooth", block: "center" });
    if (!nama)   shakeInput("nama");
    if (!alamat) shakeInput("alamat");
    return;
  }

  if (cart.length === 0) {
    alert("⚠️ Keranjang masih kosong, tambahkan produk dulu!");
    return;
  }

  let text  = "🔥 *Pesanan Gas LPG — GasMart*%0A%0A";
  let total = 0;

  cart.forEach((item, i) => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    text  += `${i + 1}. ${item.name} ×${item.qty}%0A`;
    text  += `   Rp${subtotal.toLocaleString("id-ID")}%0A`;
  });

  text += `%0A🚚 Ongkir: *Gratis*%0A`;
  text += `💰 *Total: Rp${total.toLocaleString("id-ID")}*%0A%0A`;
  text += `👤 Nama: ${nama}%0A`;
  text += `📍 Alamat: ${alamat}%0A%0A`;
  text += `🔁 _Siapkan tabung kosong untuk isi ulang_`;

  window.open("https://wa.me/62895394023138?text=" + text);

  // kosongkan cart setelah order berhasil
  cart = [];
  saveCart();
  renderCart();
}

// ===== SHAKE ANIMASI INPUT INVALID =====
function shakeInput(id) {
  const el = document.getElementById(id);
  if (!el) return;

  el.style.borderColor = "#FF4D4D";
  el.style.animation   = "shake 0.4s ease";

  el.addEventListener("animationend", () => {
    el.style.animation = "";
  }, { once: true });

  el.focus();
}

// inject shake keyframes sekali
const shakeStyle = document.createElement("style");
shakeStyle.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%      { transform: translateX(-6px); }
    40%      { transform: translateX(6px); }
    60%      { transform: translateX(-4px); }
    80%      { transform: translateX(4px); }
  }
`;
document.head.appendChild(shakeStyle);

// ===== INIT =====
renderCart();
