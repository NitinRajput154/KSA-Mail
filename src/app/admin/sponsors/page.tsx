"use client";

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, ImageIcon } from 'lucide-react';
import AdminTable from '@/components/admin/AdminTable';
import styles from '../admin.module.css';

const API_BASE = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_API_URL : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000');

export default function SponsorsPage() {
    const [sponsors, setSponsors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingSponsor, setEditingSponsor] = useState<any>(null);
    const [formData, setFormData] = useState({
        title: '',
        desc: '',
        logo: '',
        features: '', // We'll edit this as a newline-separated string
        link: '',
        isActive: true,
        order: 0
    });

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

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        try {
            const res = await fetch(`${API_BASE}/sponsors/upload`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: formDataUpload
            });

            if (res.ok) {
                const data = await res.json();
                setFormData(prev => ({ ...prev, logo: data.url }));
            } else {
                alert("Upload failed. Please ensure the file is an image.");
            }
        } catch (err) {
            console.error("Upload error", err);
            alert("Error uploading file.");
        } finally {
            setUploading(false);
        }
    };

    const fetchSponsors = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/sponsors`, {
                headers: getAuthHeaders()
            });
            if (res.ok) {
                setSponsors(await res.json());
            }
        } catch (err) {
            console.error("Failed to fetch sponsors", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSponsors();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingSponsor ? `${API_BASE}/sponsors/${editingSponsor.id}` : `${API_BASE}/sponsors`;
        const method = editingSponsor ? 'PATCH' : 'POST';

        const payload = {
            ...formData,
            features: formData.features.split('\n').map(f => f.trim()).filter(f => f.length > 0)
        };

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setModalOpen(false);
                setEditingSponsor(null);
                fetchSponsors();
            }
        } catch (err) {
            console.error("Error saving sponsor", err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this sponsor/ad?")) return;
        try {
            const res = await fetch(`${API_BASE}/sponsors/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (res.ok) {
                fetchSponsors();
            }
        } catch (err) {
            console.error("Error deleting sponsor", err);
        }
    };

    const openModal = (sponsor: any = null) => {
        if (sponsor) {
            setEditingSponsor(sponsor);
            setFormData({
                title: sponsor.title,
                desc: sponsor.desc || '',
                logo: sponsor.logo || '',
                features: (sponsor.features || []).join('\n'),
                link: sponsor.link || '',
                isActive: sponsor.isActive,
                order: sponsor.order || 0
            });
        } else {
            setEditingSponsor(null);
            setFormData({
                title: '',
                desc: '',
                logo: '',
                features: '',
                link: '',
                isActive: true,
                order: 0
            });
        }
        setModalOpen(true);
    };

    return (
        <div style={{ animation: 'fade-in 0.5s ease-out' }}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Sponsors & Ads</h1>
                    <p className={styles.pageSubtitle}>Manage the sponsored cards appearing on the webmail login screen.</p>
                </div>
                <button className={styles.primaryButton} onClick={() => openModal()}>
                    <Plus size={18} /> Add New Sponsor
                </button>
            </div>

            <AdminTable headers={['Logo', 'Title', 'Link', 'Status', 'Order', 'Actions']}>
                {loading ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>Loading sponsors...</td></tr>
                ) : sponsors.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>No sponsors found. Front-end fallback will be used.</td></tr>
                ) : (
                    sponsors.map((sponsor) => (
                        <tr key={sponsor.id}>
                            <td style={{ width: '80px' }}>
                                <div style={{ 
                                    width: '40px', 
                                    height: '40px', 
                                    borderRadius: '8px', 
                                    backgroundImage: `url(${sponsor.logo})`,
                                    backgroundSize: 'contain',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                    backgroundColor: '#f8fafc',
                                    border: '1px solid #e2e8f0'
                                }}></div>
                            </td>
                            <td>
                                <div>
                                    <div style={{ fontWeight: 600, color: '#111827' }}>{sponsor.title}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{sponsor.desc?.substring(0, 50)}...</div>
                                </div>
                            </td>
                            <td>
                                <a href={sponsor.link} target="_blank" rel="noreferrer" style={{ color: '#0369a1', textDecoration: 'underline', fontSize: '0.875rem' }}>View Link</a>
                            </td>
                            <td>
                                {sponsor.isActive ? (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '0.875rem' }}>
                                        <CheckCircle size={16} /> Active
                                    </span>
                                ) : (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6b7280', fontSize: '0.875rem' }}>
                                        <XCircle size={16} /> Inactive
                                    </span>
                                )}
                            </td>
                            <td>{sponsor.order}</td>
                            <td>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button 
                                        className={styles.actionBtn} 
                                        onClick={() => openModal(sponsor)}
                                        title="Edit Sponsor"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button 
                                        className={styles.actionBtnDelete} 
                                        onClick={() => handleDelete(sponsor.id)}
                                        title="Delete Sponsor"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))
                )}
            </AdminTable>

            {modalOpen && (
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
                        <h2 style={{ marginBottom: '24px', fontWeight: 700 }}>{editingSponsor ? 'Edit Sponsor' : 'Add New Sponsor'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Brand / Title</label>
                                    <input 
                                        type="text" 
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Description</label>
                                    <textarea 
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', minHeight: '60px' }}
                                        value={formData.desc}
                                        onChange={(e) => setFormData({...formData, desc: e.target.value})}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Link / URL</label>
                                    <input 
                                        type="text" 
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                                        value={formData.link}
                                        onChange={(e) => setFormData({...formData, link: e.target.value})}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Features (One per line)</label>
                                    <textarea 
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', minHeight: '80px' }}
                                        value={formData.features}
                                        placeholder="Free domain & SSL\n24/7 Expert support\n..."
                                        onChange={(e) => setFormData({...formData, features: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Logo Image URL or Upload</label>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <input 
                                            type="text" 
                                            style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                                            placeholder="/images/sponsor.png"
                                            value={formData.logo}
                                            onChange={(e) => setFormData({...formData, logo: e.target.value})}
                                        />
                                        <label style={{ 
                                            padding: '10px 15px', 
                                            borderRadius: '8px', 
                                            backgroundColor: '#f3f4f6', 
                                            border: '1px solid #d1d5db', 
                                            cursor: 'pointer',
                                            fontSize: '0.875rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            <ImageIcon size={16} /> {uploading ? '...' : 'Upload'}
                                            <input type="file" hidden accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                                        </label>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Display Order</label>
                                        <input 
                                            type="number" 
                                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                                            value={formData.order}
                                            onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '24px' }}>
                                        <input 
                                            type="checkbox" 
                                            id="isActive"
                                            checked={formData.isActive}
                                            onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                                        />
                                        <label htmlFor="isActive" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Active</label>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
                                <button 
                                    type="button" 
                                    style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #d1d5db', backgroundColor: 'white', fontWeight: 600 }}
                                    onClick={() => setModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#16a34a', color: 'white', fontWeight: 600 }}
                                >
                                    {editingSponsor ? 'Update Sponsor' : 'Create Sponsor'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
