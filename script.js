const API_URL =
  "https://script.google.com/macros/s/AKfycbzt5k-dhOApEULIsEzgysUwP3v2mexk6JpB5KaC2mSV1gp9WfDq7EC4eBbpvoPQ-hVRHg/exec";

let cart = [];

async function loadProducts() {
  const res = await fetch(API_URL);
  const products = await res.json();

  const container = document.getElementById("product-list");
  container.innerHTML = "";

  products.forEach((p) => {
    container.innerHTML += `
      <div class="product">
        <img src="${p.imagem}">
        <h3>${p.nome}</h3>
        <p>R$ ${parseFloat(p.preco).toFixed(2)}</p>
        <p>Estoque: ${p.estoque}</p>
        <button onclick='addToCart(${JSON.stringify(p)})'>
          Comprar
        </button>
      </div>
    `;
  });
}

function addToCart(product) {
  const existing = cart.find((i) => i.id === product.id);

  if (existing) {
    existing.quantidade++;
  } else {
    product.quantidade = 1;
    cart.push(product);
  }

  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    total += item.preco * item.quantidade;

    cartItems.innerHTML += `
      <p>${item.nome} (${item.quantidade}) - R$ ${(item.preco * item.quantidade).toFixed(2)}</p>
    `;
  });

  cartTotal.innerText = total.toFixed(2);
  cartCount.innerText = cart.length;
}

function toggleCart() {
  document.getElementById("cart").classList.toggle("open");
}

function scrollCarousel(dir) {
  document
    .getElementById("product-list")
    .scrollBy({ left: dir * 300, behavior: "smooth" });
}

async function finalizarCompra() {
  if (cart.length === 0) {
    alert("Carrinho vazio");
    return;
  }

  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "comprar",
      itens: cart,
    }),
  });

  alert("Pedido realizado com sucesso!");
  cart = [];
  updateCart();
  loadProducts();
}

loadProducts();
