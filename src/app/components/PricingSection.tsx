"use client";

import { useEffect, useRef } from "react";
import { Check, Zap, Star } from "lucide-react";
import styles from "./PricingSection.module.css";

const plans = [
  {
    name: "Starter",
    price: "49",
    desc: "Perfect for new stores ready to add AI-powered product discovery.",
    features: [
      "Precision Recommendations Widget",
      "Behaviour-based product surfacing",
      "Basic Analytics Dashboard",
      "Up to 5,000 monthly sessions",
      "Email support",
      "Shopify & WooCommerce",
    ],
    cta: "Get Started Free",
    featured: false,
  },
  {
    name: "Growth",
    price: "149",
    desc: "The complete intelligent storefront stack for growing online stores.",
    features: [
      "Everything in Starter",
      "LiveStore Intelligence (adaptive pages)",
      "Semantic Search Engine",
      "AutoPack Engine (bundles & upsells)",
      "Up to 50,000 monthly sessions",
      "Priority email + chat support",
      "Advanced analytics & split testing",
      "Revenue attribution reports",
    ],
    cta: "Start Growing",
    featured: true,
    badge: "Most Popular",
  },
  {
    name: "Pro",
    price: "299",
    desc: "Full power for high-volume stores and agency clients.",
    features: [
      "Everything in Growth",
      "Revenue Command Center",
      "Custom recommendation logic",
      "Unlimited monthly sessions",
      "Dedicated onboarding call",
      "White-label ready",
      "API access",
      "SLA uptime guarantee",
    ],
    cta: "Go Pro",
    featured: false,
  },
];

export default function PricingSection() {
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
    <section className={`section ${styles.pricing}`} id="pricing" ref={ref}>
      <div className="container">
        {/* Header */}
        <div className="reveal section-header">
          <div className="section-label">
            <span className="dot" />
            Simple Pricing
          </div>
          <h2 className="section-title">
            Transparent pricing.
            <br />
            <span className="gradient-text">No surprises.</span>
          </h2>
          <p className="section-subtitle">
            Start free for 14 days. No credit card required. Cancel anytime.
            Every plan includes setup support.
          </p>
        </div>

        {/* Plans */}
        <div className={styles.plans}>
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`reveal-scale pricing-card ${plan.featured ? "featured" : ""} ${styles.planCard}`}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              {/* Featured badge */}
              {plan.featured && (
                <div className={styles.featuredBadge}>
                  <Star size={12} fill="currentColor" />
                  {plan.badge}
                </div>
              )}

              {/* Plan name */}
              <div className={styles.planName}>{plan.name}</div>

              {/* Price */}
              <div className={styles.priceRow}>
                <span className="price-currency">$</span>
                <span className="price-amount">{plan.price}</span>
              </div>
              <div className="price-period">per month, billed monthly</div>

              {/* Desc */}
              <p className={styles.planDesc}>{plan.desc}</p>

              {/* Divider */}
              <div className={styles.planDivider} />

              {/* Features */}
              <ul className={styles.featureList}>
                {plan.features.map((f) => (
                  <li key={f} className="check-item">
                    <span className="check-icon">
                      <Check size={10} strokeWidth={3} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="#cta"
                className={`btn ${plan.featured ? "btn-primary" : "btn-secondary"} ${styles.planCta}`}
              >
                {plan.featured && <Zap size={15} fill="currentColor" />}
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Agency note */}
        <div className={`reveal ${styles.agencyNote}`}>
          <div className={styles.agencyNoteInner}>
            <div className={styles.agencyIcon}>🏢</div>
            <div>
              <div className={styles.agencyTitle}>Agency & White-Label Plans</div>
              <div className={styles.agencyDesc}>
                Running a Shopify agency? Get custom pricing, white-label branding, and manage
                multiple client stores from one dashboard. Reach out for a custom quote.
              </div>
            </div>
            <a href="#cta" className={`btn btn-ghost btn-sm ${styles.agencyCta}`}>
              Talk to Us →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
