"use client";

import { useEffect, useRef } from "react";
import {
  Sparkles,
  Layout,
  Search,
  Package,
  BarChart2,
} from "lucide-react";
import styles from "./FeaturesSection.module.css";

const features = [
  {
    icon: Sparkles,
    iconClass: "feature-icon-violet",
    badge: "Core Feature",
    badgeClass: "badge-violet",
    title: "Precision Recommendations",
    description:
      "AI-driven product suggestions built around each visitor's real-time behaviour — what they browse, click, skip, and buy. Surface the exact right product for each person, every time.",
    bullets: [
      "Behaviour-based product surfacing",
      "Affinity scoring per session",
      "Recently engaged products",
      "Location & trend-aware picks",
    ],
    metric: "+26%",
    metricLabel: "avg. conversion lift",
    color: "#7c6dfa",
  },
  {
    icon: Layout,
    iconClass: "feature-icon-cyan",
    badge: "Most Popular",
    badgeClass: "badge-cyan",
    title: "LiveStore Intelligence",
    description:
      "Your homepage, collection pages, and banners shift in real-time based on exactly who is visiting. Every session gets a different — and better — front page.",
    bullets: [
      "Intent-driven homepage layouts",
      "Geo-aware content swapping",
      "Device-optimised experiences",
      "First visit vs. repeat visitor modes",
    ],
    metric: "+21%",
    metricLabel: "avg. cart value increase",
    color: "#00d4ff",
  },
  {
    icon: Search,
    iconClass: "feature-icon-green",
    badge: "AI-Powered",
    badgeClass: "badge-green",
    title: "Semantic Search Engine",
    description:
      "Move beyond simple keyword matching. Natural language understanding that reads intent, corrects mistakes, and brings back results that actually sell — not just results that match.",
    bullets: [
      "Intent-first natural language search",
      "Fuzzy matching & autocorrect",
      "Margin-aware result boosting",
      "No-results fallback with suggestions",
    ],
    metric: "4×",
    metricLabel: "search-to-purchase rate",
    color: "#00e5a0",
  },
  {
    icon: Package,
    iconClass: "feature-icon-pink",
    badge: "Revenue Driver",
    badgeClass: "badge-violet",
    title: "AutoPack Engine",
    description:
      "Automatically generates contextual product bundles and in-cart upsells based on what is trending, what is in stock, and what combinations are proven to convert in your category.",
    bullets: [
      "In-cart offer suggestions",
      "Style & category bundles",
      "Post-checkout cross-sell flow",
      "Inventory-driven bundle logic",
    ],
    metric: "+19%",
    metricLabel: "items per order",
    color: "#f43f8b",
  },
  {
    icon: BarChart2,
    iconClass: "feature-icon-violet",
    badge: "Full Control",
    badgeClass: "badge-violet",
    title: "Revenue Command Center",
    description:
      "A clear, real-time control panel showing exactly what the AI is doing, what it is earning you, and where you can step in to override, boost, or pin specific products manually.",
    bullets: [
      "AI revenue attribution tracker",
      "Manual product priority controls",
      "Split-test result summaries",
      "White-label client report exports",
    ],
    metric: "< 15 min",
    metricLabel: "to go live after install",
    color: "#7c6dfa",
  },
];

export default function FeaturesSection() {
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
    <section className={`section ${styles.features}`} id="features" ref={ref}>
      <div className="bg-grid" style={{ opacity: 0.4 }} />
      <div className="container">
        {/* Header */}
        <div className={`reveal section-header`}>
          <div className="section-label">
            <span className="dot" />
            What AdaptIQ Does
          </div>
          <h2 className="section-title">
            Five tools.
            <br />
            <span className="gradient-text">One adaptive engine.</span>
          </h2>
          <p className="section-subtitle">
            Each feature works together in a unified AI layer — so your store
            adapts as a whole, not just in pieces.
          </p>
        </div>

        {/* Features Grid */}
        <div className={styles.grid}>
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`reveal-scale card gradient-border ${styles.featureCard}`}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                {/* Icon */}
                <div className={`feature-icon ${feature.iconClass}`}>
                  <Icon size={20} strokeWidth={1.8} />
                </div>

                {/* Badge */}
                <div className={`badge ${feature.badgeClass} ${styles.featureBadge}`}>
                  {feature.badge}
                </div>

                {/* Title */}
                <h3 className={styles.featureTitle}>{feature.title}</h3>

                {/* Description */}
                <p className={styles.featureDesc}>{feature.description}</p>

                {/* Bullets */}
                <ul className={styles.bullets}>
                  {feature.bullets.map((b) => (
                    <li key={b} className={styles.bullet}>
                      <span
                        className={styles.bulletDot}
                        style={{ background: feature.color }}
                      />
                      {b}
                    </li>
                  ))}
                </ul>

                {/* Metric */}
                <div className={styles.metric} style={{ borderColor: `${feature.color}20`, background: `${feature.color}08` }}>
                  <span className={styles.metricValue} style={{ color: feature.color }}>
                    {feature.metric}
                  </span>
                  <span className={styles.metricLabel}>{feature.metricLabel}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
