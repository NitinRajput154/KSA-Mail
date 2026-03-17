"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Mail,
    Users,
    ShieldCheck,
    Activity,
    FileText,
    Settings,
    LogOut
} from 'lucide-react';
import Image from 'next/image';
import styles from '@/app/admin/admin.module.css';

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Mailboxes', href: '/admin/mailboxes', icon: Mail },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Security', href: '/admin/security', icon: ShieldCheck },
    { name: 'System Status', href: '/admin/status', icon: Activity },
    { name: 'Logs', href: '/admin/logs', icon: FileText },
];

export default function Sidebar() {
    const pathname = usePathname();

    const handleLogout = async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/auth/logout`, {
                method: 'POST',
                credentials: 'true' === 'true' ? 'include' : 'same-origin',
            });
        } catch (e) {
            console.error('Logout failed', e);
        }
        localStorage.removeItem('user');
        window.location.href = '/admin/login';
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logoArea}>
                <Image src="/green-logo.png" alt="Logo" width={100} height={32} style={{ width: 'auto', height: '32px' }} />
                <span className={styles.logoText}>KSA Mail</span>
            </div>
            <nav className={styles.navSection}>
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`${styles.navLink} ${isActive ? styles.activeNavLink : ''}`}
                        >
                            <item.icon className={styles.navLinkIcon} size={20} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
            <div className={styles.sidebarFooter}>
                <div className={styles.userProfile}>
                    <div className={styles.userAvatar}>AD</div>
                    <div className={styles.userInfo}>
                        <span className={styles.userName}>Admin User</span>
                        <span className={styles.userEmail}>superadmin@ksamail.sa</span>
                    </div>
                    <button 
                        onClick={handleLogout}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280', padding: '8px', marginLeft: 'auto' }}
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </aside>
    );
}
