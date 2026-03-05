"use client";

import { useState } from 'react';
import {
    Mail,
    Plus,
    Search,
    Filter,
    Lock,
    Trash2,
    Ban,
    AtSign,
    HardDrive
} from 'lucide-react';
import AdminTable from '@/components/admin/AdminTable';
import StatusBadge from '@/components/admin/StatusBadge';
import Modal from '@/components/admin/Modal';
import { mockMailboxes } from '@/lib/mockData';
import styles from '../admin.module.css';

export default function MailboxesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div style={{ animation: 'fade-in 0.5s ease-out' }}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Mailbox Management</h1>
                    <p className={styles.pageSubtitle}>Configure individual user accounts and storage quotas.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className={styles.primaryButton}
                >
                    <Plus size={18} />
                    Create Mailbox
                </button>
            </div>

            <div className={styles.card} style={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'center', marginBottom: '24px', padding: '16px' }}>
                <div className={styles.searchBar} style={{ maxWidth: 'none', flex: 1 }}>
                    <Search className={styles.searchIcon} size={18} />
                    <input
                        type="text"
                        placeholder="Filter by email or domain..."
                        className={styles.searchInput}
                        style={{ backgroundColor: '#f9fafb', border: 'none' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 500, color: '#4b5563', backgroundColor: '#ffffff' }}>
                        <Filter size={16} />
                        Show Filter
                    </button>
                    <select style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 12px', fontSize: '0.875rem', backgroundColor: '#ffffff', color: '#4b5563', outline: 'none' }}>
                        <option>All Domains</option>
                        <option>google.com</option>
                        <option>apple.com</option>
                        <option>amazon.sa</option>
                    </select>
                </div>
            </div>

            <AdminTable headers={['Mailbox Account', 'Domain', 'Quota Info', 'Storage Used', 'Status', 'Last Access', 'Actions']}>
                {mockMailboxes.map((mailbox) => (
                    <tr key={mailbox.id}>
                        <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '36px', height: '36px', backgroundColor: '#f0fdf4', borderRadius: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
                                    <AtSign size={16} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827' }}>{mailbox.email.split('@')[0]}</span>
                                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{mailbox.email}</span>
                                </div>
                            </div>
                        </td>
                        <td>{mailbox.domain}</td>
                        <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 600, color: '#111827', backgroundColor: '#f9fafb', padding: '4px 8px', borderRadius: '4px', border: '1px solid #f3f4f6', width: 'fit-content' }}>
                                <HardDrive size={12} style={{ color: '#9ca3af' }} />
                                {mailbox.quota} Limit
                            </div>
                        </td>
                        <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '128px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '0.625rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Usage</span>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#111827' }}>{mailbox.used}</span>
                                </div>
                                <div className={styles.progressBar} style={{ height: '6px' }}>
                                    <div
                                        className={styles.progressFill}
                                        style={{
                                            width: `${(parseFloat(mailbox.used) / parseFloat(mailbox.quota)) * 100}%`,
                                            backgroundColor: mailbox.status === 'suspended' ? '#9ca3af' : '#22c55e'
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <StatusBadge status={mailbox.status} />
                        </td>
                        <td style={{ fontSize: '0.75rem', color: '#6b7280', fontStyle: 'italic' }}>
                            {mailbox.lastLogin}
                        </td>
                        <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <button title="Reset Password" style={{ padding: '8px', color: '#9ca3af' }}><Lock size={16} /></button>
                                <button title="Suspend" style={{ padding: '8px', color: '#9ca3af' }}><Ban size={16} /></button>
                                <button title="Delete" style={{ padding: '8px', color: '#9ca3af' }}><Trash2 size={16} /></button>
                            </div>
                        </td>
                    </tr>
                ))}
            </AdminTable>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Mailbox"
            >
                <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={(e) => e.preventDefault()}>
                    <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '12px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Username</label>
                            <input
                                type="text"
                                placeholder="e.g. info"
                                style={{ padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', outline: 'none', fontWeight: 500 }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', textAlign: 'center' }}>Domain</label>
                            <select style={{ padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', outline: 'none', backgroundColor: '#f9fafb', fontWeight: 500 }}>
                                <option>@google.com</option>
                                <option>@apple.com</option>
                                <option>@amazon.sa</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Primary Password</label>
                        <input
                            type="password"
                            placeholder="Minimum 12 characters"
                            style={{ padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', outline: 'none' }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Mailbox Quota (MB)</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="number"
                                defaultValue={1024}
                                style={{ flex: 1, padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', outline: 'none' }}
                            />
                            <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px', backgroundColor: '#f3f4f6', borderRadius: '8px', fontWeight: 700, color: '#6b7280', fontSize: '0.875rem' }}>MB</div>
                        </div>
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
                            style={{ flex: 1, justifyContent: 'center', padding: '12px', borderRadius: '12px' }}
                        >
                            Create Account
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
