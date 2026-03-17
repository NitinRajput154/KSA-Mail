"use client";

import { useState, useEffect } from 'react';
import {
    UserPlus,
    Shield,
    Trash2,
    MoreHorizontal
} from 'lucide-react';
import AdminTable from '@/components/admin/AdminTable';
import StatusBadge from '@/components/admin/StatusBadge';
import Modal from '@/components/admin/Modal';
import styles from '../admin.module.css';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function UsersPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [admins, setAdmins] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({ name: '', email: '', role: 'ADMIN' });

    const getAuthHeaders = (): Record<string, string> => {
        const tokenMatch = document.cookie.match(/(?:^|; )access_token=([^;]*)/);
        return tokenMatch ? { 'Authorization': `Bearer ${tokenMatch[1]}` } : {};
    };

    const fetchAdmins = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/admin/users`, {
                headers: { ...getAuthHeaders() },
                credentials: 'true' === 'true' ? 'include' : 'same-origin'
            });
            if (res.ok) {
                setAdmins(await res.json());
            }
        } catch (error) {
            console.error('Failed to fetch admins:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const handleCreate = async (e: any) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE}/admin/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                credentials: 'true' === 'true' ? 'include' : 'same-origin',
                body: JSON.stringify(form)
            });
            if (res.ok) {
                alert('Administrator created successfully. A temporary password was set.');
                setIsModalOpen(false);
                setForm({ name: '', email: '', role: 'ADMIN' });
                fetchAdmins();
            } else {
                alert('Failed to create administrator');
            }
        } catch (error) {
            console.error('Failed to create admin:', error);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to remove administrator ${name}?`)) return;
        try {
            const res = await fetch(`${API_BASE}/admin/users/${id}`, {
                method: 'DELETE',
                headers: { ...getAuthHeaders() },
                credentials: 'true' === 'true' ? 'include' : 'same-origin'
            });
            if (res.ok) {
                fetchAdmins();
            }
        } catch (error) {
            console.error('Failed to delete admin:', error);
        }
    };

    return (
        <div style={{ animation: 'fade-in 0.5s ease-out' }}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>User Management</h1>
                    <p className={styles.pageSubtitle}>Manage administrative staff and their system permissions.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className={styles.primaryButton}
                >
                    <UserPlus size={18} />
                    Add Administrator
                </button>
            </div>

            <div className={styles.statGrid}>
                <div className={styles.card} style={{ borderLeft: '4px solid #16a34a' }}>
                    <p className={styles.statLabel}>Total Staff</p>
                    <h3 className={styles.statValue}>{loading ? '...' : admins.length}</h3>
                </div>
                <div className={styles.card} style={{ borderLeft: '4px solid #2563eb' }}>
                    <p className={styles.statLabel}>Active Now</p>
                    <h3 className={styles.statValue}>{loading ? '...' : admins.filter(a => a.status === 'Active').length}</h3>
                </div>
                <div className={styles.card} style={{ borderLeft: '4px solid #7c3aed' }}>
                    <p className={styles.statLabel}>Roles Defined</p>
                    <h3 className={styles.statValue}>2</h3>
                </div>
            </div>

            <div style={{ marginTop: '24px' }}>
                <AdminTable headers={['Administrator', 'Role', 'Permissions', 'Last Activity', 'Status', 'Actions']}>
                    {admins.map((admin) => (
                        <tr key={admin.id}>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div className={styles.userAvatar}>
                                        {admin.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>{admin.name}</span>
                                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{admin.email}</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span style={{
                                    fontSize: '0.625rem',
                                    fontWeight: 700,
                                    padding: '2px 8px',
                                    borderRadius: '100px',
                                    textTransform: 'uppercase',
                                    backgroundColor: admin.role === 'SUPERADMIN' ? '#f5f3ff' : '#eff6ff',
                                    color: admin.role === 'SUPERADMIN' ? '#7c3aed' : '#2563eb',
                                    border: '1px solid currentColor',
                                    opacity: 0.8
                                }}>
                                    {admin.role}
                                </span>
                            </td>
                            <td style={{ fontSize: '0.75rem', color: '#6b7280', fontStyle: 'italic' }}>
                                {admin.role === 'SUPERADMIN' ? 'Full Access' : 'Domains, Mailboxes'}
                            </td>
                            <td style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af' }}>
                                {admin.lastSeen ? new Date(admin.lastSeen).toLocaleDateString() : 'N/A'}
                            </td>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ height: '8px', width: '8px', borderRadius: '100%', backgroundColor: admin.status === 'Active' ? '#10b981' : '#d1d5db' }}></span>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#4b5563' }}>{admin.status}</span>
                                </div>
                            </td>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <button style={{ color: '#9ca3af', padding: '6px', cursor: 'pointer', border: 'none', background: 'none' }}><Shield size={16} /></button>
                                    <button onClick={() => handleDelete(admin.id, admin.name)} style={{ color: '#ef4444', padding: '6px', cursor: 'pointer', border: 'none', background: 'none' }}><Trash2 size={16} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </AdminTable>
                {admins.length === 0 && !loading && (
                    <div style={{ textAlign: 'center', padding: '24px', color: '#6b7280', fontSize: '0.875rem' }}>No administrators found.</div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add System Administrator"
            >
                <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={handleCreate}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Full Name</label>
                        <input
                            required
                            type="text"
                            placeholder="e.g. Abdullah bin Fahd"
                            value={form.name}
                            onChange={(e) => setForm({...form, name: e.target.value})}
                            style={{ padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', outline: 'none', fontWeight: 500 }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Admin Email Address</label>
                        <input
                            required
                            type="email"
                            placeholder="e.g. abdullah@ksamail.sa"
                            value={form.email}
                            onChange={(e) => setForm({...form, email: e.target.value})}
                            style={{ padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', outline: 'none', fontWeight: 500 }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Administrative Role</label>
                        <select 
                            value={form.role}
                            onChange={(e) => setForm({...form, role: e.target.value})}
                            style={{ padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', outline: 'none', backgroundColor: '#f9fafb', fontWeight: 500 }}
                        >
                            <option value="SUPERADMIN">Superadmin (Full Access)</option>
                            <option value="ADMIN">Admin (Domains & Mailboxes)</option>
                        </select>
                    </div>
                    <div style={{ padding: '12px', backgroundColor: '#fffbeb', borderRadius: '12px', border: '1px solid #fef3c7', display: 'flex', gap: '12px' }}>
                        <Shield style={{ color: '#d97706', flexShrink: 0 }} size={20} />
                        <p style={{ fontSize: '0.75rem', color: '#92400e', lineHeight: 1.5 }}>
                            This user will be created. A temporary password "TempPassword123!" will be assigned to them.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', paddingTop: '16px' }}>
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            style={{ flex: 1, padding: '12px', border: '1px solid #e5e7eb', borderRadius: '12px', fontWeight: 700, color: '#4b5563', backgroundColor: '#ffffff', cursor: 'pointer' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles.primaryButton}
                            style={{ flex: 1, justifyContent: 'center' }}
                        >
                            Invite Administrator
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
