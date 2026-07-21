"use client";

import { LogOut } from "lucide-react";
import styles from "./dashboard.module.css";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <button className={styles.logoutBtn} onClick={handleLogout}>
      <LogOut className="w-5 h-5" />
      Sign Out
    </button>
  );
}
