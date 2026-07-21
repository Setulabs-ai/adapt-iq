'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BrainCircuit } from 'lucide-react';
import styles from './login.module.css';
import styles from './login.module.css';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const shop = formData.get('shop') as string;
    
    if (!shop) {
      setError("Please enter your store domain");
      setLoading(false);
      return;
    }

    let cleanShop = shop.replace('https://', '').replace('http://', '').trim();
    if (!cleanShop.endsWith('.myshopify.com')) {
      cleanShop += '.myshopify.com';
    }

    window.location.href = `/api/auth/shopify/install?shop=${cleanShop}`;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <BrainCircuit size={32} color="#fff" />
          <h1>AdaptIQ</h1>
        </div>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="shop">Shopify Store Domain</label>
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '6px', overflow: 'hidden' }}>
              <input 
                type="text" 
                id="shop" 
                name="shop" 
                placeholder="your-store-name"
                style={{ flex: 1, border: 'none', background: 'transparent', padding: '12px', color: '#fff', outline: 'none' }}
                required 
              />
              <span style={{ padding: '0 12px', color: '#9ca3af', fontSize: '0.875rem' }}>.myshopify.com</span>
            </div>
          </div>
          
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Redirecting to Shopify...' : 'Sign In with Shopify'}
          </button>

          {error && <p className={styles.error}>{error}</p>}
        </form>
      </div>
    </div>
  );
}
