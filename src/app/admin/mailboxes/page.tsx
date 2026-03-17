"use client";

import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
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
import styles from '../admin.module.css';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function MailboxesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDomain, setFilterDomain] = useState('All Domains');
    const [mailboxes, setMailboxes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        localPart: '',
        domain: '',
        password: '',
        quotaMB: 1024,
    });
    const [creating, setCreating] = useState(false);

    const getAuthHeaders = (): Record<string, string> => {
        const tokenMatch = document.cookie.match(/(?:^|; )access_token=([^;]*)/);
        return tokenMatch ? { 'Authorization': `Bearer ${tokenMatch[1]}` } : {};
    };

    const fetchMailboxes = async () => {
        try {
            const response = await fetch(`${API_BASE}/mailbox/all`, {
                headers: { ...getAuthHeaders() },
                credentials: 'true' === 'true' ? 'include' : 'same-origin'
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch mailboxes');
            }
            
            const data = await response.json();
            
            if (Array.isArray(data)) {
                setMailboxes(data);
            } else if (data && typeof data === 'object') {
                setMailboxes(Object.values(data));
            } else {
                setMailboxes([]);
            }
        } catch (error) {
            console.error("Error fetching mailboxes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMailboxes();
    }, []);

    const handleSuspendToggle = async (email: string, isActive: boolean) => {
        const action = isActive ? 'suspend' : 'activate';
        if (!confirm(`Are you sure you want to ${action} ${email}?`)) return;

        try {
            const response = await fetch(`${API_BASE}/mailbox/${email}/${action}`, {
                method: 'POST',
                headers: { ...getAuthHeaders() },
                credentials: 'true' === 'true' ? 'include' : 'same-origin'
            });

            if (!response.ok) throw new Error(`Failed to ${action} mailbox`);
            
            toast.success(`Mailbox successfully ${action}ed!`);
            setMailboxes(prev => prev.map(m => (m.username === email || m.email === email) ? { ...m, active: isActive ? 0 : 1 } : m));
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleDelete = async (email: string) => {
        if (!confirm(`Are you absolutely sure you want to permanently delete ${email}? This cannot be undone.`)) return;

        try {
            const response = await fetch(`${API_BASE}/mailbox/${email}`, {
                method: 'DELETE',
                headers: { ...getAuthHeaders() },
                credentials: 'true' === 'true' ? 'include' : 'same-origin'
            });

            if (!response.ok) throw new Error('Failed to delete mailbox');
            
            toast.success(`Mailbox ${email} physically deleted.`);
            setMailboxes(prev => prev.filter(m => m.username !== email && m.email !== email));
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleResetPassword = async (email: string) => {
        const newPassword = prompt(`Enter new password for ${email} (minimum 8 chars):`);
        if (!newPassword || newPassword.length < 8) {
            if (newPassword !== null) toast.error("Password must be at least 8 characters.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/mailbox/${email}/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                credentials: 'true' === 'true' ? 'include' : 'same-origin',
                body: JSON.stringify({ password: newPassword }),
            });

            if (!response.ok) throw new Error('Failed to reset password');
            
            toast.success(`Security key for ${email} has been updated successfully.`);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleCreateMailbox = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.localPart || !formData.domain || !formData.password) {
            toast.error("Please fill in all required fields.");
            return;
        }

        if (formData.password.length < 8) {
            toast.error("Password must be at least 8 characters long.");
            return;
        }

        setCreating(true);
        try {
            const response = await fetch(`${API_BASE}/mailbox/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                credentials: 'true' === 'true' ? 'include' : 'same-origin',
                body: JSON.stringify({
                    localPart: formData.localPart.toLowerCase().trim(),
                    domain: formData.domain.toLowerCase().trim(),
                    password: formData.password,
                    quotaMB: Number(formData.quotaMB),
                    fullName: formData.localPart.trim()
                }),
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => null);
                throw new Error(errData?.message || 'Failed to create mailbox.');
            }

            toast.success(`Mailbox ${formData.localPart}@${formData.domain} created successfully!`);
            setIsModalOpen(false);
            setFormData({ localPart: '', domain: domains[0] || '', password: '', quotaMB: 1024 });
            fetchMailboxes(); // Refresh list to get real object
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setCreating(false);
        }
    };

    // Extract unique domains dynamically for filtering and dropdowns
    const domains = useMemo(() => {
        const uniqueDomains = new Set<string>();
        mailboxes.forEach(m => {
            if (m.domain) uniqueDomains.add(m.domain);
            else if (m.email) uniqueDomains.add(m.email.split('@')[1]);
            else if (m.username) uniqueDomains.add(m.username.split('@')[1]);
        });
        return Array.from(uniqueDomains).sort();
    }, [mailboxes]);

    // Ensure form has a default domain if list populates later
    useEffect(() => {
        if (domains.length > 0 && !formData.domain) {
            setFormData(prev => ({ ...prev, domain: domains[0] }));
        }
    }, [domains]);

    const filteredMailboxes = useMemo(() => {
        return mailboxes.filter(m => {
            const email = (m.username || m.email || '').toLowerCase();
            const d = (m.domain || email.split('@')[1] || '').toLowerCase();
            
            // Domain filter match
            const matchesDomain = filterDomain === 'All Domains' ? true : d === filterDomain.toLowerCase();
            
            // Text filter match
            const matchesSearch = email.includes(searchTerm.toLowerCase());
            
            return matchesDomain && matchesSearch;
        });
    }, [mailboxes, searchTerm, filterDomain]);

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
                        placeholder="Search by email..."
                        className={styles.searchInput}
                        style={{ backgroundColor: '#f9fafb', border: 'none' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 500, color: '#4b5563', backgroundColor: '#ffffff' }}>
                        <Filter size={16} />
                        Filter Domain
                    </button>
                    <select 
                        style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 12px', fontSize: '0.875rem', backgroundColor: '#ffffff', color: '#4b5563', outline: 'none' }}
                        value={filterDomain}
                        onChange={(e) => setFilterDomain(e.target.value)}
                    >
                        <option value="All Domains">All Domains</option>
                        {domains.map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </div>
            </div>

            <AdminTable headers={['Mailbox Account', 'Domain', 'Quota Info', 'Storage Used', 'Status', 'Last Access', 'Actions']}>
                {loading ? (
                    <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '16px' }}>Loading mailboxes...</td>
                    </tr>
                ) : filteredMailboxes.length === 0 ? (
                    <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '16px' }}>No mailboxes found matching your filters.</td>
                    </tr>
                ) : filteredMailboxes.map((mailbox: any) => {
                    // Normalize mailcow properties
                    const email = mailbox.username || mailbox.email || 'unknown';
                    const domain = mailbox.domain || email.split('@')[1] || 'unknown';
                    const quotaValue = Number(mailbox.quota) || 0;
                    const usedValue = Number(mailbox.quota_used || mailbox.percent_used || 0);
                    const status = mailbox.active === 1 || mailbox.active === true ? 'active' : 'suspended';
                    const lastLogin = mailbox.last_login || mailbox.last_imap_login || 'Never';
                    
                    // Attempt to calculate percentage for progress bar
                    let percent = 0;
                    if (mailbox.percent_used) {
                        percent = Number(mailbox.percent_used);
                    } else if (quotaValue > 0) {
                        percent = (usedValue / quotaValue) * 100;
                    }

                    const quotaStr = quotaValue > 0 ? `${(quotaValue / 1024 / 1024).toFixed(0)} MB` : 'Unlimited'; 
                    const usedStr = usedValue > 0 ? `${(usedValue / 1024 / 1024 / 1024).toFixed(2)} GB` : '0 MB'; // Adjusted assuming bytes

                    return (
                        <tr key={email}>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '36px', height: '36px', backgroundColor: '#f0fdf4', borderRadius: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
                                        <AtSign size={16} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827' }}>{email.split('@')[0]}</span>
                                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{email}</span>
                                    </div>
                                </div>
                            </td>
                            <td>{domain}</td>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 600, color: '#111827', backgroundColor: '#f9fafb', padding: '4px 8px', borderRadius: '4px', border: '1px solid #f3f4f6', width: 'fit-content' }}>
                                    <HardDrive size={12} style={{ color: '#9ca3af' }} />
                                    {mailbox.quota ? mailbox.quota + ' Quota' : quotaStr} 
                                </div>
                            </td>
                            <td>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '128px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '0.625rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Usage</span>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#111827' }}>{percent.toFixed(1)}%</span>
                                    </div>
                                    <div className={styles.progressBar} style={{ height: '6px' }}>
                                        <div
                                            className={styles.progressFill}
                                            style={{
                                                width: `${Math.min(percent, 100)}%`,
                                                backgroundColor: status === 'suspended' ? '#9ca3af' : '#22c55e'
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <StatusBadge status={status} />
                            </td>
                            <td style={{ fontSize: '0.75rem', color: '#6b7280', fontStyle: 'italic' }}>
                                {lastLogin}
                            </td>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <button onClick={() => handleResetPassword(email)} title="Reset Password" style={{ padding: '8px', color: '#9ca3af' }}><Lock size={16} /></button>
                                    <button onClick={() => handleSuspendToggle(email, status === 'active')} title={status === 'active' ? "Suspend" : "Activate"} style={{ padding: '8px', color: status === 'suspended' ? '#f59e0b': '#9ca3af' }}><Ban size={16} /></button>
                                    <button onClick={() => handleDelete(email)} title="Delete" style={{ padding: '8px', color: '#ef4444' }}><Trash2 size={16} /></button>
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </AdminTable>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Mailbox"
            >
                <form 
                    style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} 
                    onSubmit={handleCreateMailbox}
                >
                    <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '12px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Username</label>
                            <input
                                type="text"
                                placeholder="e.g. info"
                                style={{ padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', outline: 'none', fontWeight: 500 }}
                                value={formData.localPart}
                                onChange={(e) => setFormData({...formData, localPart: e.target.value})}
                                required
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', textAlign: 'center' }}>Domain</label>
                            {domains.length > 0 ? (
                                <select 
                                    style={{ padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', outline: 'none', backgroundColor: '#f9fafb', fontWeight: 500 }}
                                    value={formData.domain}
                                    onChange={(e) => setFormData({...formData, domain: e.target.value})}
                                    required
                                >
                                    {domains.map(d => (
                                        <option key={d} value={d}>@{d}</option>
                                    ))}
                                </select>
                            ) : (
                                <input 
                                    type="text"
                                    placeholder="Enter domain"
                                    style={{ padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', outline: 'none', backgroundColor: '#f9fafb', fontWeight: 500 }}
                                    value={formData.domain}
                                    onChange={(e) => setFormData({...formData, domain: e.target.value})}
                                    required
                                />
                            )}
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Primary Password</label>
                        <input
                            type="password"
                            placeholder="Minimum 8 characters"
                            style={{ padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', outline: 'none' }}
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required
                        />
                        <span style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>
                            Must be at least 8 characters long, including uppercase & lowercase letters, numbers, and a special character.
                        </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Mailbox Quota (MB)</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="number"
                                style={{ flex: 1, padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', outline: 'none' }}
                                value={formData.quotaMB}
                                onChange={(e) => setFormData({...formData, quotaMB: Number(e.target.value)})}
                                required
                            />
                            <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px', backgroundColor: '#f3f4f6', borderRadius: '8px', fontWeight: 700, color: '#6b7280', fontSize: '0.875rem' }}>MB</div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', paddingTop: '16px' }}>
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            style={{ flex: 1, padding: '12px', border: '1px solid #e5e7eb', borderRadius: '12px', fontWeight: 700, color: '#4b5563', backgroundColor: '#ffffff' }}
                            disabled={creating}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles.primaryButton}
                            style={{ flex: 1, justifyContent: 'center', padding: '12px', borderRadius: '12px', opacity: creating ? 0.7 : 1 }}
                            disabled={creating}
                        >
                            {creating ? 'Creating...' : 'Create Account'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
