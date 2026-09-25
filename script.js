// ✅ ambil data dari localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// tambah item
function addToCart(name, price, desc, img) {
  // cek kalau barang sudah ada → tambah qty
  let existing = cart.find((item) => item.name === name);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, desc, img, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

//Quantity
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

// tambah custom item
function addCustomItem() {
  let name = document.getElementById("customItem").value;
  let price = parseInt(document.getElementById("customPrice").value);
  let note = document.getElementById("customNote").value;

  if (name && price) {
    let existing = cart.find((item) => item.name === name);

    if (existing) {
      existing.qty += 1;
      if (note) existing.note = note; // update catatan
    } else {
      cart.push({
        name,
        price,
        desc: "Pesanan custom",
        img: "images/logo.png",
        qty: 1,
        note: note,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();

    // reset
    document.getElementById("customItem").value = "";
    document.getElementById("customPrice").value = "";
    document.getElementById("customNote").value = "";
  } else {
    alert("Isi nama dan harga dulu bro!");
  }
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
          
          ${item.note ? `<small>📝 ${item.note}</small>` : ""}

          <div class="qty">
            <button onclick="changeQty(${index}, -1)">-</button>
            <span>${item.qty}</span>
            <button onclick="changeQty(${index}, 1)">+</button>
          </div>

          <small>Rp${subtotal.toLocaleString()}</small>
        </div>

        <button onclick="removeItem(${index})">❌</button>
      </div>
    `;
    })
    .join("");

  let ongkir = cart.length == 0 - 1;
  let totalFinal = total + ongkir;

  document.getElementById("totalHarga").innerText = "Total: Rp" + totalFinal.toLocaleString();
}

// checkout WA (FIX)
function orderWA() {
  let nama = document.getElementById("nama").value;
  let alamat = document.getElementById("alamat").value;

  let text = "🛒 *Pesanan* %0A%0A";
  let total = 0;

  cart.forEach((item, i) => {
    let subtotal = item.price * item.qty;
    total += subtotal;

    text += `${i + 1}. ${item.name} x${item.qty}%0A`;
    if (item.note) {
      text += `   📝 ${item.note}%0A`;
    }
    text += `   Rp${subtotal.toLocaleString()}%0A`;
  });

  let ongkir = cart.length > 0 ? 5000 : 0;
  let totalFinal = total + ongkir;

  text += `%0A🚚 Ongkir: Rp${ongkir.toLocaleString()}%0A`;
  text += `💰 *Total: Rp${totalFinal.toLocaleString()}*%0A%0A`;

  text += `👤 Nama: ${nama}%0A`;
  text += `📍 Alamat: ${alamat}`;

  window.open("https://wa.me/62895394023138?text=" + text);
}

// pertama load
renderCart();
