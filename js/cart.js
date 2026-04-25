/* cart.js — Frontend cart stored in localStorage
   - addToCart(id), removeFromCart(id), getCart(), setCart()
   - renders a small cart modal showing items and totals
*/

function getCart(){
  try{
    return JSON.parse(localStorage.getItem('pescorama_cart')) || [];
  }catch(e){return []}
}
function setCart(cart){
  localStorage.setItem('pescorama_cart', JSON.stringify(cart));
  updateCartCount();
}

function addToCart(id, qty=1){
  const cart = getCart();
  const found = cart.find(i=>i.id === id);
  if(found) found.qty += qty; else cart.push({id,qty});
  setCart(cart);
  renderCartModal();
}

function removeFromCart(id){
  let cart = getCart();
  cart = cart.filter(i=>i.id !== id);
  setCart(cart);
  renderCartModal();
}

function updateCartCount(){
  const el = document.getElementById('cart-count');
  if(el) el.textContent = getCart().reduce((s,i)=>s+i.qty,0);
}

function clearCart(){ setCart([]); }

function renderCartModal(){
  const modal = document.getElementById('cart-modal');
  if(!modal) return;
  const cart = getCart();
  if(cart.length === 0){
    modal.innerHTML = `<div class="card"> <strong>Your cart is empty</strong> <div style="margin-top:.5rem"><button class="btn" onclick="clearCart();renderCartModal();">Clear</button></div></div>`;
    updateCartCount();
    return;
  }
  // We need product info from window.products (defined in app.js)
  let total = 0;
  const rows = cart.map(item=>{
    const p = (window.products||[]).find(x=>x.id===item.id);
    if(!p) return '';
    const subtotal = (p.price * item.qty).toFixed(2);
    total += p.price * item.qty;
    return `<div class="cart-row">
      <div>
        <strong>${p.name}</strong>
        <div class="muted">${item.qty} x $${p.price.toFixed(2)}</div>
      </div>
      <div>
        <button class="btn" onclick="removeFromCart('${p.id}')">Remove</button>
      </div>
    </div>`;
  }).join('');

  modal.innerHTML = `<div class="card">
    <h4>Cart</h4>
    <div class="cart-list">${rows}</div>
    <div style="margin-top:.8rem"><strong>Total: $${total.toFixed(2)}</strong></div>
    <div style="margin-top:.6rem;display:flex;gap:.5rem"><button class="btn btn-primary" onclick="checkout()">Checkout</button><button class="btn" onclick="clearCart();renderCartModal()">Clear</button></div>
  </div>`;
  updateCartCount();
}

function checkout(){
  // Simple front-end simulation
  alert('Checkout simulated. Thank you!');
  clearCart();
  renderCartModal();
}

// Close cart when clicking outside or pressing Escape
document.addEventListener('click',(e)=>{
  const modal = document.getElementById('cart-modal');
  if(!modal || modal.hidden) return;
  // if click is outside modal and not on cart button, close
  if(!modal.contains(e.target) && !e.target.closest('.cart-btn')){
    modal.hidden = true;
  }
});

document.addEventListener('keydown',(e)=>{
  if(e.key === 'Escape'){
    const modal = document.getElementById('cart-modal');
    if(modal) modal.hidden = true;
  }
});

// Update cart count on storage events (useful if multiple tabs)
window.addEventListener('storage',(e)=>{
  if(e.key === 'pescorama_cart') updateCartCount();
});

// Expose for testing in console
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.getCart = getCart;
