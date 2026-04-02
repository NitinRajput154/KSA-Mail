"use client";

import { useState, useEffect } from 'react';
import { Mail, CheckCircle, Clock, XCircle, Trash2, Eye } from 'lucide-react';
import AdminTable from '@/components/admin/AdminTable';
import styles from '../admin.module.css';

const API_BASE = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_API_URL : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000');

export default function SupportPage() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [viewingTicket, setViewingTicket] = useState<any>(null);

    const getAuthHeaders = (): Record<string, string> => {
        const tokenMatch = document.cookie.match(/(?:^|; )access_token=([^;]*)/);
        let token = tokenMatch ? tokenMatch[1] : '';
        if (!token && typeof window !== 'undefined') {
            token = localStorage.getItem('access_token') || '';
        }
        const headers: Record<string, string> = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    };

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/support`, {
                headers: getAuthHeaders()
            });
            if (res.ok) {
                setTickets(await res.json());
            }
        } catch (err) {
            console.error("Failed to fetch support tickets", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(`${API_BASE}/support/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                // Update local state if modal is open
                if (viewingTicket && viewingTicket.id === id) {
                    setViewingTicket({ ...viewingTicket, status });
                }
                fetchTickets();
            }
        } catch (err) {
            console.error("Error updating ticket status", err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this ticket?")) return;
        try {
            const res = await fetch(`${API_BASE}/support/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (res.ok) {
                if (viewingTicket && viewingTicket.id === id) setModalOpen(false);
                fetchTickets();
            }
        } catch (err) {
            console.error("Error deleting ticket", err);
        }
    };

    const openModal = (ticket: any) => {
        setViewingTicket(ticket);
        setModalOpen(true);
    };

    const getStatusIcon = (status: string) => {
        switch(status) {
            case 'OPEN': return <Mail size={16} color="#3b82f6" />;
            case 'IN_PROGRESS': return <Clock size={16} color="#f59e0b" />;
            case 'RESOLVED': return <CheckCircle size={16} color="#10b981" />;
            case 'CLOSED': return <XCircle size={16} color="#6b7280" />;
            default: return <Mail size={16} />;
        }
    };

    return (
        <div style={{ animation: 'fade-in 0.5s ease-out' }}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Support Tickets</h1>
                    <p className={styles.pageSubtitle}>Manage and respond to user issues reported from webmail settings.</p>
                </div>
            </div>

            <AdminTable headers={['Date', 'Category', 'Subject', 'Email', 'Status', 'Actions']}>
                {loading ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>Loading tickets...</td></tr>
                ) : tickets.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>No support tickets found.</td></tr>
                ) : (
                    tickets.map((ticket) => (
                        <tr key={ticket.id}>
                            <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                            <td style={{ textTransform: 'capitalize' }}>{ticket.category}</td>
                            <td style={{ fontWeight: 600 }}>{ticket.subject}</td>
                            <td>{ticket.email || 'Anonymous'}</td>
                            <td>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', fontWeight: 500 }}>
                                    {getStatusIcon(ticket.status)}
                                    {ticket.status.replace('_', ' ')}
                                </span>
                            </td>
                            <td>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button 
                                        className={styles.actionBtn} 
                                        onClick={() => openModal(ticket)}
                                        title="View Ticket"
                                    >
                                        <Eye size={16} />
                                    </button>
                                    <button 
                                        className={styles.actionBtnDelete} 
                                        onClick={() => handleDelete(ticket.id)}
                                        title="Delete Ticket"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))
                )}
            </AdminTable>

            {modalOpen && viewingTicket && (
                <div style={{ 
                    position: 'fixed', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    backgroundColor: 'rgba(0,0,0,0.5)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    zIndex: 1000 
                }}>
                    <div style={{ 
                        backgroundColor: 'white', 
                        padding: '32px', 
                        borderRadius: '16px', 
                        width: '100%', 
                        maxWidth: '600px', 
                        maxHeight: '90vh', 
                        overflowY: 'auto',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                            <div>
                                <h2 style={{ fontWeight: 700, margin: '0 0 8px 0' }}>{viewingTicket.subject}</h2>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                                    Reported by: <strong>{viewingTicket.email || 'Anonymous'}</strong> • {new Date(viewingTicket.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <span style={{ 
                                display: 'inline-flex', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', 
                                fontWeight: 600, background: '#f3f4f6', color: '#374151', textTransform: 'uppercase'
                            }}>
                                {viewingTicket.category}
                            </span>
                        </div>

                        <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', minHeight: '120px', whiteSpace: 'pre-wrap', fontSize: '0.95rem', color: '#1e293b', marginBottom: '24px' }}>
                            {viewingTicket.message}
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Update Status</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((s) => (
                                    <button 
                                        key={s}
                                        onClick={() => updateStatus(viewingTicket.id, s)}
                                        style={{ 
                                            padding: '6px 12px', 
                                            borderRadius: '6px', 
                                            fontSize: '0.8rem', 
                                            fontWeight: 600,
                                            border: viewingTicket.status === s ? '2px solid var(--ksa-green)' : '1px solid #d1d5db',
                                            background: viewingTicket.status === s ? 'rgba(30,107,59,0.05)' : '#fff',
                                            color: viewingTicket.status === s ? 'var(--ksa-green)' : '#6b7280'
                                        }}
                                    >
                                        {s.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button 
                                type="button" 
                                style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #d1d5db', backgroundColor: 'white', fontWeight: 600 }}
                                onClick={() => setModalOpen(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
