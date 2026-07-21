"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import styles from "./FAQ.module.css";

const faqs = [
  {
    q: "Do I need to know how to code to use AdaptIQ?",
    a: "Not at all. Installing AdaptIQ takes one copy-paste of a script tag into your Shopify theme — that's it. No coding, no developers, no complex configuration. Our setup guide walks you through every step in under 10 minutes.",
  },
  {
    q: "Will it work with my existing Shopify theme?",
    a: "Yes. AdaptIQ is designed to work with any Shopify theme — Debut, Dawn, custom themes, or any third-party theme. Our widget injects into your store's existing layout non-destructively, meaning your design stays intact.",
  },
  {
    q: "How long before I see results?",
    a: "Most stores see measurable improvement in recommendation click-through rates within the first 48 hours. Cart value and conversion improvements typically become statistically clear within 7–14 days as the AI model learns your store's traffic patterns.",
  },
  {
    q: "Does this slow down my store?",
    a: "No. The AdaptIQ widget is loaded asynchronously (it doesn't block page rendering) and is served from our global CDN. Our average widget load time is under 50ms, which is well below the threshold for any SEO or UX impact.",
  },
  {
    q: "Can I use this for my clients as an agency?",
    a: "Absolutely — this is one of AdaptIQ's key use cases. You can install it on client stores, manage everything from one dashboard, and even white-label it under your own brand. Talk to us about our Agency plan for bulk pricing.",
  },
  {
    q: "What data does AdaptIQ collect?",
    a: "AdaptIQ collects anonymous session data (products viewed, clicked, purchased, device type, referral source) — all without collecting personally identifiable information. We are fully GDPR and CCPA compliant, and we never sell data to third parties.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. All plans are month-to-month with no contracts. You can cancel from your dashboard at any time. If you cancel, AdaptIQ will deactivate at the end of your billing period and your store returns to its original behavior.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes — all plans come with a 14-day free trial, no credit card required. You'll get full access to your chosen plan's features so you can see real results before committing.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`${styles.item} ${open ? styles.open : ""}`}>
      <button className={styles.question} onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <ChevronDown size={18} className={styles.chevron} />
      </button>
      <div className={styles.answer}>
        <div className={styles.answerInner}>{a}</div>
      </div>
    </div>
  );
}

export default function FAQ() {
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
    ref.current?.querySelectorAll(".reveal").forEach((el) =>
      observer.observe(el)
    );
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`section ${styles.faq}`} id="faq" ref={ref}>
      <div className="container">
        <div className="reveal section-header">
          <div className="section-label">
            <span className="dot" />
            FAQ
          </div>
          <h2 className="section-title">
            Frequently asked
            <br />
            <span className="gradient-text">questions.</span>
          </h2>
          <p className="section-subtitle">
            Everything you need to know about AdaptIQ. Can&apos;t find your
            answer? Reach out and we&apos;ll get back to you within 24 hours.
          </p>
        </div>

        <div className={`reveal ${styles.list}`}>
          {faqs.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
