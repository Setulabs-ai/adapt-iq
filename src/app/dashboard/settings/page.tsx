"use client";

import { useState, useEffect } from "react";
import { Save, Check, RefreshCw, Palette, Settings2 } from "lucide-react";
import styles from "../dashboard.module.css";

export default function DashboardSettings() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/config?storeId=store_123")
      .then(res => res.json())
      .then(data => {
        setConfig(data);
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
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId: "store_123",
          config: config
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

  const updateTheme = (color: string) => {
    setConfig({
      ...config,
      theme: { ...config.theme, primaryColor: color }
    });
  };

  if (loading) {
    return <div className={styles.loader}><RefreshCw className={styles.spin} size={32} color="#3b82f6" /></div>;
  }

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
                title="Precision Recommendations" 
                description="Show AI product recommendations on product pages."
                enabled={config?.features?.recommendations}
                onChange={(v: boolean) => updateFeature('recommendations', v)}
              />
              <ToggleRow 
                title="Dynamic Bundles (Coming Soon)" 
                description="Offer customers a discount when they buy recommended items together."
                enabled={config?.features?.bundles}
                onChange={(v: boolean) => updateFeature('bundles', v)}
                disabled
              />
              <ToggleRow 
                title="AI Search Tuning (Coming Soon)" 
                description="Enhance Shopify's default search bar with semantic understanding."
                enabled={config?.features?.search}
                onChange={(v: boolean) => updateFeature('search', v)}
                disabled
              />
            </div>
          </div>

          {/* Theme Section */}
          <div className={styles.settingsSection}>
            <div className={styles.sectionHeader}>
              <Palette size={20} color="#6b7280" />
              <h3 className={styles.sectionTitle}>Brand Theme</h3>
            </div>
            <div className={styles.sectionBody}>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '8px'}}>Primary Widget Color</label>
              <div className={styles.colorPickerRow}>
                <input 
                  type="color" 
                  value={config?.theme?.primaryColor || "#7c6dfa"} 
                  onChange={(e) => updateTheme(e.target.value)}
                  className={styles.colorInput}
                />
                <input 
                  type="text" 
                  value={config?.theme?.primaryColor || "#7c6dfa"}
                  onChange={(e) => updateTheme(e.target.value)}
                  className={styles.textInput}
                />
              </div>
              <p style={{fontSize: '0.875rem', color: '#6b7280', marginTop: '16px'}}>
                This color will be used for the widget title, highlights, and primary buttons on your storefront.
              </p>
            </div>
          </div>
        </div>

        {/* Live Preview */}
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
              <div className={styles.mockWidget}>
                <div className={styles.mockTitle} style={{ color: config?.theme?.primaryColor || '#7c6dfa' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Precision Recommendations
                </div>
                <div className={styles.mockGrid}>
                  <div>
                    <div className={styles.mockCard}>Image</div>
                    <div className={styles.mockText1}></div>
                    <div className={styles.mockText2}></div>
                  </div>
                  <div>
                    <div className={styles.mockCard}>Image</div>
                    <div className={styles.mockText1}></div>
                    <div className={styles.mockText2}></div>
                  </div>
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
