// ambil data dari localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// tambah item ke cart
function addToCart(name, price, desc, img) {
  let existing = cart.find((item) => item.name === name);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, desc, img, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// ubah qty
function changeQty(index, change) {
  cart[index].qty += change;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// hapus item
function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// render cart + total
function renderCart() {
  let total = 0;

  document.getElementById("cartItems").innerHTML = cart
    .map((item, index) => {
      let subtotal = item.price * item.qty;
      total += subtotal;

      return `
      <div class="cart-item">
        <img src="${item.img || "images/logo.png"}" />
        <div class="info">
          <strong>${item.name}</strong>
          <p>${item.desc || ""}</p>
          <div class="qty">
            <button onclick="changeQty(${index}, -1)">-</button>
            <span>${item.qty}</span>
            <button onclick="changeQty(${index}, 1)">+</button>
          </div>
          <small>Rp${subtotal.toLocaleString("id-ID")}</small>
        </div>
        <button onclick="removeItem(${index})">❌</button>
      </div>
    `;
    })
    .join("");

  document.getElementById("totalHarga").innerText =
    "Total: Rp" + total.toLocaleString("id-ID");
}

// checkout via WhatsApp
function orderWA() {
  let nama = document.getElementById("nama").value.trim();
  let alamat = document.getElementById("alamat").value.trim();

  if (!nama || !alamat) {
    alert("⚠️ Nama dan alamat harus diisi dulu ya!");
    return;
  }

  if (cart.length === 0) {
    alert("⚠️ Keranjang masih kosong, tambahkan produk dulu!");
    return;
  }

  let text = "� *Pesanan Gas LPG - GasMart*%0A%0A";
  let total = 0;

  cart.forEach((item, i) => {
    let subtotal = item.price * item.qty;
    total += subtotal;
    text += `${i + 1}. ${item.name} x${item.qty}%0A`;
    text += `   Rp${subtotal.toLocaleString("id-ID")}%0A`;
  });

  text += `%0A🚚 Ongkir: Gratis%0A`;
  text += `💰 *Total: Rp${total.toLocaleString("id-ID")}*%0A%0A`;
  text += `👤 Nama: ${nama}%0A`;
  text += `📍 Alamat: ${alamat}%0A%0A`;
  text += `🔁 _Siapkan tabung kosong untuk isi ulang_`;

  window.open("https://wa.me/62895394023138?text=" + text);
}

// load cart saat pertama buka
renderCart();
