"use client";

import { useState } from 'react';
import {
    Globe,
    Plus,
    Search,
    ExternalLink,
    Edit,
    Trash2,
    ShieldCheck,
    AlertCircle
} from 'lucide-react';
import AdminTable from '@/components/admin/AdminTable';
import StatusBadge from '@/components/admin/StatusBadge';
import Modal from '@/components/admin/Modal';
import { mockDomains } from '@/lib/mockData';
import styles from '../admin.module.css';

export default function DomainsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div style={{ animation: 'fade-in 0.5s ease-out' }}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Domain Management</h1>
                    <p className={styles.pageSubtitle}>Manage email domains and their DNS configurations.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className={styles.primaryButton}
                >
                    <Plus size={18} />
                    Add New Domain
                </button>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                <div className={styles.searchBar} style={{ maxWidth: 'none', flex: 1 }}>
                    <Search className={styles.searchIcon} size={18} />
                    <input
                        type="text"
                        placeholder="Search domains..."
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <select style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 12px', fontSize: '0.875rem', backgroundColor: '#ffffff', outline: 'none' }}>
                        <option>All Status</option>
                        <option>Active</option>
                        <option>Suspended</option>
                    </select>
                    <select style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 12px', fontSize: '0.875rem', backgroundColor: '#ffffff', outline: 'none' }}>
                        <option>DKIM Status</option>
                        <option>Valid</option>
                        <option>Invalid</option>
                    </select>
                </div>
            </div>

            <AdminTable headers={['Domain Name', 'Mailboxes', 'DKIM', 'SPF Status', 'Storage', 'Status', 'Actions']}>
                {mockDomains.map((domain) => (
                    <tr key={domain.id}>
                        <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ padding: '8px', backgroundColor: '#f3f4f6', borderRadius: '6px', color: '#6b7280' }}>
                                    <Globe size={16} />
                                </div>
                                <span style={{ fontWeight: 600, color: '#111827' }}>{domain.name}</span>
                            </div>
                        </td>
                        <td>{domain.mailboxes} Account(s)</td>
                        <td>
                            <StatusBadge status={domain.dkim} />
                        </td>
                        <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {domain.spf === 'valid' ? (
                                    <ShieldCheck size={16} style={{ color: '#10b981' }} />
                                ) : (
                                    <AlertCircle size={16} style={{ color: '#ef4444' }} />
                                )}
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: domain.spf === 'valid' ? '#15803d' : '#b91c1c' }}>
                                    {domain.spf === 'valid' ? 'Protected' : 'Missing Records'}
                                </span>
                            </div>
                        </td>
                        <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '96px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.625rem' }}>
                                    <span style={{ color: '#9ca3af' }}>Used</span>
                                    <span style={{ color: '#4b5563', fontWeight: 600 }}>{domain.usage}%</span>
                                </div>
                                <div className={styles.progressBar} style={{ height: '4px' }}>
                                    <div className={styles.progressFill} style={{ width: `${domain.usage}%`, backgroundColor: '#3b82f6' }}></div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <StatusBadge status={domain.status} />
                        </td>
                        <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <button title="Edit" style={{ padding: '6px', color: '#9ca3af' }}><Edit size={16} /></button>
                                <button title="Delete" style={{ padding: '6px', color: '#9ca3af' }}><Trash2 size={16} /></button>
                                <div style={{ width: '1px', height: '16px', backgroundColor: '#e5e7eb', margin: '0 4px' }}></div>
                                <button title="View Records" style={{ padding: '6px', color: '#9ca3af' }}><ExternalLink size={16} /></button>
                            </div>
                        </td>
                    </tr>
                ))}
            </AdminTable>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Domain"
            >
                <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={(e) => e.preventDefault()}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Domain Name</label>
                        <input
                            type="text"
                            placeholder="e.g. example.com"
                            style={{ padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', outline: 'none' }}
                        />
                        <p style={{ fontSize: '0.625rem', color: '#9ca3af', fontStyle: 'italic' }}>Do not include http:// or www.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Max Quota (GB)</label>
                            <input
                                type="number"
                                defaultValue={10}
                                style={{ padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', outline: 'none' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Max Mailboxes</label>
                            <input
                                type="number"
                                defaultValue={100}
                                style={{ padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', outline: 'none' }}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', padding: '16px', backgroundColor: '#eff6ff', borderRadius: '12px', border: '1px solid #dbeafe' }}>
                        <AlertCircle style={{ color: '#3b82f6', flexShrink: 0 }} size={18} />
                        <p style={{ fontSize: '0.75rem', color: '#1d4ed8', lineHeight: 1.5 }}>
                            After adding the domain, you will need to configure DNS records (MX, SPF, DKIM) to enable mail flow.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', paddingTop: '16px' }}>
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            style={{ flex: 1, padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontWeight: 600, color: '#4b5563', backgroundColor: '#ffffff' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles.primaryButton}
                            style={{ flex: 1, justifyContent: 'center' }}
                        >
                            Add Domain
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
