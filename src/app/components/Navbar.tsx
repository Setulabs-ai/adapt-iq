"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
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
            <img src="/img/setu_logo.png" alt="Setu Labs Logo" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
          </div>
          <span className={styles.logoText}>
            Adapt IQ <span className={styles.logoAccent} style={{ fontSize: '0.65em', color: '#8a9bb8', fontWeight: 500 }}>by Setu Labs</span>
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
          <a href="/login" className="btn btn-secondary btn-sm" style={{ border: 'none', background: 'transparent' }}>
            Login
          </a>
          <a href="/install" className="btn btn-primary btn-sm">
            Install App
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
            <a href="/login" className="btn btn-secondary btn-sm w-full" style={{ justifyContent: "center", border: 'none', background: 'transparent' }}>
              Login
            </a>
            <a href="/install" className="btn btn-primary btn-sm w-full" style={{ justifyContent: "center" }}>
              Install App
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
