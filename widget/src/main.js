import './style.css';

// Determine API base URL dynamically based on where the widget script is loaded from
// document.currentScript is null for type="module", so we fallback to querying the script tag
const scriptElement = document.currentScript || document.querySelector('script[src*="widget.js"]');
const scriptSrc = scriptElement ? scriptElement.src : window.location.origin;
const API_BASE = new URL(scriptSrc).origin + '/api';

class AdaptIQWidget {
  constructor() {
    this.storeId = null;
    this.currentProductId = null;
    this.config = null;
    this.init();
  }

  async init() {
    // 1. Get configuration from script tag (or default for demo)
    const scriptTag = document.currentScript || document.querySelector('script[data-store-id]');
    this.storeId = scriptTag ? scriptTag.getAttribute('data-store-id') : 'store_123';
    
    // For the demo, we read product ID from Shopify's global meta variable first,
    // then fallback to our mock meta tag for local testing
    let productId = '9336993317079'; // Default to Liquid snowboard if nothing found
    
    if (window.meta && window.meta.product && window.meta.product.id) {
      productId = String(window.meta.product.id);
    } else {
      const productMeta = document.querySelector('meta[property="adaptiq:product_id"]');
      if (productMeta) {
        productId = productMeta.getAttribute('content');
      }
    }
    
    this.currentProductId = productId;

    try {
      // 2. Fetch config
      const res = await fetch(`${API_BASE}/config?storeId=${this.storeId}`);
      if (!res.ok) throw new Error('Failed to load AdaptIQ config');
      this.config = await res.json();

      // 3. Track page view
      this.trackEvent('page_view', { path: window.location.pathname, productId: this.currentProductId });

      // 4. Extract Real User Context
      const userContext = this.extractContext();

      // 5. Apply Adaptive Storefront Logic if enabled
      if (this.config.features.adaptive) {
        await this.applyAdaptiveStorefront(userContext);
      }

      // 6. Render Features
      if (this.config.features.recommendations) {
        await this.renderRecommendations();
      }
      
      if (this.config.features.bundles) {
        await this.renderBundles();
      }

      if (this.config.features.search) {
        this.initAISearch();
      }

    } catch (err) {
      console.error('[AdaptIQ] Initialization failed:', err);
    }
  }

  extractContext() {
    // If running inside the Playground simulator, use the injected mock context
    if (window.adaptIqMockContext) {
      return window.adaptIqMockContext;
    }

    // For Live Production: Extract real browser data
    return {
      referrer: document.referrer || '',
      userAgent: navigator.userAgent || '',
      speed: navigator.connection ? navigator.connection.effectiveType : 'unknown',
      urlParams: window.location.search
    };
  }

