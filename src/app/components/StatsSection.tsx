"use client";

import { useEffect, useRef } from "react";
import { TrendingUp, ShoppingCart, Users, DollarSign } from "lucide-react";
import styles from "./StatsSection.module.css";

const stats = [
  {
    icon: TrendingUp,
    value: "26%",
    label: "Avg Conversion Lift",
    desc: "Measured across AdaptIQ-enabled stores compared to their 90-day pre-install baseline",
    color: "#7c6dfa",
  },
  {
    icon: ShoppingCart,
    value: "21%",
    label: "Larger Average Cart Value",
    desc: "Driven by contextual in-cart upsells, AutoPack bundles, and behaviour-matched add-ons",
    color: "#00d4ff",
  },
  {
    icon: Users,
    value: "33%",
    label: "More Repeat Visits",
    desc: "Shoppers who see a personalised experience are significantly more likely to return and buy again",
    color: "#00e5a0",
  },
  {
    icon: DollarSign,
    value: "3.1×",
    label: "Ad Revenue Return",
    desc: "Ad traffic landing on a personalised store page outperforms generic landing pages significantly",
    color: "#f43f8b",
  },
];

const platforms = ["Shopify", "WooCommerce", "BigCommerce", "Wix eCommerce", "Squarespace"];

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll(".reveal, .reveal-scale").forEach((el) =>
      observer.observe(el)
    );
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`section ${styles.statsSection}`} ref={ref}>
      {/* Background gradient */}
      <div className={styles.bgGradient} />
      <div className={`glow-blob glow-violet ${styles.blob}`} />

      <div className="container">
        {/* Label */}
        <div className="reveal" style={{ textAlign: "center", marginBottom: "16px" }}>
          <div className="section-label" style={{ display: "inline-flex" }}>
            <span className="dot" />
            Proven Results
          </div>
        </div>

        <h2 className={`reveal section-title`} style={{ textAlign: "center", marginBottom: "64px" }}>
          Numbers that speak for{" "}
          <span className="gradient-text">themselves.</span>
        </h2>

        {/* Stats Grid */}
        <div className={styles.grid}>
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.value}
                className={`reveal-scale card ${styles.statCard}`}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div
                  className={styles.statIcon}
                  style={{
                    background: `${stat.color}12`,
                    border: `1px solid ${stat.color}25`,
                    color: stat.color,
                  }}
                >
                  <Icon size={20} strokeWidth={1.8} />
                </div>
                <div className="stat-number" style={{
                  background: `linear-gradient(135deg, ${stat.color}, ${stat.color}aa)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  {stat.value}
                </div>
                <div className={styles.statLabel}>{stat.label}</div>
                <p className={styles.statDesc}>{stat.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Platform compatibility bar */}
        <div className={`reveal ${styles.platforms}`}>
          <div className={styles.platformsLabel}>Works with</div>
          <div className={styles.platformList}>
            {platforms.map((p) => (
              <div key={p} className={styles.platformBadge}>
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
