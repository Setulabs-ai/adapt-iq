"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, BarChart2, Layout, Shuffle } from "lucide-react";
import styles from "./ProblemSection.module.css";

const problems = [
  { icon: Layout, text: "Same homepage for every visitor" },
  { icon: BarChart2, text: "No idea why conversions drop" },
  { icon: Shuffle, text: "Generic recommendations that don't convert" },
];

export default function ProblemSection() {
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
    ref.current?.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach((el) =>
      observer.observe(el)
    );
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`section ${styles.problem}`} ref={ref}>
      <div className="container">
        <div className={styles.grid}>
          {/* Left: The Problem */}
          <div className={`reveal-left ${styles.left}`}>
            <div className="section-label">
              <span className="dot" />
              The Problem
            </div>
            <h2 className={styles.title}>
              Every visitor is different.
              <br />
              <span className="gradient-text">Your store isn't.</span>
            </h2>
            <p className={styles.body}>
              Most Shopify stores serve a single, static experience to every
              visitor — whether it&apos;s someone discovering you for the first
              time or a loyal customer returning to buy again.
            </p>
            <p className={styles.body}>
              This isn&apos;t just a missed opportunity. It&apos;s leaving real
              money on the table every single day.
            </p>

            <div className={styles.problemList}>
              {problems.map(({ icon: Icon, text }) => (
                <div key={text} className={styles.problemItem}>
                  <div className={styles.problemIcon}>
                    <Icon size={14} />
                  </div>
                  <span>{text}</span>
                </div>
              ))}
            </div>

            <a href="#features" className="btn btn-primary" style={{ marginTop: "32px" }}>
              See the Solution
              <ArrowRight size={16} />
            </a>
          </div>

          {/* Right: Before / After Visual */}
          <div className={`reveal-right ${styles.right}`}>
            <div className={styles.comparison}>
              {/* Before */}
              <div className={styles.compCard}>
                <div className={styles.compCardHeader}>
                  <span className={styles.compBadgeBad}>Before AdaptIQ</span>
                </div>
                <div className={styles.compStore}>
                  <div className={styles.compBanner} style={{ background: "rgba(255,255,255,0.03)" }}>
                    <div className={styles.compBannerText} style={{ color: "#5a6a8a" }}>
                      Summer Sale — Up to 50% off
                    </div>
                  </div>
                  <div className={styles.compGrid}>
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={styles.compProduct}>
                        <div className={styles.compProductImg} style={{ background: "rgba(255,255,255,0.03)" }} />
                        <div className={styles.compProductBar} style={{ width: `${60 + i * 5}%`, background: "rgba(255,255,255,0.06)" }} />
                        <div className={styles.compProductBar} style={{ width: "40%", background: "rgba(255,255,255,0.04)" }} />
                      </div>
                    ))}
                  </div>
                  <div className={styles.compNote}>
                    ↳ Same page shown to all 1,240 visitors today
                  </div>
                </div>
              </div>

              {/* VS divider */}
              <div className={styles.vsDivider}>
                <span>VS</span>
              </div>

              {/* After */}
              <div className={`${styles.compCard} ${styles.compCardAfter}`}>
                <div className={styles.compCardHeader}>
                  <span className={styles.compBadgeGood}>With AdaptIQ</span>
                </div>
                <div className={styles.compStore}>
                  <div className={styles.compBanner} style={{
                    background: "linear-gradient(135deg, rgba(124,109,250,0.15), rgba(0,212,255,0.08))",
                    border: "1px solid rgba(124,109,250,0.2)"
                  }}>
                    <div className={styles.compBannerText} style={{ color: "#a094fd" }}>
                      ✨ Welcome back, Sarah! Your picks are here
                    </div>
                  </div>
                  <div className={styles.compGrid}>
                    {[
                      { color: "#7c6dfa", tag: "For You" },
                      { color: "#00d4ff", tag: "New" },
                      { color: "#00e5a0", tag: "Top Seller" },
                      { color: "#f43f8b", tag: "Trending" },
                    ].map((p, i) => (
                      <div key={i} className={`${styles.compProduct} ${styles.compProductActive}`}>
                        <div
                          className={styles.compProductImg}
                          style={{
                            background: `linear-gradient(135deg, ${p.color}20, ${p.color}08)`,
                            border: `1px solid ${p.color}30`,
                          }}
                        >
                          <span style={{ fontSize: "9px", color: p.color, fontWeight: 700 }}>{p.tag}</span>
                        </div>
                        <div className={styles.compProductBar} style={{ width: `${65 + i * 5}%`, background: `${p.color}40` }} />
                        <div className={styles.compProductBar} style={{ width: "45%", background: `${p.color}25` }} />
                      </div>
                    ))}
                  </div>
                  <div className={`${styles.compNote} ${styles.compNoteGood}`}>
                    ↳ Personalized for each of 1,240 visitors — individually
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
