"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowRight, Zap } from "lucide-react";
import styles from "./CTASection.module.css";

export default function CTASection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section className={`section ${styles.cta}`} id="cta" ref={ref}>
      {/* Background */}
      <div className={styles.bg} />
      <div className={`glow-blob glow-violet ${styles.blob1}`} />
      <div className={`glow-blob glow-cyan ${styles.blob2}`} />

      <div className="container">
        <div className={`reveal-scale ${styles.card}`}>
          {/* Icon */}
          <div className={styles.iconWrap}>
            <Zap size={28} fill="white" color="white" />
          </div>

          {/* Headline */}
          <h2 className={styles.title}>
            Ready to make your store
            <br />
            <span className="gradient-text">truly adaptive?</span>
          </h2>

          <p className={styles.subtitle}>
            Join the waitlist and get 14 days free — no credit card required.
            <br />
            We&apos;ll personally onboard your first store.
          </p>

          {/* Form */}
          {!submitted ? (
            <form className={styles.form} onSubmit={handleSubmit}>
              <input
                type="email"
                className={`input ${styles.emailInput}`}
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className={`btn btn-primary btn-lg ${styles.submitBtn}`}>
                Get Early Access
                <ArrowRight size={18} />
              </button>
            </form>
          ) : (
            <div className={styles.successMsg}>
              <span className={styles.successIcon}>🎉</span>
              <div>
                <div className={styles.successTitle}>You&apos;re on the list!</div>
                <div className={styles.successSub}>
                  We&apos;ll reach out within 24 hours to set you up.
                </div>
              </div>
            </div>
          )}

          {/* Trust signals */}
          <div className={styles.trust}>
            <span>✓ 14-day free trial</span>
            <span>✓ No credit card needed</span>
            <span>✓ Cancel anytime</span>
            <span>✓ Personal onboarding</span>
          </div>
        </div>
      </div>
    </section>
  );
}
