"use client";

import { useState } from 'react';
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

const admins = [
    { id: '1', name: 'Super Admin', email: 'admin@ksamail.sa', role: 'Superadmin', perms: 'Full Access', lastSeen: 'Online Now' },
    { id: '2', name: 'Khalid Al-Saud', email: 'khalid@ksamail.sa', role: 'Admin', perms: 'Domains, Mailboxes', lastSeen: '2 hours ago' },
    { id: '3', name: 'Sarah Ahmed', email: 'sarah@ksamail.sa', role: 'Support', perms: 'Logs, Password Reset', lastSeen: 'Yesterday' },
];

export default function UsersPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

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
                    <h3 className={styles.statValue}>12</h3>
                </div>
                <div className={styles.card} style={{ borderLeft: '4px solid #2563eb' }}>
                    <p className={styles.statLabel}>Active Now</p>
                    <h3 className={styles.statValue}>4</h3>
                </div>
                <div className={styles.card} style={{ borderLeft: '4px solid #7c3aed' }}>
                    <p className={styles.statLabel}>Roles Defined</p>
                    <h3 className={styles.statValue}>3</h3>
                </div>
            </div>

            <div style={{ marginTop: '24px' }}>
                <AdminTable headers={['Administrator', 'Role', 'Permissions', 'Last Activity', 'Status', 'Actions']}>
                    {admins.map((admin) => (
                        <tr key={admin.id}>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div className={styles.userAvatar}>
                                        {admin.name.split(' ').map(n => n[0]).join('')}
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
                                    backgroundColor: admin.role === 'Superadmin' ? '#f5f3ff' : admin.role === 'Admin' ? '#eff6ff' : '#f9fafb',
                                    color: admin.role === 'Superadmin' ? '#7c3aed' : admin.role === 'Admin' ? '#2563eb' : '#4b5563',
                                    border: '1px solid currentColor',
                                    opacity: 0.8
                                }}>
                                    {admin.role}
                                </span>
                            </td>
                            <td style={{ fontSize: '0.75rem', color: '#6b7280', fontStyle: 'italic' }}>
                                {admin.perms}
                            </td>
                            <td style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af' }}>
                                {admin.lastSeen}
                            </td>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ height: '8px', width: '8px', borderRadius: '100%', backgroundColor: admin.lastSeen === 'Online Now' ? '#10b981' : '#d1d5db' }}></span>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#4b5563' }}>{admin.lastSeen === 'Online Now' ? 'Online' : 'Offline'}</span>
                                </div>
                            </td>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <button style={{ color: '#9ca3af', padding: '6px' }}><Shield size={16} /></button>
                                    <button style={{ color: '#9ca3af', padding: '6px' }}><Trash2 size={16} /></button>
                                    <button style={{ color: '#9ca3af', padding: '6px' }}><MoreHorizontal size={16} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </AdminTable>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add System Administrator"
            >
                <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={(e) => e.preventDefault()}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Full Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Abdullah bin Fahd"
                            style={{ padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', outline: 'none', fontWeight: 500 }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Admin Email Address</label>
                        <input
                            type="email"
                            placeholder="e.g. abdullah@ksamail.sa"
                            style={{ padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', outline: 'none', fontWeight: 500 }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Administrative Role</label>
                        <select style={{ padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', outline: 'none', backgroundColor: '#f9fafb', fontWeight: 500 }}>
                            <option>Select a role...</option>
                            <option>Superadmin (Full Access)</option>
                            <option>Admin (Domains & Mailboxes)</option>
                            <option>Support (Logs & User Support)</option>
                        </select>
                    </div>
                    <div style={{ padding: '12px', backgroundColor: '#fffbeb', borderRadius: '12px', border: '1px solid #fef3c7', display: 'flex', gap: '12px' }}>
                        <Shield style={{ color: '#d97706', flexShrink: 0 }} size={20} />
                        <p style={{ fontSize: '0.75rem', color: '#92400e', lineHeight: 1.5 }}>
                            This user will receive an email invitation to set up their password. They will be required to enable 2FA on their first login.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', paddingTop: '16px' }}>
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            style={{ flex: 1, padding: '12px', border: '1px solid #e5e7eb', borderRadius: '12px', fontWeight: 700, color: '#4b5563', backgroundColor: '#ffffff' }}
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
