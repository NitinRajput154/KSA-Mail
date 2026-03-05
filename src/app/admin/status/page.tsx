"use client";

import {
    Activity,
    Cpu,
    Database,
    HardDrive,
    RefreshCw,
    CheckCircle2,
    AlertCircle,
    Network
} from 'lucide-react';
import styles from '../admin.module.css';

export default function SystemStatusPage() {
    return (
        <div style={{ animation: 'fade-in 0.5s ease-out' }}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>System Status</h1>
                    <p className={styles.pageSubtitle}>Monitor server performance and service health in real-time.</p>
                </div>
                <button className={`${styles.primaryButton} ${styles.badgeSuccess}`} style={{ backgroundColor: 'white', color: '#16a34a', border: '1px solid #dcfce7' }}>
                    <RefreshCw size={18} />
                    Refresh Stats
                </button>
            </div>

            <div className={styles.statGrid}>
                <ResourceCard title="CPU Usage" value="12%" icon={Cpu} progress={12} trend="Stable" />
                <ResourceCard title="RAM Usage" value="4.2 GB / 8 GB" icon={Database} progress={52} trend="Increasing" />
                <ResourceCard title="Disk Space" value="1.2 TB / 2.0 TB" icon={HardDrive} progress={60} trend="Stable" />
                <ResourceCard title="Network Load" value="45 Mbps" icon={Network} progress={30} trend="Normal" />
            </div>

            <div className={styles.dashboardRows}>
                <div className={styles.card}>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Activity size={20} style={{ color: '#16a34a' }} />
                        Service Health Monitor
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <ServiceRow name="Postfix (SMTP)" status="Healthy" uptime="14d 2h 45m" port="25, 465, 587" />
                        <ServiceRow name="Dovecot (IMAP/POP3)" status="Healthy" uptime="14d 2h 45m" port="143, 993" />
                        <ServiceRow name="Rspamd (Spam Filter)" status="Healthy" uptime="14d 2h 45m" port="11334" />
                        <ServiceRow name="ClamAV (Antivirus)" status="Updating" uptime="2h 12m" port="---" />
                        <ServiceRow name="Redis (Cache)" status="Healthy" uptime="45d 10h 12m" port="6379" />
                        <ServiceRow name="MariaDB (Database)" status="Healthy" uptime="45d 10h 12m" port="3306" />
                        <ServiceRow name="Nginx (Web Proxy)" status="Healthy" uptime="14d 2h 45m" port="80, 443" />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className={styles.card} style={{ backgroundColor: '#111827', color: 'white', border: 'none' }}>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '20px' }}>Uptime Statistics</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <UptimeStat label="Last 24 Hours" value="99.99%" color="#10b981" />
                            <UptimeStat label="Last 7 Days" value="99.95%" color="#10b981" />
                            <UptimeStat label="Last 30 Days" value="99.92%" color="#10b981" />
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>Server Information</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <ServerInfoRow label="Hostname" value="mx1.ksamail.sa" />
                            <ServerInfoRow label="IP Address" value="94.12.44.182" />
                            <ServerInfoRow label="OS Version" value="Ubuntu 22.04 LTS" />
                            <ServerInfoRow label="Mailcow" value="v2024.02" />
                            <ServerInfoRow label="Last Reboot" style={{ marginTop: '8px' }} value="Feb 15, 2026" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ResourceCard({ title, value, icon: Icon, progress, trend }: any) {
    return (
        <div className={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div className={styles.statCardIcon} style={{ marginBottom: 0 }}>
                    <Icon size={20} />
                </div>
                <span style={{ fontSize: '0.625rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>{trend}</span>
            </div>
            <p className={styles.statLabel}>{title}</p>
            <h3 className={styles.statValue}>{value}</h3>
            <div className={styles.progressContainer}>
                <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{
                        width: `${progress}%`,
                        backgroundColor: progress > 80 ? '#ef4444' : progress > 60 ? '#f59e0b' : '#16a34a'
                    }}></div>
                </div>
            </div>
        </div>
    );
}

function ServiceRow({ name, status, uptime, port }: any) {
    const isHealthy = status === 'Healthy';
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #f9fafb' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>{name}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isHealthy ? <CheckCircle2 size={14} style={{ color: '#10b981' }} /> : <RefreshCw size={14} style={{ color: '#f59e0b' }} />}
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isHealthy ? '#16a34a' : '#b45309' }}>{status}</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{uptime}</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#9ca3af', fontFamily: 'monospace' }}>{port}</span>
        </div>
    );
}

function UptimeStat({ label, value, color }: any) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{label}</span>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: color }}>{value}</span>
        </div>
    );
}

function ServerInfoRow({ label, value, style }: any) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', ...style }}>
            <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 500 }}>{label}</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#111827', fontFamily: 'monospace' }}>{value}</span>
        </div>
    );
}
