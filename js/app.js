/* app.js — Site logic: data, rendering for homepage, shop, product pages, filters, search */

// Sample product data (id must be unique)
window.products = [
  {id:'rod-1', name:'Coastal Spinning Rod 7ft', price:129.99, category:'Rods', images:[
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=60'
  ], description:'Lightweight and sensitive spinning rod ideal for coastal fishing.'},

  {id:'reel-1', name:'ProCast Reel 3000', price:89.99, category:'Reels', images:['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=60'], description:'Smooth drag and corrosion-resistant components.'},

  {id:'bait-1', name:'NightGlow Soft Bait (Pack)', price:12.49, category:'Baits', images:['https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&q=60'], description:'High-attraction soft lures for night fishing.'},

  {id:'accessory-1', name:'Tackle Box Pro', price:45.00, category:'Accessories', images:['https://images.unsplash.com/photo-1581579180177-7c7b8b8a2f13?auto=format&fit=crop&w=800&q=60'], description:'Durable tackle box with customizable compartments.'},

  {id:'rod-2', name:'Freshwater Graphite Rod 6ft', price:99.50, category:'Rods', images:['https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=60'], description:'Perfect for river and lake fishing.'},

  {id:'reel-2', name:'SaltGuard Reel 4000', price:149.00, category:'Reels', images:['https://images.unsplash.com/photo-1550980666-5f0d0d2a7b3d?auto=format&fit=crop&w=800&q=60'], description:'Heavy-duty reel with saltwater protection.'}
];

// Render featured products on homepage (3 items)
function renderFeatured(){
  const el = document.getElementById('featured-products');
  if(!el) return;
  const featured = window.products.slice(0,3);
  el.innerHTML = featured.map(p=>`
    <article class="card product-card">
      <img src="${p.images[0]}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p class="muted">${p.category}</p>
      <p class="price">$${p.price.toFixed(2)}</p>
      <div style="display:flex;gap:.5rem;margin-top:.5rem">
        <a class="btn" href="product.html?id=${p.id}">View</a>
        <button class="btn btn-primary" onclick="addToCart('${p.id}')">Add to cart</button>
      </div>
    </article>
  `).join('');
}

// Render products for shop page with filtering
function renderShop(options={category:'all',search:''}){
  const el = document.getElementById('products-grid');
  if(!el) return;
  const filtered = window.products.filter(p=>{
    if(options.category && options.category !== 'all' && p.category !== options.category) return false;
    if(options.search && !p.name.toLowerCase().includes(options.search.toLowerCase())) return false;
    return true;
  });
  if(filtered.length === 0){ el.innerHTML = '<p class="muted">No products found.</p>'; return; }
  el.innerHTML = filtered.map(p=>`
    <article class="card product-card">
      <img src="${p.images[0]}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p class="muted">${p.category}</p>
      <p class="price">$${p.price.toFixed(2)}</p>
      <div style="display:flex;gap:.5rem;margin-top:.5rem">
        <a class="btn" href="product.html?id=${p.id}">View</a>
        <button class="btn btn-primary" onclick="addToCart('${p.id}')">Add to cart</button>
      </div>
    </article>
  `).join('');
}

// Render product detail page
function renderProductPage(){
  const main = document.getElementById('product-main');
  if(!main) return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if(!id){ main.innerHTML = '<p>Product not found.</p>'; return; }
  const p = window.products.find(x=>x.id === id);
  if(!p){ main.innerHTML = '<p>Product not found.</p>'; return; }

  // Related products: same category, exclude current
  const related = window.products.filter(x=>x.category === p.category && x.id !== p.id).slice(0,3);

  main.innerHTML = `
    <div class="grid grid-2 product-page">
      <div>
        <div class="card gallery">
          <img id="hero-img" src="${p.images[0]}" alt="${p.name}">
          <div class="thumb-row">
            ${p.images.map(img=>`<img src="${img}" onclick="document.getElementById('hero-img').src='${img}'">`).join('')}
          </div>
        </div>
      </div>
      <div>
        <div class="card">
          <h2>${p.name}</h2>
          <p class="muted">${p.category}</p>
          <p class="price">$${p.price.toFixed(2)}</p>
          <p>${p.description}</p>
          <div style="margin-top:1rem">
            <button class="btn" onclick="location.href='shop.html'">Continue Shopping</button>
            <button class="btn btn-primary" onclick="addToCart('${p.id}')">Add to cart</button>
          </div>
        </div>

        <div style="margin-top:1rem">
          <h3>Related Products</h3>
          <div class="grid grid-3">${related.map(r=>`
            <div class="card">
              <img src="${r.images[0]}" style="height:100px;object-fit:cover;width:100%">
              <h4 style="margin:.4rem 0">${r.name}</h4>
              <div class="muted">$${r.price.toFixed(2)}</div>
              <div style="margin-top:.4rem"><button class="btn" onclick="location.href='product.html?id=${r.id}'">View</button></div>
            </div>
          `).join('')}</div>
        </div>
      </div>
    </div>
  `;
}

// Wire up search & filter on shop page
function initShopControls(){
  const cat = document.getElementById('category');
  const search = document.getElementById('search');
  if(cat) cat.addEventListener('change',()=>renderShop({category:cat.value,search:search?search.value:''}));
  if(search) search.addEventListener('input',()=>renderShop({category:cat?cat.value:'all',search:search.value}));
}

// Contact form behavior
function initContactForm(){
  const form = document.getElementById('contact-form');
  if(!form) return;
  form.addEventListener('submit',(e)=>{
    e.preventDefault();
    document.getElementById('contact-feedback').textContent = 'Thanks! Your message has been sent (demo).';
    form.reset();
  })
}

// Initialize small helpers depending on page
document.addEventListener('DOMContentLoaded',()=>{
  try{ renderFeatured(); }catch(e){}
  try{ renderShop({category:'all',search:''}); initShopControls(); }catch(e){}
  try{ renderProductPage(); }catch(e){}
  try{ initContactForm(); }catch(e){}
  // ensure cart modal is present and up-to-date
  renderCartModal();
});
