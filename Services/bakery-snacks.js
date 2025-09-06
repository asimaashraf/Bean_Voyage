document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  // 🔹 Hamburger toggle
  menuToggle?.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
});

// === Go To Checkout ===
function goToCheckout() {
  window.location.href = "../frontend/checkout.html";
}

// === Cart Drawer ===
const LS_KEY     = "snacks_cart";   // unique key for bakery snacks cart
const cartBtn    = document.getElementById("openCart");
const closeCart  = document.getElementById("closeCart");
const drawer     = document.getElementById("cartDrawer");
const overlay    = document.getElementById("cartOverlay");
const listEl     = document.getElementById("cartList");
const subtotalEl = document.getElementById("cartSubtotal");
const badge      = document.getElementById("cartCount");

// --- Helpers ---
function getCart(){ 
  return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); 
}
function saveCart(c){ 
  localStorage.setItem(LS_KEY, JSON.stringify(c)); 
}

function openDrawer(){
  drawer.classList.add("open");
  overlay.classList.add("show");
  drawer.setAttribute("aria-hidden","false");
}
function closeDrawer(){
  drawer.classList.remove("open");
  overlay.classList.remove("show");
  drawer.setAttribute("aria-hidden","true");
}

cartBtn?.addEventListener("click", openDrawer);
closeCart?.addEventListener("click", closeDrawer);
overlay?.addEventListener("click", closeDrawer);

function currency(n){ 
  return "Rs " + Number(n).toFixed(2); 
}

// --- Render Cart ---
function renderCart(){
  const cart = getCart();
  badge.textContent = cart.reduce((sum,i)=>sum+i.qty,0);

  listEl.innerHTML = cart.map(item => `
    <li class="cart-item">
      <img src="${item.img}" alt="${item.name}">
      <div>
        <div class="item-name">${item.name}</div>
        <div class="item-meta">${item.qty} × ${currency(item.price)}</div>
      </div>
      <button class="remove" data-id="${item.id}">
        <i class="fa fa-trash"></i>
      </button>
    </li>
  `).join("") || `<p style="color:#7b5a45">Your cart is empty.</p>`;

  const subtotal = cart.reduce((s,i)=> s + i.price*i.qty, 0);
  subtotalEl.textContent = currency(subtotal);

  // remove item
  listEl.querySelectorAll(".remove").forEach(btn=>{
    btn.addEventListener("click", e=>{
      const id = e.currentTarget.dataset.id;
      let c = getCart().filter(x => String(x.id) !== String(id));
      saveCart(c); renderCart();
    });
  });
}

// --- Add to Cart ---
function addToCart({id,name,price,img}){
  let cart = getCart();
  const found = cart.find(i => String(i.id) === String(id));

  if(found){ 
    found.qty += 1; 
  } else { 
    cart.push({id,name,price: Number(price), img, qty: 1}); 
  }

  saveCart(cart); 
  renderCart();
}

// --- Attach Add to Cart buttons ---
document.querySelectorAll(".card").forEach(card=>{
  const btn = card.querySelector(".add");
  if(btn){
    btn.addEventListener("click", ()=>{
      const data = {
        id:    card.dataset.id,
        name:  card.dataset.name,
        price: card.dataset.price,
        img:   card.querySelector("img").src
      };
      addToCart(data);
    });
  }
});

// --- Initial Render ---
renderCart();
