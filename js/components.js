/* components.js
   - Renders header and footer across pages to keep markup DRY
   - Updates cart count by reading from cart storage
*/

// Simple SVG logo
const logoSVG = `
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="6" cy="6" r="5" fill="#FF2D95" />
  <path d="M20 18c-2-2-2-6 0-8" stroke="#222831" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M18 12c0 2 2 6 6 6" stroke="#222831" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
</svg>
`;

function getCartCount(){
  try{
    const raw = localStorage.getItem('pescorama_cart');
    if(!raw) return 0;
    const cart = JSON.parse(raw);
    return cart.reduce((s,i)=>s+i.qty,0);
  }catch(e){return 0}
}

function renderHeader(){
  const headerEl = document.getElementById('site-header');
  if(!headerEl) return;
  headerEl.innerHTML = `
  <header class="header">
    <div class="container header-inner">
      <div class="logo">
        <div class="logo-img">${logoSVG}</div>
        <div>
          <a href="index.html" aria-label="Pescorama home"><strong>Pescorama</strong></a>
          <div class="muted small">Fishing gear & advice</div>
        </div>
      </div>

      <nav class="nav">
        <a href="index.html">Home</a>
        <a href="shop.html">Shop</a>
        <a href="about.html">About</a>
        <a href="contact.html">Contact</a>
        <button class="btn cart-btn" id="open-cart" aria-label="Open cart">
          <i class="fa fa-shopping-cart"></i>
          <span class="cart-count" id="cart-count">${getCartCount()}</span>
        </button>
      </nav>
    </div>
  </header>
  `;
  const cartBtn = document.getElementById('open-cart');
  if(cartBtn) cartBtn.addEventListener('click',()=>{
    const modal = document.getElementById('cart-modal');
    if(modal) modal.hidden = !modal.hidden;
    renderCartModal();
  })
}

function renderFooter(){
  const footerEl = document.getElementById('site-footer');
  if(!footerEl) return;
  footerEl.innerHTML = `
  <footer class="footer">
    <div class="container">
      <div class="grid grid-3">
        <div>
          <h3>Pescorama</h3>
          <p class="muted">Quality fishing gear & friendly advice since 1998.</p>
        </div>
        <div>
          <h4>Contact</h4>
          <p class="muted">hello@pescorama.example • 123 Harbor Lane</p>
          <div class="newsletter">
            <input id="newsletter-email" placeholder="Your email">
            <button id="newsletter-btn" class="btn">Subscribe</button>
          </div>
        </div>
        <div>
          <h4>Follow Us</h4>
          <p>
            <a href="#"><i class="fab fa-instagram"></i> Instagram</a><br>
            <a href="#"><i class="fab fa-facebook"></i> Facebook</a>
          </p>
        </div>
      </div>
    </div>
  </footer>
  `;

  document.getElementById('newsletter-btn').addEventListener('click',()=>{
    const email = document.getElementById('newsletter-email').value;
    if(email) alert('Thanks! Subscribed: '+email);
  })
}

// Initialize header/footer and ensure cart count is updated across pages
function initUI(){
  renderHeader();
  renderFooter();
}

// If DOM ready
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', initUI);
}else{initUI();}
