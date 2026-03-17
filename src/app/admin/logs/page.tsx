"use client";

import { useState, useEffect } from 'react';
import {
    Search,
    Download,
    Trash2,
    Calendar,
    Terminal,
    Filter,
    RefreshCw
} from 'lucide-react';
import AdminTable from '@/components/admin/AdminTable';
import StatusBadge from '@/components/admin/StatusBadge';
import styles from '../admin.module.css';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function LogsPage() {
    const [filterType, setFilterType] = useState('All Types');
    const [searchTerm, setSearchTerm] = useState('');
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Simple pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const logsPerPage = 50;

    const getAuthHeaders = (): Record<string, string> => {
        const tokenMatch = document.cookie.match(/(?:^|; )access_token=([^;]*)/);
        return tokenMatch ? { 'Authorization': `Bearer ${tokenMatch[1]}` } : {};
    };

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/admin/logs`, {
                headers: { ...getAuthHeaders() },
                credentials: 'true' === 'true' ? 'include' : 'same-origin'
            });
            if (res.ok) {
                setLogs(await res.json());
            }
        } catch (error) {
            console.error('Failed to load logs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    // Filter logs based on search and type
    const filteredLogs = logs.filter(log => {
        const matchesType = filterType === 'All Types' || log.type === filterType;
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
            (log.ip && log.ip.toLowerCase().includes(searchLower)) ||
            (log.user && log.user.toLowerCase().includes(searchLower)) ||
            (log.action && log.action.toLowerCase().includes(searchLower));
            
        return matchesType && matchesSearch;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredLogs.length / logsPerPage) || 1;
    const currentLogs = filteredLogs.slice((currentPage - 1) * logsPerPage, currentPage * logsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    }
    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    }

    return (
        <div style={{ animation: 'fade-in 0.5s ease-out' }}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>System & Audit Logs</h1>
                    <p className={styles.pageSubtitle}>Monitor all server events, authentication attempts, and administrative actions.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={fetchLogs} style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '10px 16px', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                        Refresh Logs
                    </button>
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
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '8px', minWidth: 'fit-content' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #e5e7eb', padding: '8px 12px', borderRadius: '8px', backgroundColor: 'white', fontSize: '0.875rem', fontWeight: 500, color: '#4b5563' }}>
                        <Calendar size={16} style={{ color: '#9ca3af' }} />
                        <span>Live View</span>
                    </div>
                    <select
                        className={styles.searchInput}
                        style={{ padding: '8px 12px', width: 'auto', backgroundColor: 'white', border: '1px solid #e5e7eb' }}
                        value={filterType}
                        onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
                    >
                        <option>All Types</option>
                        <option>LOGIN</option>
                        <option>SMTP</option>
                        <option>IMAP</option>
                        <option>ADMIN</option>
                        <option>SYSTEM</option>
                    </select>
                </div>
            </div>

            <div className={styles.tableWrapper}>
                <div style={{ backgroundColor: '#f9fafb', padding: '12px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.625rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Terminal size={14} />
                        Live Output Streams
                    </span>
                    <span style={{ fontSize: '0.625rem', color: '#9ca3af', fontStyle: 'italic' }}>
                        {loading ? 'Crunching logs...' : `Showing ${currentLogs.length} of ${filteredLogs.length} entries`}
                    </span>
                </div>
                <AdminTable headers={['Log Level', 'Entity / User', 'IP Address', 'Action / Event', 'Timestamp', 'Status']}>
                    {loading ? (
                        <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>Syncing server telemetry...</td></tr>
                    ) : currentLogs.map((log) => (
                        <tr key={Math.random() + log.id}>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ height: '8px', width: '8px', borderRadius: '100%', backgroundColor: log.status === 'Success' || log.status === 'Info' ? '#10b981' : (log.status === 'Warning' ? '#f59e0b' : '#ef4444') }}></div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#111827', fontFamily: 'monospace' }}>{log.type}</span>
                                </div>
                            </td>
                            <td style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb' }}>
                                {log.user}
                            </td>
                            <td style={{ fontSize: '0.75rem', fontWeight: 500, color: '#6b7280', fontFamily: 'monospace' }}>
                                {log.ip}
                            </td>
                            <td style={{ fontSize: '0.75rem', color: '#4b5563', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={log.action}>
                                {log.action}
                            </td>
                            <td style={{ fontSize: '0.625rem', fontWeight: 600, color: '#9ca3af' }}>
                                {log.time}
                            </td>
                            <td>
                                <StatusBadge status={log.status} />
                            </td>
                        </tr>
                    ))}
                    {!loading && currentLogs.length === 0 && (
                         <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>No logs match the current filters.</td></tr>
                    )}
                </AdminTable>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px' }}>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Page {currentPage} of {totalPages}</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                    <button 
                         onClick={handlePrevPage}
                         disabled={currentPage === 1}
                         style={{ padding: '6px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, color: currentPage === 1 ? '#9ca3af' : '#4b5563', backgroundColor: 'white', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                    >Previous</button>
                    <button 
                         onClick={handleNextPage}
                         disabled={currentPage === totalPages}
                         style={{ padding: '6px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, color: currentPage === totalPages ? '#9ca3af' : '#4b5563', backgroundColor: 'white', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                    >Next</button>
                </div>
            </div>
        </div>
    );
}
