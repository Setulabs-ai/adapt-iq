"use client";

import { useState } from "react";
import { Zap, ArrowRight, Lock } from "lucide-react";
import styles from "./install.module.css";

export default function InstallPage() {
  const [shop, setShop] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInstall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shop) {
      setError("Please enter your Shopify store domain.");
      return;
    }

    setLoading(true);
    setError("");

    // Strip https:// if user added it
    let cleanShop = shop.replace('https://', '').replace('http://', '').trim();
    if (!cleanShop.endsWith('.myshopify.com')) {
      cleanShop += '.myshopify.com';
    }

    // Redirect to our OAuth initiation endpoint
    window.location.href = `/api/auth/shopify/install?shop=${cleanShop}`;
  };

  return (
    <div className={styles.installWrapper}>
      <div className={styles.installContainer}>
        <div className={styles.logoContainer}>
          <div className={styles.logoIconBox}>
            <Zap size={28} className={styles.logoIcon} />
          </div>
          <h1>Install AdaptIQ</h1>
          <p>Connect your Shopify store to enable the AI-powered adaptive storefront and recommendations.</p>
        </div>

        <form onSubmit={handleInstall} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="shop">Shopify Store Domain</label>
            <div className={styles.inputWrapper}>
              <input
                id="shop"
                type="text"
                placeholder="your-store-name"
                value={shop}
                onChange={(e) => setShop(e.target.value)}
                className={styles.input}
                disabled={loading}
              />
              <span className={styles.suffix}>.myshopify.com</span>
            </div>
            {error && <p className={styles.errorText}>{error}</p>}
          </div>

          <button 
            type="submit" 
            className={styles.installBtn}
            disabled={loading || !shop}
          >
            {loading ? 'Connecting to Shopify...' : 'Connect Store'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className={styles.secureNote}>
          <Lock size={14} />
          <span>Secure OAuth connection via Shopify</span>
        </div>
      </div>
    </div>
  );
}
