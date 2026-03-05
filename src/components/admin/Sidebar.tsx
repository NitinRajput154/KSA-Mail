"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Globe,
    Mail,
    Users,
    ShieldCheck,
    Activity,
    FileText,
    Settings
} from 'lucide-react';
import Image from 'next/image';
import styles from '@/app/admin/admin.module.css';

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Domains', href: '/admin/domains', icon: Globe },
    { name: 'Mailboxes', href: '/admin/mailboxes', icon: Mail },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Security', href: '/admin/security', icon: ShieldCheck },
    { name: 'System Status', href: '/admin/status', icon: Activity },
    { name: 'Logs', href: '/admin/logs', icon: FileText },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logoArea}>
                <Image src="/logo.png" alt="Logo" width={32} height={32} />
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
                </div>
            </div>
        </aside>
    );
}
