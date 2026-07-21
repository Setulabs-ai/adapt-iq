"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, Play, TrendingUp, ShoppingBag, Sparkles } from "lucide-react";
import styles from "./Hero.module.css";

const stats = [
  { value: "26%", label: "Avg Conversion Lift", icon: TrendingUp },
  { value: "21%", label: "Larger Cart Value", icon: ShoppingBag },
  { value: "3.1×", label: "Ad Revenue Return", icon: Sparkles },
  { value: "< 15 min", label: "Full Setup Time", icon: ArrowRight },
];

const mockProducts = [
  { name: "Air Max Pulse", price: "$149", tag: "Trending", color: "#7c6dfa" },
  { name: "Runner Pro X", price: "$189", tag: "For You", color: "#00d4ff" },
  { name: "Classic Boost", price: "$129", tag: "Popular", color: "#00e5a0" },
  { name: "Urban Stride", price: "$165", tag: "New", color: "#f43f8b" },
];

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const reveals = heroRef.current?.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale");
    reveals?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.hero} ref={heroRef}>
      {/* Background elements */}
      <div className="bg-grid" />
      <div className={`glow-blob glow-violet ${styles.blob1}`} />
      <div className={`glow-blob glow-cyan ${styles.blob2}`} />
      <div className={`glow-blob glow-pink ${styles.blob3}`} />

      <div className="container">
        <div className={styles.content}>
          {/* Badge */}
          <div className={`reveal ${styles.badge}`}>
            <div className="section-label">
              <span className="dot" />
              AI-Powered · Built for Shopify
            </div>
          </div>

          {/* Headline */}
          <h1 className={`reveal delay-1 ${styles.headline}`}>
            Your Store.
            <br />
            <span className="gradient-text">Now Adaptive.</span>
          </h1>

          {/* Subheadline */}
          <p className={`reveal delay-2 ${styles.subheadline}`}>
            Every visitor is different — so why does your store show them the
            same thing? AdaptIQ uses AI to personalize your Shopify storefront
            in real-time, boosting conversions and average order value
            automatically.
          </p>

          {/* CTAs */}
          <div className={`reveal delay-3 ${styles.ctas}`}>
            <a href="#cta" className="btn btn-primary btn-lg">
              Request a Demo
              <ArrowRight size={18} />
            </a>
            <a href="#how-it-works" className="btn btn-secondary btn-lg">
              <Play size={16} fill="currentColor" />
              See How It Works
            </a>
          </div>

          {/* Stats Bar */}
          <div className={`reveal delay-4 ${styles.statsBar}`}>
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className={styles.statItem}>
                <div className={styles.statValue}>{value}</div>
                <div className={styles.statLabel}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Visual — Adaptive Store Mockup */}
        <div className={`reveal-scale delay-2 ${styles.visual}`}>
          <div className={styles.mockupWrapper}>
            {/* Browser chrome */}
            <div className={styles.browserBar}>
              <div className={styles.browserDots}>
                <span style={{ background: "#ff5f57" }} />
                <span style={{ background: "#ffbd2e" }} />
                <span style={{ background: "#28c840" }} />
              </div>
              <div className={styles.browserUrl}>
                <span>mystore.com</span>
                <span className={styles.adaptiveBadge}>
                  <Sparkles size={10} />
                  AI Active
                </span>
              </div>
            </div>

            {/* Store Content */}
            <div className={styles.storeContent}>
              {/* Personalized banner */}
              <div className={styles.banner}>
                <div className={styles.bannerText}>
                  <div className={styles.bannerLabel}>✨ Just for you</div>
                  <div className={styles.bannerTitle}>Summer Collection</div>
                  <div className={styles.bannerSub}>Based on your style</div>
                </div>
                <div className={styles.bannerVisual}>
                  <div className={styles.bannerOrb} />
                </div>
              </div>

              {/* AI Recommendation label */}
              <div className={styles.recHeader}>
                <span className={styles.recLabel}>
                  <Sparkles size={11} />
                  AI Recommendations — Personalized for this visitor
                </span>
                <span className={styles.recUpdate}>Live</span>
              </div>

              {/* Product Grid */}
              <div className={styles.productGrid}>
                {mockProducts.map((product, i) => (
                  <div key={product.name} className={`${styles.productCard} ${i === 0 ? styles.featured : ""}`}>
                    <div
                      className={styles.productImage}
                      style={{
                        background: `linear-gradient(135deg, ${product.color}22, ${product.color}08)`,
                        border: `1px solid ${product.color}33`,
                      }}
                    >
                      <div
                        className={styles.productOrb}
                        style={{ background: product.color }}
                      />
                      <span
                        className={styles.productTag}
                        style={{ color: product.color, borderColor: `${product.color}40`, background: `${product.color}15` }}
                      >
                        {product.tag}
                      </span>
                    </div>
                    <div className={styles.productInfo}>
                      <div className={styles.productName}>{product.name}</div>
                      <div className={styles.productPrice}>{product.price}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Conversion bar */}
              <div className={styles.conversionBar}>
                <div className={styles.conversionText}>
                  <TrendingUp size={12} color="#00e5a0" />
                  <span>Conversion lift +26% this session</span>
                </div>
                <div className={styles.conversionPill}>Live</div>
              </div>
            </div>

            {/* Floating analytics card */}
            <div className={styles.floatingCard}>
              <div className={styles.floatingCardHeader}>
                <TrendingUp size={14} color="#00e5a0" />
                <span>Revenue Impact</span>
              </div>
              <div className={styles.floatingCardValue}>+$2,847</div>
              <div className={styles.floatingCardSub}>from AI recs today</div>
            </div>

            {/* Floating visitor card */}
            <div className={styles.floatingCardRight}>
              <div className={styles.visitorDot} />
              <div>
                <div className={styles.visitorCount}>247</div>
                <div className={styles.visitorLabel}>live visitors</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className={styles.bottomFade} />
    </section>
  );
}
