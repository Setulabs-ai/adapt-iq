(function() {
  var css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  
  .adaptiq-widget-container {
    background: linear-gradient(145deg, rgba(255,255,255,0.95), rgba(255,255,255,0.8));
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255,255,255,0.8);
    border-radius: 24px;
    margin: 40px 1.5rem;
    padding: 32px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    box-shadow: 0 20px 40px rgba(0,0,0,0.04), inset 0 0 0 1px rgba(255,255,255,0.5);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    overflow: hidden;
  }
  .adaptiq-widget-container::before {
    content: '';
    position: absolute;
    top: -50%; left: -50%; right: -50%; bottom: -50%;
    background: radial-gradient(circle at center, rgba(124, 109, 250, 0.05) 0%, transparent 50%);
    z-index: 0;
    pointer-events: none;
  }
  .adaptiq-widget-container:hover {
    box-shadow: 0 30px 60px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.8);
    transform: translateY(-2px);
  }
  .adaptiq-widget-title {
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
    font-size: 1.4rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    display: flex;
    z-index: 1;
    position: relative;
  }
  .adaptiq-widget-title svg {
    width: 24px;
    height: 24px;
    filter: drop-shadow(0 4px 6px rgba(124, 109, 250, 0.3));
  }
  .adaptiq-product-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 24px;
    display: grid;
    z-index: 1;
    position: relative;
  }
  .adaptiq-product-card {
    cursor: pointer;
    background: #ffffff;
    border-radius: 16px;
    flex-direction: column;
    padding: 16px;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    display: flex;
    box-shadow: 0 4px 15px rgba(0,0,0,0.03);
    border: 1px solid rgba(0,0,0,0.02);
    position: relative;
    overflow: hidden;
  }
  .adaptiq-product-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    border-radius: 16px;
    background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%);
    z-index: 1;
    pointer-events: none;
  }
  .adaptiq-product-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0,0,0,0.08);
  }
  .adaptiq-product-image-container {
    background: #f8fafc;
    border-radius: 12px;
    padding: 12px;
    margin-bottom: 16px;
    z-index: 2;
    position: relative;
    overflow: hidden;
  }
  .adaptiq-product-image {
    aspect-ratio: 1;
    object-fit: contain;
    width: 100%;
    mix-blend-mode: multiply;
    transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
  }
  .adaptiq-product-card:hover .adaptiq-product-image {
    transform: scale(1.1) rotate(2deg);
  }
  .adaptiq-product-name {
    color: #1e293b;
    margin: 0 0 6px;
    font-size: 0.95rem;
    font-weight: 700;
    line-height: 1.3;
    z-index: 2;
    position: relative;
  }
  .adaptiq-product-price {
    margin: 0;
    font-size: 1rem;
    font-weight: 800;
    z-index: 2;
    position: relative;
  }
  .adaptiq-add-btn {
    width: 100%;
    padding: 12px;
    margin-top: 16px;
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    color: white;
    border: none;
    border-radius: 99px;
    font-weight: 700;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 2;
    position: relative;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
  }
  .adaptiq-add-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(15, 23, 42, 0.3);
    background: linear-gradient(135deg, #334155 0%, #1e293b 100%);
  }
  .adaptiq-add-btn:active {
    transform: translateY(0);
  }
  .adaptiq-powered-by {
    color: #94a3b8;
    text-align: right;
    justify-content: flex-end;
    align-items: center;
    gap: 6px;
    margin-top: 24px;
    font-size: 0.75rem;
    font-weight: 600;
    display: flex;
    opacity: 0.6;
    transition: opacity 0.2s;
    z-index: 1;
    position: relative;
  }
  .adaptiq-powered-by:hover {
    opacity: 1;
  }
  .adaptiq-search-dropdown {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    z-index: 9999;
    padding: 12px;
    font-family: 'Inter', sans-serif;
  }
  `;
  var e = document.createElement(`style`);
  e.textContent = css;
  document.head.appendChild(e);

  var scriptTag = document.currentScript || document.querySelector(`script[src*="widget.js"]`);
  var appHost = scriptTag ? new URL(scriptTag.src).origin : window.location.origin;
  var apiUrl = appHost + `/api`;

  class AdaptIQWidget {
    constructor() {
      this.storeId = null;
      this.currentProductId = null;
      this.config = null;
      this.themeConfig = { primaryColor: '#7c6dfa', borderRadius: '16', layout: 'grid' };
      if (typeof window !== 'undefined') {
        window.adaptIqInstance = this;
      }
      this.init();
    }

    async init() {
      let e = document.currentScript || document.querySelector(`script[data-store-id]`);
      this.storeId = window.location.hostname.includes('.myshopify.com') 
        ? window.location.hostname.replace('.myshopify.com', '') 
        : (e && e.getAttribute(`data-store-id`) ? e.getAttribute(`data-store-id`) : `store_123`);
      
      let t = `clothing_101`;
      if (window.meta && window.meta.product && window.meta.product.id) {
        t = String(window.meta.product.id);
      } else if (window.ShopifyAnalytics && window.ShopifyAnalytics.meta && window.ShopifyAnalytics.meta.product && window.ShopifyAnalytics.meta.product.id) {
        t = String(window.ShopifyAnalytics.meta.product.id);
      } else {
        let e = document.querySelector(`meta[property="adaptiq:product_id"]`);
        if (e) t = e.getAttribute(`content`);
      }
      this.currentProductId = t;

      try {
        let e = await fetch(`${apiUrl}/config?storeId=${this.storeId}`);
        if (!e.ok) throw Error(`Failed to load AdaptIQ config`);
        this.config = await e.json();
        if (this.config.theme_config) {
          this.themeConfig = this.config.theme_config;
        }
        
        this.trackEvent(`page_view`, { path: window.location.pathname, productId: this.currentProductId });
        let ctx = this.extractContext();
        
        if (this.config.features.adaptive) await this.applyAdaptiveStorefront(ctx);
        if (this.config.features.recommendations) await this.renderRecommendations();
        if (this.config.features.bundles) await this.renderBundles();
        if (this.config.features.cartUpsells && window.location.pathname.includes('/cart')) await this.renderCartUpsells();
        if (this.config.features.search) this.initAISearch();
      } catch (err) {
        console.error(`[AdaptIQ] Initialization failed:`, err);
      }
    }

    extractContext() {
      return window.adaptIqMockContext ? window.adaptIqMockContext : {
        referrer: document.referrer || ``,
        userAgent: navigator.userAgent || ``,
        speed: navigator.connection ? navigator.connection.effectiveType : `unknown`,
        urlParams: window.location.search
      };
    }

    async applyAdaptiveStorefront(e) {
      try {
        let t = await fetch(`${apiUrl}/ai/adaptive`, {
          method: `POST`,
          headers: { "Content-Type": `application/json` },
          body: JSON.stringify({ storeId: this.storeId, context: e })
        });
        if (!t.ok) throw Error(`Failed to fetch adaptive copy`);
        let n = await t.json();
        let i = document.getElementById(`hero-headline`), a = document.getElementById(`hero-subtext`);
        if (i) i.innerText = n.headline;
        if (a) a.innerText = n.subtext;
        if (this.config && this.config.theme && n.primaryColor) {
          this.config.theme.primaryColor = n.primaryColor;
        }
      } catch (err) {
        console.error(`[AdaptIQ] Failed to apply adaptive storefront:`, err);
      }
    }

    async renderRecommendations() {
      let e = document.getElementById(`adaptiq-recommendations`);
      if (!e) {
        e = document.createElement(`div`);
        e.id = `adaptiq-recommendations`;
        let t = document.querySelector(`main`) || document.querySelector(`#MainContent`) || document.querySelector(`.product-details`) || document.body;
        t === document.body || t.tagName.toLowerCase() === `main` ? t.appendChild(e) : t.parentNode.insertBefore(e, t.nextSibling);
      }
      try {
        let t = await (await fetch(`${apiUrl}/recommendations?storeId=${this.storeId}&productId=${this.currentProductId}`)).json();
        if (!t.products || t.products.length === 0) return;
        let n = this.themeConfig.primaryColor || `#7c6dfa`;
        let br = this.themeConfig.borderRadius || `16`;
        e.innerHTML = `
          <div class="adaptiq-widget-container" style="border-radius: ${br}px;">
            <div class="adaptiq-widget-title" style="color: ${n};">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              ${t.title || `Precision Recommendations`}
            </div>
            <div class="adaptiq-product-grid">
              ${t.products.map(p => `
                <div class="adaptiq-product-card" data-id="${p.id}" data-handle="${p.handle || ''}" style="border-radius: ${br}px;">
                  <div class="adaptiq-product-image-container" style="border-radius: ${Math.max(0, br - 4)}px;">
                    <img src="${p.image}" alt="${p.name}" class="adaptiq-product-image" />
                  </div>
                  <h4 class="adaptiq-product-name">${p.name}</h4>
                  <p class="adaptiq-product-price" style="color: ${n};">${p.price}</p>
                </div>
              `).join(``)}
            </div>
            <div class="adaptiq-powered-by">Powered by AdaptIQ</div>
          </div>
        `;
        e.querySelectorAll(`.adaptiq-product-card`).forEach(card => {
          card.addEventListener(`click`, () => {
            this.trackEvent(`recommendation_click`, { clickedProductId: card.dataset.id, sourceProductId: this.currentProductId });
            if (card.dataset.handle) {
              window.location.href = '/products/' + card.dataset.handle;
            } else {
              alert(`Navigating to product: ${card.dataset.id} (Please reinstall app to sync links)`);
            }
          });
        });
      } catch (err) {
        console.error(`[AdaptIQ] Failed to load recommendations:`, err);
      }
    }

    trackEvent(e, t) {
      fetch(`${apiUrl}/track`, {
        method: `POST`,
        headers: { "Content-Type": `application/json` },
        body: JSON.stringify({ storeId: this.storeId, event: e, data: t, timestamp: new Date().toISOString() })
      }).catch(console.error);
    }

    async renderBundles() {
      let e = document.getElementById(`adaptiq-bundles`);
      if (!e) {
        e = document.createElement(`div`);
        e.id = `adaptiq-bundles`;
        let t = document.getElementById(`adaptiq-recommendations`);
        t ? t.parentNode.insertBefore(e, t) : document.body.appendChild(e);
      }
      try {
        let t = await (await fetch(`${apiUrl}/ai/bundles?storeId=${this.storeId}&productId=${this.currentProductId}`)).json();
        if (!t.products || t.products.length === 0) return;
        let n = this.themeConfig.primaryColor || `#7c6dfa`;
        let br = this.themeConfig.borderRadius || `16`;
        e.innerHTML = `
          <div class="adaptiq-widget-container" style="border-radius: ${br}px;">
            <div class="adaptiq-widget-title" style="color: ${n};">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              ${t.title || `Frequently Bought Together`}
            </div>
            <div class="adaptiq-product-grid">
              ${t.products.map(p => `
                <div class="adaptiq-product-card" data-id="${p.id}" data-variant-id="${p.variant_id || ''}" data-handle="${p.handle || ''}" style="border-radius: ${br}px;">
                  <div class="adaptiq-product-image-container" style="border-radius: ${Math.max(0, br - 4)}px;">
                    <img src="${p.image}" alt="${p.name}" class="adaptiq-product-image" />
                  </div>
                  <h4 class="adaptiq-product-name">${p.name}</h4>
                  <p class="adaptiq-product-price" style="color: #64748b;">${p.price}</p>
                  <button class="adaptiq-add-btn" style="border-radius: ${br}px;">Add to Bundle</button>
                </div>
              `).join(``)}
            </div>
            <div class="adaptiq-powered-by">Powered by AdaptIQ</div>
          </div>
        `;
        e.querySelectorAll(`.adaptiq-product-card`).forEach(card => {
          card.addEventListener(`click`, (ev) => {
            if (ev.target.tagName.toLowerCase() === 'button') return;
            this.trackEvent(`bundle_click`, { clickedProductId: card.dataset.id, sourceProductId: this.currentProductId });
            if (card.dataset.handle) {
              window.location.href = '/products/' + card.dataset.handle;
            }
          });
        });

        e.querySelectorAll(`button`).forEach(btn => {
          btn.addEventListener(`click`, async ev => {
            ev.stopPropagation();
            let card = ev.target.closest(`.adaptiq-product-card`);
            this.trackEvent(`bundle_add`, { productId: card.dataset.id });
            
            let originalText = btn.innerText;
            btn.innerText = "Adding...";
            btn.style.opacity = 0.7;

            if (card.dataset.variantId) {
              try {
                let res = await fetch('/cart/add.js', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ items: [{ id: parseInt(card.dataset.variantId, 10), quantity: 1 }] })
                });
                
                if (!res.ok) throw new Error("Failed to add");

                btn.innerText = "Added!";
                btn.style.background = "linear-gradient(135deg, #10b981 0%, #059669 100%)";
                setTimeout(() => { window.location.href = '/cart'; }, 500);
              } catch (e) {
                alert("Sorry, this variant cannot be added to the cart right now.");
                btn.innerText = originalText;
                btn.style.opacity = 1;
              }
            } else {
              alert(`Added to bundle! (Please reinstall app to sync cart logic)`);
              btn.innerText = originalText;
              btn.style.opacity = 1;
            }
          });
        });
      } catch (err) {
        console.error(`[AdaptIQ] Bundles error:`, err);
      }
    }

    async renderCartUpsells() {
      let e = document.getElementById(`adaptiq-cart-upsells`);
      if (!e) {
        e = document.createElement(`div`);
        e.id = `adaptiq-cart-upsells`;
        let t = document.querySelector(`.cart`) || document.querySelector(`#cart`) || document.querySelector(`main`) || document.body;
        t === document.body || t.tagName.toLowerCase() === `main` ? t.appendChild(e) : t.parentNode.insertBefore(e, t.nextSibling);
      }
      try {
        let cartRes = await fetch('/cart.js');
        if (!cartRes.ok) return;
        let cartData = await cartRes.json();
        if (!cartData.items || cartData.items.length === 0) return;

        let t = await (await fetch(`${apiUrl}/ai/cart-upsell?storeId=${this.storeId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: cartData.items })
        })).json();

        if (!t.products || t.products.length === 0) return;

        let n = this.themeConfig.primaryColor || `#7c6dfa`;
        let br = this.themeConfig.borderRadius || `16`;
        e.innerHTML = `
          <div class="adaptiq-widget-container" style="border-radius: ${br}px; margin-top: 2rem;">
            <div class="adaptiq-widget-title" style="color: ${n};">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              ${t.title || `Don't Forget These!`}
            </div>
            <div class="adaptiq-product-grid">
              ${t.products.map(p => `
                <div class="adaptiq-product-card" data-id="${p.id}" data-variant-id="${p.variant_id || ''}" data-handle="${p.handle || ''}" style="border-radius: ${br}px;">
                  <div class="adaptiq-product-image-container" style="border-radius: ${Math.max(0, parseInt(br) - 4)}px;">
                    <img src="${p.image}" alt="${p.name}" class="adaptiq-product-image" />
                  </div>
                  <h4 class="adaptiq-product-name">${p.name}</h4>
                  <p class="adaptiq-product-price" style="color: #64748b;">${p.price}</p>
                  <button class="adaptiq-add-btn" style="border-radius: ${br}px;">Add to Cart</button>
                </div>
              `).join(``)}
            </div>
            <div class="adaptiq-powered-by">Powered by AdaptIQ AI</div>
          </div>
        `;

        e.querySelectorAll(`button`).forEach(btn => {
          btn.addEventListener(`click`, async ev => {
            ev.stopPropagation();
            let card = ev.target.closest(`.adaptiq-product-card`);
            this.trackEvent(`cart_upsell_add`, { productId: card.dataset.id });
            
            let originalText = btn.innerText;
            btn.innerText = "Adding...";
            btn.style.opacity = '0.7';

            try {
              let res = await fetch('/cart/add.js', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  items: [{
                    id: card.dataset.variantId || card.dataset.id,
                    quantity: 1
                  }]
                })
              });
              if (res.ok) {
                btn.innerText = "Added!";
                setTimeout(() => window.location.reload(), 500);
              } else {
                throw new Error("Failed");
              }
            } catch (err) {
              btn.innerText = "Error";
              setTimeout(() => {
                btn.innerText = originalText;
                btn.style.opacity = '1';
              }, 2000);
            }
          });
        });

        e.querySelectorAll(`.adaptiq-product-card`).forEach(card => {
          card.addEventListener(`click`, (ev) => {
            if (ev.target.tagName.toLowerCase() === 'button') return;
            this.trackEvent(`cart_upsell_click`, { clickedProductId: card.dataset.id });
            if (card.dataset.handle) {
              window.location.href = '/products/' + card.dataset.handle;
            }
          });
        });
      } catch (err) {
        console.error(`[AdaptIQ] Cart Upsells error:`, err);
      }
    }

    initAISearch() {
      let inputs = document.querySelectorAll(`input[type="search"], input[id*="search"], input[name*="search"]`);
      if (inputs.length === 0) return;
      inputs.forEach(input => {
        let dropdown = document.createElement(`div`);
        dropdown.className = `adaptiq-search-dropdown`;
        let parent = input.parentNode;
        parent.style.position = `relative`;
        parent.appendChild(dropdown);
        let timeout = null;
        
        input.addEventListener(`input`, ev => {
          let query = ev.target.value;
          if (query.length < 3) {
            dropdown.style.display = `none`;
            return;
          }
          clearTimeout(timeout);
          timeout = setTimeout(async () => {
            dropdown.style.display = `block`;
            dropdown.innerHTML = `<div style="text-align:center; padding:1rem; color:#64748b;">AI is searching...</div>`;
            try {
              let res = await (await fetch(`${apiUrl}/ai/search?storeId=${this.storeId}&query=${encodeURIComponent(query)}`)).json();
              if (res.results && res.results.length > 0) {
                let color = this.config.theme?.primaryColor || `#7c6dfa`;
                dropdown.innerHTML = res.results.map(p => `
                  <div style="display:flex; align-items:center; gap:1rem; padding:0.75rem; border-bottom:1px solid #f1f5f9; cursor:pointer; transition:background 0.2s;" onmouseover="this.style.backgroundColor='#f8fafc'" onmouseout="this.style.backgroundColor='transparent'">
                    <img src="${p.image}" style="width:48px; height:48px; object-fit:contain; border-radius:6px; background:#f8fafc; padding:4px;" />
                    <div style="flex:1">
                      <div style="font-weight:700; font-size:0.9rem; color:#1e293b;">${p.name}</div>
                      <div style="color:${color}; font-size:0.85rem; font-weight:600; margin-top:2px;">${p.price}</div>
                    </div>
                  </div>
                `).join(``);
              } else {
                dropdown.innerHTML = `<div style="text-align:center; padding:1rem; color:#64748b; font-weight:500;">No matching products found.</div>`;
              }
            } catch {
              dropdown.innerHTML = `<div style="text-align:center; padding:1rem; color:#ef4444; font-weight:500;">Search failed.</div>`;
            }
          }, 400);
        });
        
        document.addEventListener(`click`, ev => {
          if (!parent.contains(ev.target)) dropdown.style.display = `none`;
        });
      });
    }
  }

  if (document.readyState === `loading`) {
    document.addEventListener(`DOMContentLoaded`, () => new AdaptIQWidget());
  } else {
    new AdaptIQWidget();
  }
})();