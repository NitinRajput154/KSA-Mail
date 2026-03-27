"use client";

import { useEffect, useState } from 'react';
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

const API_BASE = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_API_URL : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000');

export default function SystemStatusPage() {
    const [health, setHealth] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState(new Date().toLocaleTimeString());

    const getAuthHeaders = (): Record<string, string> => {
        const tokenMatch = document.cookie.match(/(?:^|; )access_token=([^;]*)/);
        return tokenMatch ? { 'Authorization': `Bearer ${tokenMatch[1]}` } : {};
    };

    const fetchHealth = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/admin/stats/health`, {
                headers: { ...getAuthHeaders() },
                credentials: 'true' === 'true' ? 'include' : 'same-origin'
            });
            if (res.ok) {
                setHealth(await res.json());
                setLastRefresh(new Date().toLocaleTimeString());
            }
        } catch (err) {
            console.error("Failed to load health data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHealth();
    }, []);

    const getServiceStatus = (containerName: string) => {
        if (!health?.containers || !health.containers[containerName]) return 'Offline';
        return health.containers[containerName].state === 'running' ? 'Healthy' : 'Offline';
    };

    const host = health?.host || {};
    const disk = health?.disk || {};
    const containers = health?.containers || {};

    // Processing CPU
    const cpuUsage = host.cpu?.usage || 0;

    // Processing RAM
    const ramTotalGB = host.memory?.total ? (host.memory.total / 1073741824) : 0;
    const ramUsagePercent = host.memory?.usage || 0;
    const ramUsedGB = ramTotalGB * (ramUsagePercent / 100);

    // Processing Disk
    const diskUsedStr = disk.used || '0G';
    const diskTotalStr = disk.total || '0G';
    const diskPercent = disk.used_percent ? parseInt(disk.used_percent.replace('%', '')) : 0;

    // Processing Uptime
    const formatUptime = (seconds: number) => {
        if (!seconds) return '---';
        const days = Math.floor(seconds / (3600 * 24));
        const hours = Math.floor(seconds % (3600 * 24) / 3600);
        return `${days}d ${hours}h`;
    };

    return (
        <div style={{ animation: 'fade-in 0.5s ease-out' }}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>System Status</h1>
                    <p className={styles.pageSubtitle}>Monitor server performance and service health in real-time. (Last sync: {lastRefresh})</p>
                </div>
                <button 
                    onClick={fetchHealth}
                    className={`${styles.primaryButton} ${styles.badgeSuccess}`} 
                    style={{ backgroundColor: 'white', color: '#16a34a', border: '1px solid #dcfce7' }}>
                    <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                    {loading ? "Refreshing..." : "Refresh Stats"}
                </button>
            </div>

            <div className={styles.statGrid}>
                <ResourceCard 
                    title="CPU Usage" 
                    value={loading ? '...' : `${cpuUsage}%`} 
                    icon={Cpu} 
                    progress={cpuUsage} 
                    trend={cpuUsage > 80 ? "HIGH" : "STABLE"} 
                />
                <ResourceCard 
                    title="RAM Usage" 
                    value={loading ? '...' : `${ramUsedGB.toFixed(1)} GB / ${ramTotalGB.toFixed(1)} GB`} 
                    icon={Database} 
                    progress={ramUsagePercent} 
                    trend={ramUsagePercent > 80 ? "HIGH" : "NORMAL"} 
                />
                <ResourceCard 
                    title="Disk Space" 
                    value={loading ? '...' : `${diskUsedStr} / ${diskTotalStr}`} 
                    icon={HardDrive} 
                    progress={diskPercent} 
                    trend={diskPercent > 80 ? "WARNING" : "STABLE"} 
                />
                <ResourceCard 
                    title="Network Load" 
                    value={loading ? "..." : "--- Mbps"} 
                    icon={Network} 
                    progress={0} 
                    trend="UNKNOWN" 
                />
            </div>

            <div className={styles.dashboardRows}>
                <div className={styles.card}>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Activity size={20} style={{ color: '#16a34a' }} />
                        Service Health Monitor
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <ServiceRow name="Postfix (SMTP)" status={getServiceStatus('postfix-mailcow')} uptime={containers['postfix-mailcow']?.started_at ? 'Running' : 'Offline'} port="25, 465, 587" />
                        <ServiceRow name="Dovecot (IMAP/POP3)" status={getServiceStatus('dovecot-mailcow')} uptime={containers['dovecot-mailcow']?.started_at ? 'Running' : 'Offline'} port="143, 993" />
                        <ServiceRow name="Rspamd (Spam Filter)" status={getServiceStatus('rspamd-mailcow')} uptime={containers['rspamd-mailcow']?.started_at ? 'Running' : 'Offline'} port="11334" />
                        <ServiceRow name="ClamAV (Antivirus)" status={getServiceStatus('clamd-mailcow')} uptime={containers['clamd-mailcow']?.started_at ? 'Running' : 'Offline'} port="---" />
                        <ServiceRow name="Redis (Cache)" status={getServiceStatus('redis-mailcow')} uptime={containers['redis-mailcow']?.started_at ? 'Running' : 'Offline'} port="6379" />
                        <ServiceRow name="MariaDB (Database)" status={getServiceStatus('mysql-mailcow')} uptime={containers['mysql-mailcow']?.started_at ? 'Running' : 'Offline'} port="3306" />
                        <ServiceRow name="Nginx (Web Proxy)" status={getServiceStatus('nginx-mailcow')} uptime={containers['nginx-mailcow']?.started_at ? 'Running' : 'Offline'} port="80, 443" />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className={styles.card} style={{ backgroundColor: '#111827', color: 'white', border: 'none' }}>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '20px' }}>Uptime Statistics</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <UptimeStat label="System Uptime" value={loading ? '...' : formatUptime(host.uptime)} color="#10b981" />
                            <UptimeStat label="Platform" value={loading ? '...' : (host.architecture || '---')} color="#10b981" />
                            <UptimeStat label="CPU Cores" value={loading ? '...' : (host.cpu?.cores || '---')} color="#10b981" />
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>Server Information</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <ServerInfoRow label="Timezone" value={loading ? '...' : (host.system_time || '---')} />
                            <ServerInfoRow label="Mailcow" value="Integrated" />
                            <ServerInfoRow label="Last API Refresh" style={{ marginTop: '8px' }} value={lastRefresh} />
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
