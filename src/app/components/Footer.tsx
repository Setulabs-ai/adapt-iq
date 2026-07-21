import { Zap, Mail } from "lucide-react";
import styles from "./Footer.module.css";

const links = {
  Product: ["Features", "How It Works", "Pricing", "Changelog"],
  Company: ["About", "Blog", "Careers", "Press"],
  Support: ["Documentation", "Help Center", "Contact", "Status"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"],
};

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}>
                <Zap size={16} strokeWidth={2.5} />
              </div>
              <span className={styles.logoText}>
                Adapt<span className={styles.logoAccent}>IQ</span>
              </span>
            </div>
            <p className={styles.tagline}>
              AI-powered adaptive storefronts
              <br />
              for Shopify stores of every size.
            </p>
            <div className={styles.social}>
              <a href="#" className={styles.socialLink} aria-label="X / Twitter">
                {/* X (Twitter) icon */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className={styles.socialLink} aria-label="LinkedIn">
                {/* LinkedIn icon */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="mailto:hello@adaptiq.co" className={styles.socialLink} aria-label="Email">
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className={styles.linksGrid}>
            {Object.entries(links).map(([category, items]) => (
              <div key={category} className={styles.linkGroup}>
                <div className={styles.linkGroupTitle}>{category}</div>
                <ul className={styles.linkList}>
                  {items.map((item) => (
                    <li key={item}>
                      <a href="#" className={styles.link}>
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.copyright}>
            © 2026 AdaptIQ. Built with ♥ for Shopify agencies worldwide.
          </div>
          <div className={styles.badges}>
            <span className={styles.badge}>SOC 2 Type II</span>
            <span className={styles.badge}>GDPR Compliant</span>
            <span className={styles.badge}>99.9% Uptime</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
