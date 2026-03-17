"use client";

import { useState, useEffect } from 'react';
import {
    Mail,
    Users,
    Database,
    Clock,
    Activity
} from 'lucide-react';
import StatCard from '@/components/admin/StatCard';
import AdminTable from '@/components/admin/AdminTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { mockLogs } from '@/lib/mockData';
import styles from './admin.module.css';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function Dashboard() {
    const [stats, setStats] = useState<any>(null);
    const [health, setHealth] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const tokenMatch = document.cookie.match(/(?:^|; )access_token=([^;]*)/);
            const token = tokenMatch ? tokenMatch[1] : '';
            const headers = { 'Authorization': `Bearer ${token}` };

            try {
                // Fetch Overview Stats
                const statsRes = await fetch(`${API_BASE}/admin/stats/overview`, {
                    headers,
                    credentials: 'true' === 'true' ? 'include' : 'same-origin'
                });
                if (statsRes.ok) {
                    setStats(await statsRes.json());
                }

                // Fetch Health
                const healthRes = await fetch(`${API_BASE}/admin/stats/health`, {
                    headers,
                    credentials: 'true' === 'true' ? 'include' : 'same-origin'
                });
                if (healthRes.ok) {
                    setHealth(await healthRes.json());
                }
            } catch (err) {
                console.error("Failed to load dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Helper functions for parsing
    const formatBytes = (bytes: number) => {
        if (!bytes) return "0.00 GB";
        return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB"; // converting bytes to GB
    };

    const getServicesList = () => {
        if (!health || !health.containers) return [
            { label: 'SMTP Server', status: 'Offline', color: '#ef4444' },
            { label: 'IMAP Server', status: 'Offline', color: '#ef4444' },
            { label: 'Spam Assassin', status: 'Offline', color: '#ef4444' },
            { label: 'Redis Cache', status: 'Offline', color: '#ef4444' },
        ];

        const containers = health.containers;

        return [
            { 
               label: 'Postfix SMTP', 
               status: containers['postfix-mailcow']?.state === 'running' ? 'Online' : 'Warning', 
               color: containers['postfix-mailcow']?.state === 'running' ? '#10b981' : '#f59e0b' 
            },
            { 
               label: 'Dovecot IMAP', 
               status: containers['dovecot-mailcow']?.state === 'running' ? 'Online' : 'Warning', 
               color: containers['dovecot-mailcow']?.state === 'running' ? '#10b981' : '#f59e0b' 
            },
            { 
               label: 'Rspamd filter', 
               status: containers['rspamd-mailcow']?.state === 'running' ? 'Online' : 'Warning', 
               color: containers['rspamd-mailcow']?.state === 'running' ? '#10b981' : '#f59e0b' 
            },
            { 
               label: 'ClamAV', 
               status: containers['clamd-mailcow']?.state === 'running' ? 'Online' : 'Offline', 
               color: containers['clamd-mailcow']?.state === 'running' ? '#10b981' : '#ef4444' 
            },
            { 
               label: 'Redis Cache', 
               status: containers['redis-mailcow']?.state === 'running' ? 'Online' : 'Warning', 
               color: containers['redis-mailcow']?.state === 'running' ? '#10b981' : '#f59e0b' 
            },
        ];
    };

    const trafficData = stats?.mailTraffic || [
        { day: 'Mon', sent: 0, received: 0 },
        { day: 'Tue', sent: 0, received: 0 },
        { day: 'Wed', sent: 0, received: 0 },
        { day: 'Thu', sent: 0, received: 0 },
        { day: 'Fri', sent: 0, received: 0 },
        { day: 'Sat', sent: 0, received: 0 },
        { day: 'Sun', sent: 0, received: 0 },
    ];

    let maxTraffic = 100; // minimum scale
    trafficData.forEach((d: any) => {
        if (d.sent > maxTraffic) maxTraffic = d.sent;
        if (d.received > maxTraffic) maxTraffic = d.received;
    });
    // Add 10% padding to top
    maxTraffic = maxTraffic * 1.1;

    return (
        <div style={{ animation: 'fade-in 0.5s ease-out' }}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Dashboard</h1>
                    <p className={styles.pageSubtitle}>Overview of your mail server ecosystem.</p>
                </div>
            </div>

            <div className={styles.statGrid}>
                <StatCard
                    title="Total Mailboxes"
                    value={loading ? "..." : (stats?.totalMailboxes || 0)}
                    icon={Mail}
                />
                <StatCard
                    title="Active Admin Users"
                    value={loading ? "..." : (stats?.activeUsers || 0)}
                    icon={Users}
                />
                <StatCard
                    title="Server Storage"
                    value={loading ? "..." : formatBytes(stats?.storageLimitBytes)}
                    icon={Database}
                    progress={stats?.storageLimitBytes > 0 ? Math.round((stats.storageUsedBytes / stats.storageLimitBytes) * 100) : 0}
                    description={`Current use: ${formatBytes(stats?.storageUsedBytes || 0)}`}
                />
            </div>

            <div className={styles.dashboardRows}>
                <div className={`${styles.card} ${styles.trafficChart}`}>
                    <div className={styles.chartHeader}>
                        <h2 style={{ fontWeight: 700, color: '#111827' }}>Mail Traffic (Weekly)</h2>
                        <select style={{ fontSize: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '4px 8px' }}>
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                        </select>
                    </div>

                    <div className={styles.chartBarsWrapper}>
                        {loading ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', color: '#9ca3af' }}>Loading Traffic Data...</div>
                        ) : trafficData.map((data: any, i: number) => (
                            <div key={i} className={styles.chartDay}>
                                <div className={styles.barGroup}>
                                    <div
                                        className={styles.barSent}
                                        style={{ height: `${(data.sent / maxTraffic) * 100}%`, backgroundColor: '#16a34a' }}
                                        title={`Sent: ${data.sent}`}
                                    ></div>
                                    <div
                                        className={styles.barRecv}
                                        style={{ height: `${(data.received / maxTraffic) * 100}%`, backgroundColor: '#60a5fa' }}
                                        title={`Received: ${data.received}`}
                                    ></div>
                                </div>
                                <span className={styles.dayLabel}>{data.day}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '12px', height: '12px', backgroundColor: '#16a34a', borderRadius: '2px' }}></div>
                            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Sent</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '12px', height: '12px', backgroundColor: '#60a5fa', borderRadius: '2px' }}></div>
                            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Received</span>
                        </div>
                    </div>
                </div>

                <div className={styles.card} style={{ minHeight: '380px' }}>
                    <h2 style={{ fontWeight: 700, color: '#111827', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px'}}> System Health</span>
                        {loading ? <Activity size={16} className="animate-spin" /> : <span style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '100%' }}></span>}
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {getServicesList().map((service) => (
                            <div key={service.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #f9fafb' }}>
                                <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>{service.label}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ width: '8px', height: '8px', backgroundColor: service.color, borderRadius: '100%' }}></span>
                                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>{service.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button style={{ width: '100%', marginTop: '24px', padding: '10px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280' }}>
                        VIEW DETAILED STATUS
                    </button>
                </div>
            </div>

            <div style={{ marginTop: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827' }}>Recent Activity</h2>
                    <button style={{ fontSize: '0.875rem', fontWeight: 600, color: '#16a34a' }}>View All</button>
                </div>
                <AdminTable headers={['Type', 'User', 'IP Address', 'Timestamp', 'Status']}>
                    {stats?.activityLogs ? stats.activityLogs.map((log: any) => (
                        <tr key={log.id}>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ padding: '6px', borderRadius: '100%', backgroundColor: log.type === 'ADMIN' ? '#f5f3ff' : '#eff6ff', color: log.type === 'ADMIN' ? '#7c3aed' : '#2563eb' }}>
                                        <Clock size={16} />
                                    </div>
                                    <span style={{ fontWeight: 600, color: '#111827' }}>{log.type}</span>
                                </div>
                            </td>
                            <td>{log.user}</td>
                            <td style={{ fontFamily: 'monospace', color: '#6b7280' }}>{log.ip}</td>
                            <td style={{ color: '#6b7280' }}>{log.time}</td>
                            <td>
                                <StatusBadge status={log.status} />
                            </td>
                        </tr>
                    )) : <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>Loading or no activity found...</td></tr>}
                </AdminTable>
            </div>
        </div>
    );
}
