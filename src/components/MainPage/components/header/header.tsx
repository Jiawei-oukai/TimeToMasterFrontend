import styles from './header.module.scss';
import React from 'react';
import { Link } from "react-router-dom";
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
                        <Link className={selectedTab === 'Today' ? styles.selectedLink : styles.normalLink} to="/home">
                            Today
                        </Link>
                    </div>
                    <div className={styles.tab}>
                        <Link className={selectedTab === 'Goals' ? styles.selectedLink : styles.normalLink} to="/goals">
                            Goals
                        </Link>
                    </div>
                    <div className={styles.tab}>
                        <Link className={selectedTab === 'Statistics' ? styles.selectedLink : styles.normalLink} to="/statistics">
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
