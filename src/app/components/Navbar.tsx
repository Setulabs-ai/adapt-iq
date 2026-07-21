"use client";

import { useState, useEffect } from "react";
import { Zap, Menu, X } from "lucide-react";
import styles from "./Navbar.module.css";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <a href="#" className={styles.logo}>
          <div className={styles.logoIcon}>
            <Zap size={16} strokeWidth={2.5} />
          </div>
          <span className={styles.logoText}>
            Adapt<span className={styles.logoAccent}>IQ</span>
          </span>
        </a>

        {/* Desktop Nav Links */}
        <div className={styles.links}>
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className={styles.link}>
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className={styles.actions}>
          <a href="#pricing" className="btn btn-secondary btn-sm">
            View Pricing
          </a>
          <a href="#cta" className="btn btn-primary btn-sm">
            Get Started
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className={styles.mobileToggle}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={styles.mobileLink}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className={styles.mobileCtas}>
            <a href="#pricing" className="btn btn-secondary btn-sm w-full" style={{ justifyContent: "center" }}>
              View Pricing
            </a>
            <a href="#cta" className="btn btn-primary btn-sm w-full" style={{ justifyContent: "center" }}>
              Get Started
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
