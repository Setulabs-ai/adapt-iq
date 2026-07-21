"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Users, MousePointerClick, DollarSign, RefreshCw } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import styles from "../dashboard.module.css";

export default function DashboardOverview() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
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
        <StatCard title="Widget Views" value={stats?.views?.toLocaleString() || "0"} icon={<Users size={20} />} trend={stats?.trends?.views || "+0%"} />
        <StatCard title="Clicks Generated" value={stats?.clicks?.toLocaleString() || "0"} icon={<MousePointerClick size={20} />} trend={stats?.trends?.clicks || "+0%"} />
        <StatCard title="Click-Through Rate" value={stats?.ctr || "0%"} icon={<TrendingUp size={20} />} trend={stats?.trends?.ctr || "+0%"} />
        <StatCard title="Est. Revenue Lift" value={stats?.revenueLift || "$0"} icon={<DollarSign size={20} />} trend={stats?.trends?.revenueLift || "+0%"} highlight />
      </div>

      {stats?.chartData && stats.chartData.length > 0 && (
        <div className={styles.activityCard} style={{ marginBottom: '2rem' }}>
          <div className={styles.activityHeader}>
            <h3 className={styles.activityTitle}>Widget Performance (7 Days)</h3>
          </div>
          <div style={{ width: '100%', height: '300px', padding: '1rem 0' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#f8fafc' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Area type="monotone" dataKey="views" name="Views" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                <Area type="monotone" dataKey="clicks" name="AI Clicks" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorClicks)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

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
        <span className={`${styles.statTrend} ${trend.startsWith('-') ? styles.trendNegative : ''}`} style={{ color: trend.startsWith('-') ? '#ef4444' : '#10b981' }}>{trend}</span>
        <span className={styles.statTrendLabel}>vs historical avg</span>
      </div>
    </div>
  );
}
