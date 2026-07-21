"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Users, MousePointerClick, DollarSign, RefreshCw } from "lucide-react";
import styles from "../dashboard.module.css";

export default function DashboardOverview() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats?storeId=store_123")
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch stats", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className={styles.loader}><RefreshCw className={styles.spin} size={32} color="#3b82f6" /></div>;
  }

  return (
    <div>
      <div className={styles.headerGroup}>
        <h2 className={styles.mainTitle}>Dashboard Overview</h2>
        <p className={styles.subtitle}>Here is what is happening with your AdaptIQ widget today.</p>
      </div>

      <div className={styles.statsGrid}>
        <StatCard title="Widget Views" value={stats?.views?.toLocaleString() || "0"} icon={<Users size={20} />} trend="+12.5%" />
        <StatCard title="Clicks Generated" value={stats?.clicks?.toLocaleString() || "0"} icon={<MousePointerClick size={20} />} trend="+5.2%" />
        <StatCard title="Click-Through Rate" value={stats?.ctr || "0%"} icon={<TrendingUp size={20} />} trend="+1.1%" />
        <StatCard title="Est. Revenue Lift" value={stats?.revenueLift || "$0"} icon={<DollarSign size={20} />} trend="+8.4%" highlight />
      </div>

      <div className={styles.activityCard}>
        <div className={styles.activityHeader}>
          <h3 className={styles.activityTitle}>Live Activity Feed</h3>
        </div>
        <div className={styles.activityList}>
          {stats?.recentEvents?.map((event: any, i: number) => (
            <div key={i} className={styles.activityItem}>
              <div className={styles.activityItemLeft}>
                <div className={`${styles.activityDot} ${event.event === 'recommendation_click' ? styles.dotGreen : styles.dotBlue}`}></div>
                <div>
                  <h4 className={styles.activityEventTitle}>
                    {event.event === 'recommendation_click' ? 'Customer clicked recommendation' : 'Widget viewed on product page'}
                  </h4>
                  <p className={styles.activityEventTarget}>{event.product}</p>
                </div>
              </div>
              <span className={styles.activityTime}>{event.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, highlight = false }: { title: string, value: string, icon: React.ReactNode, trend: string, highlight?: boolean }) {
  const cardClass = highlight ? `${styles.statCard} ${styles.statCardHighlight}` : styles.statCard;
  
  return (
    <div className={cardClass}>
      <div className={styles.statHeader}>
        <h3 className={styles.statTitle}>{title}</h3>
        <div className={styles.statIconBox}>
          {icon}
        </div>
      </div>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statTrendRow}>
        <span className={styles.statTrend}>{trend}</span>
        <span className={styles.statTrendLabel}>vs last week</span>
      </div>
    </div>
  );
}
