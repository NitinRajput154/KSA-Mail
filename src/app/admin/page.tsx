import {
    Mail,
    Users,
    Database,
    Clock
} from 'lucide-react';
import StatCard from '@/components/admin/StatCard';
import AdminTable from '@/components/admin/AdminTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { mockStats, mockLogs } from '@/lib/mockData';
import styles from './admin.module.css';

export default function Dashboard() {
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
                    value={mockStats.totalMailboxes}
                    icon={Mail}
                    trend={{ value: '8%', positive: true }}
                />
                <StatCard
                    title="Active Users"
                    value={mockStats.activeUsers}
                    icon={Users}
                    trend={{ value: '2%', positive: false }}
                />
                <StatCard
                    title="Server Storage"
                    value="1.24 TB"
                    icon={Database}
                    progress={mockStats.storageUsed}
                    description="of 2.0 TB total capacity"
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
                        {mockStats.trafficData.map((data, i) => (
                            <div key={i} className={styles.chartDay}>
                                <div className={styles.barGroup}>
                                    <div
                                        className={styles.barSent}
                                        style={{ height: `${(data.sent / 1000) * 100}%` }}
                                        title={`Sent: ${data.sent}`}
                                    ></div>
                                    <div
                                        className={styles.barRecv}
                                        style={{ height: `${(data.received / 1000) * 100}%` }}
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

                <div className={styles.card}>
                    <h2 style={{ fontWeight: 700, color: '#111827', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        System Health
                        <span style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '100%' }}></span>
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[
                            { label: 'SMTP Server', status: 'Online', color: '#10b981' },
                            { label: 'IMAP Server', status: 'Online', color: '#10b981' },
                            { label: 'SpamAssassin', status: 'Online', color: '#10b981' },
                            { label: 'ClamAV', status: 'Updating', color: '#f59e0b' },
                            { label: 'Redis Cache', status: 'Online', color: '#10b981' },
                        ].map((service) => (
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
                    {mockLogs.map((log) => (
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
                    ))}
                </AdminTable>
            </div>
        </div>
    );
}
