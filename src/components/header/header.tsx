import styles from './header.module.scss';
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/AuthContext';

interface HeaderProps {
    selectedTab: string; 
}

export default function Header({ selectedTab }: HeaderProps) {
    const { Authlogout } = useAuth();

    const handleLogout = () => {
        Authlogout();
    };

    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                <div className={styles.logo}>
                </div>

                <div className={styles.navbar}>
                    <div className={styles.tab}>
                        <Link href="/home" className={selectedTab === 'Today' ? styles.selectedLink : styles.normalLink}>
                        Today
                        </Link>
                    </div>
                    <div className={styles.tab}>
                        <Link href="/goals" className={selectedTab === 'Goals' ? styles.selectedLink : styles.normalLink}>
                        Goals
                        </Link>
                    </div>
                    <div className={styles.tab}>
                        <Link href="/statistics" className={selectedTab === 'Statistics' ? styles.selectedLink : styles.normalLink}>
                        Statistics
                        </Link>
                    </div>
                </div>

                <div className={styles.setting}>
                    <button className={styles.logoutButton} onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
}
