import Link from "next/link";
import { 
  LayoutDashboard, 
  Settings, 
  BarChart3, 
  Store,
  LogOut
} from "lucide-react";
import styles from "./dashboard.module.css";
import { getSessionStoreId } from "@/lib/auth";
import { LogoutButton } from "./LogoutButton";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const storeId = await getSessionStoreId();
  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            AdaptIQ
          </Link>
        </div>
        
        <div className={styles.sidebarContent}>
          <div className={styles.sectionTitle}>
            Store Select
          </div>
          <div className={styles.storeSelect}>
            <Store className="w-4 h-4" />
            Demo Shopify Store
          </div>
          
          <div className={styles.sectionTitle}>
            Menu
          </div>
          <nav className={styles.nav}>
            <Link href="/dashboard" className={styles.navLink}>
              <LayoutDashboard className={styles.navIcon} />
              Overview
            </Link>
            <Link href="/dashboard/analytics" className={styles.navLink}>
              <BarChart3 className={styles.navIcon} />
              Analytics
            </Link>
            <Link href="/dashboard/settings" className={styles.navLink}>
              <Settings className={styles.navIcon} />
              Widget Settings
            </Link>
          </nav>
        </div>
        
        <div className={styles.sidebarFooter}>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>Merchant Portal</h1>
          <div className={styles.headerActions}>
            <div className={styles.connectionStatus}>
              Connected: <span className={styles.storeBadge}>{storeId || 'Unknown'}</span>
            </div>
            <div className={styles.avatar}>
              AD
            </div>
          </div>
        </header>
        
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}
