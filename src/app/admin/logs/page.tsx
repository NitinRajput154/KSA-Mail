"use client";

import { useState } from 'react';
import {
    Search,
    Download,
    Trash2,
    Calendar,
    Terminal,
    Filter
} from 'lucide-react';
import AdminTable from '@/components/admin/AdminTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { mockLogs } from '@/lib/mockData';
import styles from '../admin.module.css';

export default function LogsPage() {
    const [filterType, setFilterType] = useState('All');

    return (
        <div style={{ animation: 'fade-in 0.5s ease-out' }}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>System & Audit Logs</h1>
                    <p className={styles.pageSubtitle}>Monitor all server events, authentication attempts, and administrative actions.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '10px 16px', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Download size={16} />
                        Export CSV
                    </button>
                    <button style={{ backgroundColor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px', padding: '10px 16px', fontSize: '0.875rem', fontWeight: 600, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Trash2 size={16} />
                        Clear Logs
                    </button>
                </div>
            </div>

            <div className={styles.card} style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', marginBottom: '24px', padding: '16px' }}>
                <div className={styles.searchBar} style={{ maxWidth: 'none', flex: 1, minWidth: '300px' }}>
                    <Search className={styles.searchIcon} size={18} />
                    <input
                        type="text"
                        placeholder="Search logs by IP, User or Action..."
                        className={styles.searchInput}
                        style={{ backgroundColor: '#f9fafb', border: 'none' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '8px', minWidth: 'fit-content' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #e5e7eb', padding: '8px 12px', borderRadius: '8px', backgroundColor: 'white', fontSize: '0.875rem', fontWeight: 500, color: '#4b5563' }}>
                        <Calendar size={16} style={{ color: '#9ca3af' }} />
                        <span>Mar 1 - Mar 3, 2026</span>
                    </div>
                    <select
                        className={styles.searchInput}
                        style={{ padding: '8px 12px', width: 'auto', backgroundColor: 'white', border: '1px solid #e5e7eb' }}
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option>All Types</option>
                        <option>LOGIN</option>
                        <option>ADMIN</option>
                        <option>AUTH</option>
                        <option>SYSTEM</option>
                    </select>
                    <button style={{ display: 'flex', alignItems: 'center', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: 'white', color: '#4b5563' }}>
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            <div className={styles.tableWrapper}>
                <div style={{ backgroundColor: '#f9fafb', padding: '12px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.625rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Terminal size={14} />
                        Live Output Streams
                    </span>
                    <span style={{ fontSize: '0.625rem', color: '#9ca3af', fontStyle: 'italic' }}>Showing 150 of 12,402 entries</span>
                </div>
                <AdminTable headers={['Log Level', 'Entity / User', 'IP Address', 'Action / Event', 'Timestamp', 'Status']}>
                    {mockLogs.map((log) => (
                        <tr key={log.id}>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ height: '8px', width: '8px', borderRadius: '100%', backgroundColor: log.status === 'success' ? '#10b981' : '#ef4444' }}></div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#111827', fontFamily: 'monospace' }}>{log.type}</span>
                                </div>
                            </td>
                            <td style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb' }}>
                                {log.user}
                            </td>
                            <td style={{ fontSize: '0.75rem', fontWeight: 500, color: '#6b7280', fontFamily: 'monospace' }}>
                                {log.ip}
                            </td>
                            <td style={{ fontSize: '0.75rem', color: '#4b5563', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {log.action || (log.type === 'LOGIN' ? 'User successfully logged into webmail' : 'Authentication handshake initiated')}
                            </td>
                            <td style={{ fontSize: '0.625rem', fontWeight: 600, color: '#9ca3af' }}>
                                {log.time}
                            </td>
                            <td>
                                <StatusBadge status={log.status} />
                            </td>
                        </tr>
                    ))}
                </AdminTable>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px' }}>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Page 1 of 84</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                    <button style={{ padding: '6px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', backgroundColor: 'white', cursor: 'not-allowed' }}>Previous</button>
                    <button style={{ padding: '6px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', backgroundColor: 'white' }}>Next</button>
                </div>
            </div>
        </div>
    );
}
