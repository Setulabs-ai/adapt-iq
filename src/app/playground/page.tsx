"use client";

import { useState } from "react";
import Script from "next/script";
import styles from "./playground.module.css";
import { User, Target, Battery, Wifi, Briefcase, MapPin, Monitor } from "lucide-react";

export default function Playground() {
  const [intent, setIntent] = useState("general");

  const personas = [
    {
      id: "snowboarder",
      name: "Gautam",
      tag: "Hardcore Snowboarder",
      city: "DELHI",
      platform: "Google",
      device: "Samsung Galaxy S23",
      type: "search",
      landsOn: "Collection",
      active: intent === "snowboarder",
      color: "#3b82f6"
    },
    {
      id: "eco",
      name: "Jhanvi",
      tag: "Eco-Conscious Adventurer",
      city: "NAGPUR",
      platform: "Facebook",
      device: "IPHONE 16",
      type: "catalog",
      landsOn: "Product",
      active: intent === "eco",
      color: "#10b981"
    },
    {
      id: "budget",
      name: "Nidhi",
      tag: "Deal Hunter",
      city: "BANGALORE",
      platform: "Facebook",
      device: "GOOGLE PIXEL 9",
      type: "sale",
      landsOn: "Collection",
      active: intent === "budget",
      color: "#ef4444"
    }
  ];

  return (
    <div className={styles.playgroundWrapper}>
      <header className={styles.topNav}>
        <div className={styles.logo}>AdaptIQ</div>
        <div className={styles.navRight}>
          <button className={styles.talkBtn}>Talk to us ↗</button>
        </div>
      </header>

      <div className={styles.mainLayout}>
        {/* Left Column: Personas */}
        <div className={styles.leftColumn}>
          <h2 className={styles.columnTitle}>Select User Persona</h2>
          <div className={styles.personaList}>
            {personas.map(p => (
              <div 
                key={p.id} 
                className={`${styles.personaCard} ${p.active ? styles.personaCardActive : ''}`}
                onClick={() => setIntent(p.id)}
              >
                <div className={styles.personaHeader}>
                  <span className={styles.personaName}>{p.name}</span>
                  {p.active && <span className={styles.activeTag}>● Active</span>}
                </div>
                <div className={styles.personaGrid}>
                  <div>
                    <span className={styles.label}>City:</span>
                    <span className={styles.value}>{p.city}</span>
                  </div>
                  <div>
                    <span className={styles.label}>Platform:</span>
                    <span className={styles.value}>{p.platform}</span>
                  </div>
                  <div>
                    <span className={styles.label}>Device:</span>
                    <span className={styles.value}>{p.device}</span>
                  </div>
                  <div>
                    <span className={styles.label}>Type of Ad:</span>
                    <span className={styles.value}>{p.type}</span>
                  </div>
                  <div>
                    <span className={styles.label}>Persona:</span>
                    <span className={styles.value}>{p.tag}</span>
                  </div>
                  <div>
                    <span className={styles.label}>Lands On:</span>
                    <span className={styles.value}>{p.landsOn}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Column: Mobile Simulator */}
        <div className={styles.centerColumn}>
          <div className={styles.aiBanner}>
            We've studied what makes you, you—now here's what you'll love
            <span className={styles.conversionScore}>Conversion Score: 17%</span>
          </div>
          
          <div className={styles.phoneMockup}>
            <div className={styles.phoneNotch}></div>
            <div className={styles.phoneScreen} key={intent}>
              {/* FakeStore Inside Phone */}
              <header className={styles.storeHeader}>
                <h2>AdaptIQ Store</h2>
                <div className={styles.searchBarWrapper}>
                  <input type="text" placeholder="Search..." id="store-search" />
                </div>
              </header>

              <main className={styles.storeMain}>
                <div className={styles.heroSection} id="adaptive-hero">
                  <h1 id="hero-headline">Welcome to our Winter Collection</h1>
                  <p id="hero-subtext">Discover the best gear for your next adventure.</p>
                </div>

                <div className={styles.productDisplay}>
                  <img src="https://cdn.shopify.com/s/files/1/0885/8730/5239/files/Main_046c8230-07ea-4ff7-b12e-a320aa1961e9.jpg" alt="Snowboard" />
                  <div className={styles.productInfo}>
                    <h2>The Collection Snowboard: Liquid</h2>
                    <p className={styles.price}>$629.95</p>
                    <button className={styles.addToCart}>Add to Cart</button>
                  </div>
                </div>
              </main>

              <Script 
                src={`/widget.js?intent=${intent}`} 
                strategy="afterInteractive" 
                data-store-id="store_123" 
              />
            </div>
          </div>
        </div>

        {/* Right Column: Insights */}
        <div className={styles.rightColumn}>
          <div className={styles.insightPanel}>
            <h3 className={styles.panelTitle}>Products Attributes</h3>
            <p className={styles.panelSub}>Tags created based on your experience</p>
            <div className={styles.tagGrid}>
              <div className={styles.tag}><span className={styles.tagTitle}>Terrain</span><span>All Mountain</span></div>
              <div className={styles.tag}><span className={styles.tagTitle}>Flex</span><span>Medium</span></div>
              <div className={styles.tag}><span className={styles.tagTitle}>Profile</span><span>Camber</span></div>
              <div className={styles.tag}><span className={styles.tagTitle}>Shape</span><span>Directional</span></div>
              <div className={styles.tag}><span className={styles.tagTitle}>Level</span><span>Advanced</span></div>
            </div>
          </div>

          <div className={styles.insightPanel}>
            <h3 className={styles.panelTitle}>User Attributes</h3>
            <p className={styles.panelSub}>Tags created based on your experience</p>
            <div className={styles.tagGrid}>
              <div className={styles.tag}><span className={styles.tagTitle}>Internet Speed</span><span>High</span></div>
              <div className={styles.tag}><span className={styles.tagTitle}>Occupation</span><span>Self-Employed</span></div>
              <div className={styles.tag}><span className={styles.tagTitle}>Location</span><span>Delhi</span></div>
            </div>
          </div>

          <div className={styles.insightPanel}>
            <h3 className={styles.panelTitle}>Business Impact Levers</h3>
            <p className={styles.panelSub}>Personalization strategies influencing your outcomes</p>
            <div className={styles.impactGrid}>
              <div className={styles.impactTag}>Dynamic Bundling <span className={styles.impactScore}>+21%</span></div>
              <div className={styles.impactTag}>Similar Product Suggestion <span className={styles.impactScore}>+27%</span></div>
              <div className={styles.impactTag}>Behavior-Led Recommendations <span className={styles.impactScore}>+24%</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
