"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import styles from "./playground.module.css";
import { Info, Smartphone, Wifi, Battery, Clock, ArrowRight, Zap, Target, Search } from "lucide-react";

export default function Playground() {
  const [intent, setIntent] = useState("general");
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Expose the mock context globally so the widget picks it up
  useEffect(() => {
    let mockContext = { referrer: 'Direct', userAgent: 'Desktop', speed: '4g', urlParams: '' };
    if (intent === 'impatient') {
      mockContext = { referrer: 'https://tiktok.com', userAgent: 'Mobile', speed: '3g', urlParams: '' };
    } else if (intent === 'budget') {
      mockContext = { referrer: 'https://facebook.com', userAgent: 'Tablet', speed: '4g', urlParams: '?utm_campaign=clearance' };
    }
    (window as any).adaptIqMockContext = mockContext;

    // Force the widget to re-run on the new DOM
    if ((window as any).adaptIqInstance) {
      (window as any).adaptIqInstance.init();
    }
  }, [intent]);

  const personas = [
    {
      id: "impatient",
      name: "The Impatient Scroller",
      description: "Low attention span, browsing on mobile data. Needs fast load times and clear Call-to-Actions.",
      metrics: { speed: "3G (Slow)", time: "Morning Commute", device: "Mobile" },
      active: intent === "impatient",
      intentTag: "impatient"
    },
    {
      id: "loyalist",
      name: "The Brand Loyalist",
      description: "Returning customer with high lifetime value. Expects premium experiences and personalized bundles.",
      metrics: { speed: "5G (Fast)", time: "Evening", device: "Desktop" },
      active: intent === "loyalist",
      intentTag: "loyalist"
    },
    {
      id: "discount",
      name: "The Discount Hunter",
      description: "Highly price-sensitive. Browsing through a Facebook Ads retargeting link. Looking for a deal.",
      metrics: { speed: "4G (Good)", time: "Weekend", device: "Tablet" },
      active: intent === "budget",
      intentTag: "budget" // maps to the widget intent logic
    }
  ];

  return (
    <div className={styles.playgroundWrapper}>
      {/* Navbar */}
      <header className={styles.topNav}>
        <div className={styles.logo}>
          <Zap size={20} className={styles.logoIcon} />
          Adapt<span>IQ</span>
        </div>
        <div className={styles.navRight}>
          <a href="/dashboard/settings" className={styles.navLink}>Dashboard</a>
          <button className={styles.talkBtn}>Book Demo</button>
        </div>
      </header>

      <div className={styles.mainLayout}>
        {/* LEFT COLUMN: Control Center */}
        <div className={styles.leftColumn}>
          <div className={styles.panelHeader}>
            <h2>1. Select Shopper Profile</h2>
            <p>Watch how the AI completely alters the storefront based on the user's hidden context.</p>
          </div>

          <div className={styles.personaList}>
            {personas.map(p => (
              <div 
                key={p.id} 
                className={`${styles.personaCard} ${p.active ? styles.personaCardActive : ''}`}
                onClick={() => setIntent(p.intentTag)}
              >
                <div className={styles.personaHeader}>
                  <h3>{p.name}</h3>
                  {p.active && <div className={styles.activeIndicator}>Live</div>}
                </div>
                <p className={styles.personaDesc}>{p.description}</p>
                <div className={styles.personaMetrics}>
                  <span><Wifi size={12}/> {p.metrics.speed}</span>
                  <span><Clock size={12}/> {p.metrics.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER COLUMN: The Simulator */}
        <div className={styles.centerColumn}>
          <div className={styles.simulatorHeader}>
            <div className={styles.urlBar}>
              <span className={styles.lock}>🔒</span>
              store.example.com
            </div>
          </div>
          
          <div className={styles.phoneMockup}>
            {/* Realistic iPhone Hardware Details */}
            <div className={styles.phoneBezel}></div>
            <div className={styles.phoneDynamicIsland}>
              <div className={styles.camera}></div>
            </div>
            <div className={styles.phoneVolumeButtons}></div>
            <div className={styles.phonePowerButton}></div>

            <div className={styles.phoneScreen} key={intent}>
              
              {/* iPhone Status Bar */}
              <div className={styles.statusBar}>
                <span className={styles.time}>9:41</span>
                <div className={styles.statusIcons}>
                  <Wifi size={14} strokeWidth={3} />
                  <Battery size={16} strokeWidth={2} />
                </div>
              </div>

              {/* FakeStore Inside Phone */}
              <header className={styles.storeHeader}>
                <div className={styles.hamburger}>
                  <span></span><span></span><span></span>
                </div>
                <div className={styles.storeLogo}>SETU</div>
                <div className={styles.cartIcon}>
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                </div>
              </header>

              <div className={styles.searchContainer}>
                <Search size={14} className={styles.searchIcon} />
                <input type="text" placeholder="Search products..." id="store-search" />
              </div>

              <main className={styles.storeMain}>
                <div className={styles.heroSection} id="adaptive-hero">
                  <div className={styles.heroContent}>
                    <h1 id="hero-headline">The Summer Collection</h1>
                    <p id="hero-subtext">Elevate your everyday wardrobe.</p>
                  </div>
                </div>

                <div className={styles.productDisplay}>
                  <div className={styles.imageWrapper}>
                    <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400&auto=format&fit=crop" alt="Oxford Shirt" className={styles.productImage} style={{mixBlendMode: 'normal', borderRadius: '8px'}} />
                    <div className={styles.badges}>Best Seller</div>
                  </div>
                  
                  <div className={styles.productInfo}>
                    <div className={styles.reviews}>★★★★★ <span>(128 Reviews)</span></div>
                    <div className={styles.productHeader}>
                      <h2>Classic White Oxford Shirt</h2>
                    </div>
                    <p className={styles.price}>$49.99</p>
                    
                    <div className={styles.variants}>
                      <div className={styles.variantTitle}>Size</div>
                      <div className={styles.sizeGrid}>
                        <div className={styles.sizeBox}>S</div>
                        <div className={`${styles.sizeBox} ${styles.activeSize}`}>M</div>
                        <div className={styles.sizeBox}>L</div>
                      </div>
                    </div>

                    <p className={styles.productDesc}>A timeless, crisp white oxford shirt perfect for business or casual wear. 100% cotton.</p>
                    
                    <button className={styles.addToCart}>Add to Cart</button>
                  </div>
                </div>
              </main>

              {/* Load widget exactly once at the bottom of the body */}
              <Script 
                src="/widget.js" 
                strategy="afterInteractive" 
                data-store-id="store_123"
                onLoad={() => {
                  if ((window as any).adaptIqInstance) {
                    (window as any).adaptIqInstance.init();
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI Brain & Explanations */}
        <div className={styles.rightColumn}>
          <div className={styles.panelHeader}>
            <h2>2. The AdaptIQ Brain</h2>
            <p>How our engine calculates the perfect experience.</p>
          </div>

          <div className={styles.insightGroup}>
            <div className={styles.insightHeader}>
              <Target size={16} className={styles.insightIcon} />
              <h3>Real-Time Extraction</h3>
            </div>
            
            <div className={styles.metricCard}>
              <div className={styles.metricRow}>
                <span className={styles.metricLabel}>Network Speed</span>
                <div className={styles.metricValue}>
                  {personas.find(p => p.active)?.metrics.speed}
                  <div className={styles.tooltipContainer}>
                    <Info size={14} className={styles.infoIcon} onMouseEnter={() => setActiveTooltip('speed')} onMouseLeave={() => setActiveTooltip(null)} />
                    {activeTooltip === 'speed' && (
                      <div className={styles.tooltipBox}>
                        <strong>How it works:</strong> We use the browser's `navigator.connection` API to detect if the user is on slow 3G. If so, we compress images to prevent them from bouncing.
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.metricRow}>
                <span className={styles.metricLabel}>Conversion Propensity</span>
                <div className={styles.metricValue}>
                  {intent === 'impatient' ? '24%' : intent === 'loyalist' ? '82%' : '41%'}
                  <div className={styles.tooltipContainer}>
                    <Info size={14} className={styles.infoIcon} onMouseEnter={() => setActiveTooltip('propensity')} onMouseLeave={() => setActiveTooltip(null)} />
                    {activeTooltip === 'propensity' && (
                      <div className={styles.tooltipBox}>
                        <strong>How it works:</strong> A Machine Learning model calculates the likelihood of a purchase based on mouse-movements, time-on-page, and referral source (e.g. Instagram vs Organic).
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.insightGroup}>
            <div className={styles.insightHeader}>
              <Zap size={16} className={styles.insightIcon} />
              <h3>Business Impact Levers</h3>
            </div>
            
            <div className={styles.metricCard}>
              <div className={styles.impactRow}>
                <div className={styles.impactLeft}>
                  <span>Dynamic Bundles</span>
                  <p>Increases Average Order Value (AOV)</p>
                </div>
                <div className={styles.impactRight}>
                  <div className={styles.tooltipContainer}>
                    <Info size={14} className={styles.infoIcon} onMouseEnter={() => setActiveTooltip('bundles')} onMouseLeave={() => setActiveTooltip(null)} />
                    {activeTooltip === 'bundles' && (
                      <div className={styles.tooltipBox}>
                        <strong>How it works:</strong> We use the OpenAI API to analyze your product catalog. It finds complementary products (like bindings for a snowboard) and injects them under the main product.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.impactRow}>
                <div className={styles.impactLeft}>
                  <span>AI Search Tuning</span>
                  <p>Prevents "No Results" drop-offs</p>
                </div>
                <div className={styles.impactRight}>
                  <div className={styles.tooltipContainer}>
                    <Info size={14} className={styles.infoIcon} onMouseEnter={() => setActiveTooltip('search')} onMouseLeave={() => setActiveTooltip(null)} />
                    {activeTooltip === 'search' && (
                      <div className={styles.tooltipBox}>
                        <strong>How it works:</strong> Standard Shopify search fails on synonyms. We intercept the search bar and use Semantic Search so a query for "winter coat" finds your "snow jacket".
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.impactRow}>
                <div className={styles.impactLeft}>
                  <span>Adaptive Hero Copy</span>
                  <p>Matches user intent instantly</p>
                </div>
                <div className={styles.impactRight}>
                  <div className={styles.tooltipContainer}>
                    <Info size={14} className={styles.infoIcon} onMouseEnter={() => setActiveTooltip('copy')} onMouseLeave={() => setActiveTooltip(null)} />
                    {activeTooltip === 'copy' && (
                      <div className={styles.tooltipBox}>
                        <strong>How it works:</strong> We use Vanilla JS to rewrite the main H1 tag before the user even sees it. A discount shopper sees a sale banner, a loyalist sees a premium greeting.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.insightGroup}>
            <div className={styles.insightHeader}>
              <Smartphone size={16} className={styles.insightIcon} />
              <h3>Live Extracted Context</h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem', lineHeight: '1.4' }}>
              This is the raw JSON payload the widget secretly extracts from the browser and sends to our AI backend.
            </p>
            
            <div className={styles.metricCard} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '1rem' }}>
              <pre style={{ margin: 0, fontSize: '0.75rem', color: '#38bdf8', overflowX: 'auto', fontFamily: 'monospace' }}>
                {JSON.stringify(
                  intent === 'impatient' 
                    ? { referrer: 'https://tiktok.com', userAgent: 'Mobile', speed: '3g', urlParams: '' }
                    : intent === 'budget'
                    ? { referrer: 'https://facebook.com', userAgent: 'Tablet', speed: '4g', urlParams: '?utm_campaign=clearance' }
                    : { referrer: 'Direct', userAgent: 'Desktop', speed: '4g', urlParams: '' },
                  null,
                  2
                )}
              </pre>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
