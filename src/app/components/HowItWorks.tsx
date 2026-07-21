"use client";

import { useEffect, useRef } from "react";
import { Download, Plug, TrendingUp } from "lucide-react";
import styles from "./HowItWorks.module.css";

const steps = [
  {
    number: "01",
    icon: Download,
    title: "Install the Snippet",
    description:
      "Add one line of JavaScript to your Shopify theme. No app store approval needed. No complex configuration. Works with every theme out of the box.",
    color: "#7c6dfa",
    detail: "< 2 minutes to install",
  },
  {
    number: "02",
    icon: Plug,
    title: "Connect Your Store",
    description:
      "AdaptIQ automatically syncs your product catalog, reads your order history, and sets up tracking — all without you lifting a finger. We do the heavy lifting.",
    color: "#00d4ff",
    detail: "Automatic sync in < 5 min",
  },
  {
    number: "03",
    icon: TrendingUp,
    title: "Watch It Adapt",
    description:
      "From the moment it's live, AdaptIQ starts learning and personalizing. Your store adapts to every visitor in real-time. You watch revenue grow from your dashboard.",
    color: "#00e5a0",
    detail: "Live within 15 minutes",
  },
];

export default function HowItWorks() {
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
    <section className={`section ${styles.howItWorks}`} id="how-it-works" ref={ref}>
      <div className="container">
        {/* Header */}
        <div className="reveal section-header">
          <div className="section-label">
            <span className="dot" />
            How It Works
          </div>
          <h2 className="section-title">
            Up and running in
            <br />
            <span className="gradient-text">under 15 minutes.</span>
          </h2>
          <p className="section-subtitle">
            No developer required. No complex integrations. Just a snippet, a
            connection, and results.
          </p>
        </div>

        {/* Steps */}
        <div className={styles.steps}>
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className={`reveal-scale ${styles.step}`}
                style={{ transitionDelay: `${i * 0.15}s` }}
              >
                {/* Step connector line */}
                {i < steps.length - 1 && (
                  <div className={styles.connector}>
                    <div className={styles.connectorLine} style={{ background: `linear-gradient(to right, ${step.color}, ${steps[i + 1].color})` }} />
                  </div>
                )}

                {/* Card */}
                <div className={styles.stepCard}>
                  {/* Number */}
                  <div className={styles.stepNumber} style={{ color: step.color }}>
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div
                    className={styles.stepIcon}
                    style={{
                      background: `${step.color}15`,
                      border: `1px solid ${step.color}30`,
                      color: step.color,
                    }}
                  >
                    <Icon size={22} strokeWidth={1.8} />
                  </div>

                  {/* Content */}
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDesc}>{step.description}</p>

                  {/* Detail tag */}
                  <div
                    className={styles.stepDetail}
                    style={{
                      background: `${step.color}10`,
                      border: `1px solid ${step.color}25`,
                      color: step.color,
                    }}
                  >
                    ✓ {step.detail}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Code snippet teaser */}
        <div className={`reveal ${styles.codeTeaser}`}>
          <div className={styles.codeTeaserLabel}>That&apos;s literally all it takes ↓</div>
          <div className={styles.codeBlock}>
            <div className={styles.codeHeader}>
              <span className={styles.codeLang}>HTML</span>
              <span className={styles.codeCopy}>Copy</span>
            </div>
            <div className={styles.codeContent}>
              <span className={styles.codeComment}>{"<!-- Add before </body> -->"}</span>
              <br />
              <span className={styles.codeTag}>{"<script "}</span>
              <span className={styles.codeAttr}>src</span>
              <span className={styles.codeEq}>=</span>
              <span className={styles.codeStr}>&quot;https://cdn.adaptiq.co/widget.js&quot;</span>
              <br />
              {"        "}
              <span className={styles.codeAttr}>data-store-id</span>
              <span className={styles.codeEq}>=</span>
              <span className={styles.codeStr}>&quot;YOUR_STORE_ID&quot;</span>
              <br />
              {"        "}
              <span className={styles.codeAttr}>defer</span>
              <span className={styles.codeTag}>{">"}</span>
              <span className={styles.codeTag}>{"</script>"}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
