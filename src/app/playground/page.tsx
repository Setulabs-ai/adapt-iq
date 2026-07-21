"use client";

import { useState } from "react";
import styles from "./playground.module.css";
import Script from "next/script";

export default function Playground() {
  const [intent, setIntent] = useState("general");

  // Reload the widget when intent changes by changing the key
  return (
    <div className={styles.container}>
      {/* Control Panel (Our Pitch Tool) */}
      <div className={styles.controlPanel}>
        <div className={styles.panelHeader}>
          <h3>AdaptIQ Interactive Demo</h3>
          <p>Change the shopper intent below and watch the storefront adapt instantly.</p>
        </div>
        <div className={styles.intentSelector}>
          <label>Simulated Shopper Intent:</label>
          <select value={intent} onChange={(e) => setIntent(e.target.value)} className={styles.select}>
            <option value="general">General Browsing (Default)</option>
            <option value="snowboarder">Hardcore Snowboarder</option>
            <option value="eco">Eco-Friendly Shopper</option>
            <option value="budget">Deal Hunter</option>
          </select>
        </div>
      </div>

      {/* Fake Client Storefront */}
      <div className={styles.storefront} key={intent}>
        <header className={styles.storeHeader}>
          <h2>FakeStore.com</h2>
          <div className={styles.searchBarWrapper}>
            <input type="text" placeholder="Search products..." id="store-search" />
          </div>
        </header>

        <main className={styles.storeMain}>
          <div className={styles.heroSection} id="adaptive-hero">
            <h1 id="hero-headline">Welcome to our Winter Collection</h1>
            <p id="hero-subtext">Discover the best gear for your next adventure.</p>
          </div>

          <div className={styles.productDisplay}>
            <div className={styles.productImage}>
              <img src="https://cdn.shopify.com/s/files/1/0802/0970/7311/files/Main_23ee36cd-ca8f-45e3-ab78-a87f5bb5538e.jpg" alt="Snowboard" />
            </div>
            <div className={styles.productInfo}>
              <h2>The Collection Snowboard: Liquid</h2>
              <p className={styles.price}>$629.95</p>
              <button className={styles.addToCart}>Add to Cart</button>
            </div>
          </div>
        </main>

        {/* Inject Widget directly into the playground */}
        {/* We pass the intent via URL parameter so the widget can read it */}
        <Script 
          src={`/widget.js?intent=${intent}`} 
          strategy="afterInteractive" 
          data-store-id="store_123" 
        />
      </div>
    </div>
  );
}