  async applyAdaptiveStorefront(context) {
    try {
      console.log(`[AdaptIQ] Adapting Storefront using context:`, context);
      
      const res = await fetch(`${API_BASE}/ai/adaptive`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          storeId: this.storeId, 
          context: context 
        })
      });
      
      if (!res.ok) throw new Error('Failed to fetch adaptive copy');
      const adaptiveData = await res.json();

      // Overwrite the DOM dynamically
      const headline = document.getElementById('hero-headline');
      const subtext = document.getElementById('hero-subtext');
      const heroSection = document.getElementById('adaptive-hero');

      if (headline) headline.innerText = adaptiveData.headline;
      if (subtext) subtext.innerText = adaptiveData.subtext;
      
      // Override primary color for this session
      if (this.config && this.config.theme && adaptiveData.primaryColor) {
        this.config.theme.primaryColor = adaptiveData.primaryColor;
      }

    } catch (err) {
      console.error('[AdaptIQ] Failed to apply adaptive storefront:', err);
    }
  }

  async renderRecommendations() {
    // Find where to inject. In a real Shopify store, this might be a specific block or selector.
    // For now, we append to a div with id "adaptiq-recommendations" or the bottom of the body.
    let container = document.getElementById('adaptiq-recommendations');
    if (!container) {
      container = document.createElement('div');
      container.id = 'adaptiq-recommendations';
      
      // Try to insert after the main product info or at the bottom of the main content area
      const target = document.querySelector('main') || document.querySelector('#MainContent') || document.querySelector('.product-details') || document.body;
      if (target === document.body || target.tagName.toLowerCase() === 'main') {
        target.appendChild(container);
      } else {
        target.parentNode.insertBefore(container, target.nextSibling);
      }
    }

    try {
      const res = await fetch(`${API_BASE}/recommendations?storeId=${this.storeId}&productId=${this.currentProductId}`);
      const data = await res.json();
      
      if (!data.products || data.products.length === 0) return;

      const primaryColor = this.config.theme?.primaryColor || '#7c6dfa';

      // Build HTML
      container.innerHTML = `
        <div class="adaptiq-widget-container" style="background-color: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 1.5rem; margin: 2rem 1.5rem;">
          <div class="adaptiq-widget-title" style="color: ${primaryColor}; font-size: 1.1rem; font-weight: 800; margin-bottom: 1.25rem;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width: 18px; height: 18px;">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            ${data.title || 'Precision Recommendations'}
          </div>
          <div class="adaptiq-product-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
            ${data.products.map(p => `
              <div class="adaptiq-product-card" data-id="${p.id}" style="cursor: pointer;">
                <div style="background: #f8fafc; border-radius: 12px; padding: 0.5rem; margin-bottom: 0.75rem;">
                  <img src="${p.image}" alt="${p.name}" style="width: 100%; height: 120px; object-fit: contain; mix-blend-mode: multiply;" />
                </div>
                <h4 style="font-size: 0.85rem; font-weight: 700; color: #0f172a; margin: 0 0 4px 0; line-height: 1.2;">${p.name}</h4>
                <p style="font-size: 0.85rem; font-weight: 600; color: ${primaryColor}; margin: 0;">${p.price}</p>
              </div>
            `).join('')}
          </div>
          <div class="adaptiq-powered-by" style="font-size: 0.7rem; color: #94a3b8; text-align: center; margin-top: 1rem;">
            Powered by AdaptIQ
          </div>
        </div>
      `;

      // Add click tracking
      container.querySelectorAll('.adaptiq-product-card').forEach(card => {
        card.addEventListener('click', () => {
          this.trackEvent('recommendation_click', { 
            clickedProductId: card.dataset.id,
            sourceProductId: this.currentProductId
          });
          // Mock navigation
          alert(`Navigating to product: ${card.dataset.id}`);
        });
      });

    } catch (err) {
      console.error('[AdaptIQ] Failed to load recommendations:', err);
    }
  }

  trackEvent(event, data) {
    fetch(`${API_BASE}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storeId: this.storeId,
        event,
        data,
        timestamp: new Date().toISOString()
      })
    }).catch(console.error);
  }

  async renderBundles() {
    let container = document.getElementById('adaptiq-bundles');
    if (!container) {
      container = document.createElement('div');
      container.id = 'adaptiq-bundles';
      
      // Inject above recommendations if present, otherwise body
      const recs = document.getElementById('adaptiq-recommendations');
      if (recs) {
        recs.parentNode.insertBefore(container, recs);
      } else {
        document.body.appendChild(container);
      }
    }

    try {
      const res = await fetch(`${API_BASE}/ai/bundles?storeId=${this.storeId}&productId=${this.currentProductId}`);
      const data = await res.json();
      
      if (!data.products || data.products.length === 0) return;

      const primaryColor = this.config.theme?.primaryColor || '#7c6dfa';

      container.innerHTML = `
        <div class="adaptiq-widget-container" style="background-color: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 1.5rem; margin: 0 1.5rem 1.5rem;">
          <div class="adaptiq-widget-title" style="color: ${primaryColor}; font-size: 1.1rem; font-weight: 800; margin-bottom: 1.25rem;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width: 18px; height: 18px;">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            ${data.title || 'Frequently Bought Together'}
          </div>
          <div class="adaptiq-product-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
            ${data.products.map(p => `
              <div class="adaptiq-product-card" data-id="${p.id}">
                <div style="background: #f8fafc; border-radius: 12px; padding: 0.5rem; margin-bottom: 0.75rem;">
                  <img src="${p.image}" alt="${p.name}" style="width: 100%; height: 120px; object-fit: contain; mix-blend-mode: multiply;" />
                </div>
                <h4 style="font-size: 0.85rem; font-weight: 700; color: #0f172a; margin: 0 0 4px 0; line-height: 1.2;">${p.name}</h4>
                <p style="font-size: 0.85rem; font-weight: 600; color: #64748b; margin: 0;">${p.price}</p>
                <button style="width:100%; padding:0.6rem; margin-top:0.75rem; background-color:#0f172a; color:white; border:none; border-radius:99px; font-weight: 600; font-size: 0.8rem; cursor:pointer;">Add to Bundle</button>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      container.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const card = e.target.closest('.adaptiq-product-card');
          this.trackEvent('bundle_add', { productId: card.dataset.id });
          alert('Added to bundle!');
        });
      });

    } catch (err) {
      console.error('[AdaptIQ] Failed to load bundles:', err);
    }
  }

  initAISearch() {
    const searchInputs = document.querySelectorAll('input[type="search"], input[id*="search"], input[name*="search"]');
    if (searchInputs.length === 0) return;

    searchInputs.forEach(input => {
      // Create dropdown container
      const dropdown = document.createElement('div');
      dropdown.className = 'adaptiq-search-dropdown';
      dropdown.style.display = 'none';
      dropdown.style.position = 'absolute';
      dropdown.style.top = '100%';
      dropdown.style.left = '0';
      dropdown.style.width = '100%';
      dropdown.style.backgroundColor = 'white';
      dropdown.style.border = '1px solid #e2e8f0';
      dropdown.style.borderRadius = '8px';
      dropdown.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
      dropdown.style.zIndex = '9999';
      dropdown.style.padding = '1rem';
      
      const parent = input.parentNode;
      parent.style.position = 'relative';
      parent.appendChild(dropdown);

      let timeout = null;

      input.addEventListener('input', (e) => {
        const query = e.target.value;
        if (query.length < 3) {
          dropdown.style.display = 'none';
          return;
        }

        clearTimeout(timeout);
        timeout = setTimeout(async () => {
          dropdown.style.display = 'block';
          dropdown.innerHTML = `<div style="text-align:center; padding:1rem; color:#64748b;">AI is searching...</div>`;
          
          try {
            const res = await fetch(`${API_BASE}/ai/search?storeId=${this.storeId}&query=${encodeURIComponent(query)}`);
            const data = await res.json();
            
            if (data.results && data.results.length > 0) {
              const primaryColor = this.config.theme?.primaryColor || '#7c6dfa';
              dropdown.innerHTML = data.results.map(p => `
                <div style="display:flex; align-items:center; gap:1rem; padding:0.5rem; border-bottom:1px solid #f1f5f9; cursor:pointer;">
                  <img src="${p.image}" style="width:40px; height:40px; object-fit:cover; border-radius:4px;" />
                  <div style="flex:1">
                    <div style="font-weight:600; font-size:0.9rem;">${p.name}</div>
                    <div style="color:${primaryColor}; font-size:0.8rem;">${p.price}</div>
                  </div>
                </div>
              `).join('');
            } else {
              dropdown.innerHTML = `<div style="text-align:center; padding:1rem; color:#64748b;">No matching products found.</div>`;
            }
          } catch (err) {
            dropdown.innerHTML = `<div style="text-align:center; padding:1rem; color:#ef4444;">Search failed.</div>`;
          }
        }, 500);
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (!parent.contains(e.target)) {
          dropdown.style.display = 'none';
        }
      });
    });
  }
}

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new AdaptIQWidget());
} else {
  new AdaptIQWidget();
}
