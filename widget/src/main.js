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

      // 4. Extract intent from script URL (for Playground Demo)
      const urlParams = new URL(scriptSrc).searchParams;
      const intent = urlParams.get('intent');

      // 5. Apply Adaptive Storefront Logic if intent is detected
      if (intent && intent !== 'general') {
        await this.applyAdaptiveStorefront(intent);
      }

      // 6. Render Features
      if (this.config.features.recommendations) {
        await this.renderRecommendations();
      }

    } catch (err) {
      console.error('[AdaptIQ] Initialization failed:', err);
    }
  }

  async applyAdaptiveStorefront(intent) {
    try {
      console.log(`[AdaptIQ] Adapting Storefront for intent: ${intent}`);
      const res = await fetch(`${API_BASE}/ai/adaptive?intent=${intent}`);
      const adaptiveData = await res.json();

      // Overwrite the DOM dynamically
      const headline = document.getElementById('hero-headline');
      const subtext = document.getElementById('hero-subtext');
      const heroSection = document.getElementById('adaptive-hero');

      if (headline) headline.innerText = adaptiveData.headline;
      if (subtext) subtext.innerText = adaptiveData.subtext;
      
      // Override primary color for this session
      if (this.config && this.config.theme) {
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
        <div class="adaptiq-widget-container">
          <div class="adaptiq-widget-title" style="color: ${primaryColor}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            ${data.title || 'Precision Recommendations'}
          </div>
          <div class="adaptiq-product-grid">
            ${data.products.map(p => `
              <div class="adaptiq-product-card" data-id="${p.id}">
                <img src="${p.image}" alt="${p.name}" class="adaptiq-product-image" />
                <h4 class="adaptiq-product-name">${p.name}</h4>
                <p class="adaptiq-product-price">${p.price}</p>
              </div>
            `).join('')}
          </div>
          <div class="adaptiq-powered-by">
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
}

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new AdaptIQWidget());
} else {
  new AdaptIQWidget();
}
