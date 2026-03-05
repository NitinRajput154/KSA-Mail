"use client";

import { Bell, Search, User } from 'lucide-react';
import styles from '@/app/admin/admin.module.css';

export default function Navbar() {
    return (
        <header className={styles.navbar}>
            <div className={styles.searchBar}>
                <Search className={styles.searchIcon} size={18} />
                <input
                    className={styles.searchInput}
                    placeholder="Search domains, mailboxes, or logs..."
                    type="search"
                />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <button style={{ color: '#9ca3af', position: 'relative' }}>
                    <Bell size={24} />
                    <span style={{
                        position: 'absolute',
                        top: '0',
                        right: '0',
                        height: '10px',
                        width: '10px',
                        backgroundColor: '#ef4444',
                        borderRadius: '100%',
                        border: '2px solid white'
                    }}></span>
                </button>
                <div style={{ height: '32px', width: '1px', backgroundColor: '#e5e7eb' }}></div>
                <button style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        height: '32px',
                        width: '32px',
                        borderRadius: '100%',
                        backgroundColor: '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#6b7280'
                    }}>
                        <User size={20} />
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>Admin</span>
                </button>
            </div>
        </header>
    );
}
