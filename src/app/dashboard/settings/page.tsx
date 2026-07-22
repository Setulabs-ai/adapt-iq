"use client";

import { useState, useEffect } from "react";
import { Save, Check, RefreshCw, Palette, Settings2, Layout, Circle } from "lucide-react";
import styles from "../dashboard.module.css";

export default function DashboardSettings() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [storeId, setStoreId] = useState<string | null>(null);

  // Theme customization state
  const [themeConfig, setThemeConfig] = useState({
    primaryColor: "#7c6dfa",
    borderRadius: "16",
    layout: "grid"
  });

  useEffect(() => {
    // Read store ID from cookie session via the stats endpoint approach
    fetch("/api/config?storeId=__session__")
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          // Fallback: try to get storeId from the session cookie
          return fetch("/api/stats").then(r => r.json()).then(statsData => {
            if (statsData.error) throw new Error("Unauthorized");
            return statsData;
          });
        }
        return data;
      })
      .catch(() => null);

    // Fetch config using a simple approach — try the session-based stats first
    fetch("/api/stats")
      .then(res => res.json())
      .then(async (statsData) => {
        if (statsData.storeId) {
          setStoreId(statsData.storeId);
          const configRes = await fetch(`/api/config?storeId=${statsData.storeId}`);
          const configData = await configRes.json();
          setConfig(configData);
          if (configData.theme_config) {
            setThemeConfig(configData.theme_config);
          }
        } else {
          // Fallback to cookie-based approach
          const configRes = await fetch(`/api/config?storeId=adaptiq-demo-store`);
          const configData = await configRes.json();
          setConfig(configData);
          setStoreId("adaptiq-demo-store");
          if (configData.theme_config) {
            setThemeConfig(configData.theme_config);
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch config", err);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const sid = storeId || "adaptiq-demo-store";
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId: sid,
          config: {
            ...config,
            theme_config: themeConfig
          }
        })
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save config", err);
    }
    setSaving(false);
  };

  const updateFeature = (key: string, value: boolean) => {
    setConfig({
      ...config,
      features: { ...config.features, [key]: value }
    });
  };

  const updateThemeConfig = (key: string, value: string) => {
    setThemeConfig(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return <div className={styles.loader}><RefreshCw className={styles.spin} size={32} color="#3b82f6" /></div>;
  }

  const presetColors = [
    { name: "Indigo", value: "#7c6dfa" },
    { name: "Ocean", value: "#3b82f6" },
    { name: "Emerald", value: "#10b981" },
    { name: "Rose", value: "#f43f5e" },
    { name: "Amber", value: "#f59e0b" },
    { name: "Slate", value: "#1e293b" },
  ];

  return (
    <div>
      <div className={styles.settingsHeader}>
        <div>
          <h2 className={styles.mainTitle}>Widget Settings</h2>
          <p className={styles.subtitle}>Configure how AdaptIQ appears on your storefront.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className={styles.saveBtn}
        >
          {saving ? <RefreshCw className={styles.spin} size={16} /> : (saved ? <Check size={16} /> : <Save size={16} />)}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className={styles.settingsGrid}>
        <div>
          {/* Features Section */}
          <div className={styles.settingsSection}>
            <div className={styles.sectionHeader}>
              <Settings2 size={20} color="#6b7280" />
              <h3 className={styles.sectionTitle}>Active Features</h3>
            </div>
            <div className={styles.sectionBody}>
              <ToggleRow 
                title="Adaptive Storefront" 
                description="Dynamically rewrite your hero section based on the visitor's intent."
                enabled={config?.features?.adaptive}
                onChange={(v: boolean) => updateFeature('adaptive', v)}
              />
              <ToggleRow 
                title="Precision Recommendations" 
                description="Show AI product recommendations on product pages."
                enabled={config?.features?.recommendations}
                onChange={(v: boolean) => updateFeature('recommendations', v)}
              />
              <ToggleRow 
                title="Dynamic Bundles" 
                description="Offer customers a discount when they buy recommended items together."
                enabled={config?.features?.bundles}
                onChange={(v: boolean) => updateFeature('bundles', v)}
              />
              <ToggleRow 
                title="AI Search Tuning" 
                description="Enhance Shopify's default search bar with semantic understanding."
                enabled={config?.features?.search}
                onChange={(v: boolean) => updateFeature('search', v)}
              />
              <ToggleRow 
                title="In-Cart Upsells" 
                description="Recommend complementary items when the shopper views their cart."
                enabled={config?.features?.cartUpsells}
                onChange={(v: boolean) => updateFeature('cartUpsells', v)}
              />
            </div>
          </div>

          {/* Widget Design Section */}
          <div className={styles.settingsSection}>
            <div className={styles.sectionHeader}>
              <Palette size={20} color="#6b7280" />
              <h3 className={styles.sectionTitle}>Widget Design</h3>
            </div>
            <div className={styles.sectionBody}>
              {/* Primary Color */}
              <div className={styles.designField}>
                <label className={styles.designLabel}>Accent Color</label>
                <p className={styles.designHint}>Used for the widget title, price highlights, and interactive elements.</p>
                <div className={styles.colorPresets}>
                  {presetColors.map(c => (
                    <button
                      key={c.value}
                      className={`${styles.colorPresetBtn} ${themeConfig.primaryColor === c.value ? styles.colorPresetActive : ''}`}
                      style={{ backgroundColor: c.value }}
                      onClick={() => updateThemeConfig('primaryColor', c.value)}
                      title={c.name}
                    />
                  ))}
                </div>
                <div className={styles.colorPickerRow}>
                  <input 
                    type="color" 
                    value={themeConfig.primaryColor} 
                    onChange={(e) => updateThemeConfig('primaryColor', e.target.value)}
                    className={styles.colorInput}
                  />
                  <input 
                    type="text" 
                    value={themeConfig.primaryColor}
                    onChange={(e) => updateThemeConfig('primaryColor', e.target.value)}
                    className={styles.textInput}
                  />
                </div>
              </div>

              {/* Border Radius */}
              <div className={styles.designField}>
                <label className={styles.designLabel}>Corner Roundness</label>
                <p className={styles.designHint}>
                  Control how rounded the widget cards appear. 
                  <strong style={{ marginLeft: 6 }}>{themeConfig.borderRadius}px</strong>
                </p>
                <div className={styles.sliderRow}>
                  <span className={styles.sliderLabel}>Sharp</span>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    step="2"
                    value={themeConfig.borderRadius}
                    onChange={(e) => updateThemeConfig('borderRadius', e.target.value)}
                    className={styles.rangeSlider}
                  />
                  <span className={styles.sliderLabel}>Round</span>
                </div>
              </div>

              {/* Layout Toggle */}
              <div className={styles.designField}>
                <label className={styles.designLabel}>Widget Layout</label>
                <p className={styles.designHint}>Choose how the recommended products are arranged.</p>
                <div className={styles.layoutToggle}>
                  <button
                    className={`${styles.layoutBtn} ${themeConfig.layout === 'grid' ? styles.layoutBtnActive : ''}`}
                    onClick={() => updateThemeConfig('layout', 'grid')}
                  >
                    <Layout size={16} />
                    Grid
                  </button>
                  <button
                    className={`${styles.layoutBtn} ${themeConfig.layout === 'carousel' ? styles.layoutBtnActive : ''}`}
                    onClick={() => updateThemeConfig('layout', 'carousel')}
                  >
                    <Circle size={16} />
                    Carousel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div>
          <div className={styles.previewPanel}>
            <div className={styles.previewHeader}>
              Live Preview
              <div className={styles.ping}>
                <div className={styles.pingOuter}></div>
                <div className={styles.pingInner}></div>
              </div>
            </div>
            
            {config?.features?.recommendations ? (
              <div 
                className={styles.mockWidget} 
                style={{ borderRadius: `${themeConfig.borderRadius}px` }}
              >
                <div className={styles.mockTitle} style={{ color: themeConfig.primaryColor }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Precision Recommendations
                </div>
                <div className={styles.mockGrid}>
                  <div>
                    <div className={styles.mockCard} style={{ borderRadius: `${Math.max(0, parseInt(themeConfig.borderRadius) - 4)}px` }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                    </div>
                    <div className={styles.mockText1}></div>
                    <div className={styles.mockText2} style={{ backgroundColor: themeConfig.primaryColor, opacity: 0.6 }}></div>
                  </div>
                  <div>
                    <div className={styles.mockCard} style={{ borderRadius: `${Math.max(0, parseInt(themeConfig.borderRadius) - 4)}px` }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                    </div>
                    <div className={styles.mockText1}></div>
                    <div className={styles.mockText2} style={{ backgroundColor: themeConfig.primaryColor, opacity: 0.6 }}></div>
                  </div>
                </div>
                <div 
                  className={styles.mockAddBtn} 
                  style={{ 
                    backgroundColor: themeConfig.primaryColor,
                    borderRadius: `${themeConfig.borderRadius}px`
                  }}
                >
                  Add to Bundle
                </div>
              </div>
            ) : (
              <div className={styles.disabledPreview}>
                Recommendations are currently disabled on your store.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ title, description, enabled, onChange, disabled = false }: any) {
  return (
    <div className={`${styles.toggleRow} ${disabled ? styles.toggleRowDisabled : ''}`}>
      <div className={styles.toggleInfo}>
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
      <label className={styles.switch} style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}>
        <input 
          type="checkbox" 
          checked={enabled} 
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
        />
        <span className={styles.slider}></span>
      </label>
    </div>
  );
}
