"use client";

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, ImageIcon } from 'lucide-react';
import AdminTable from '@/components/admin/AdminTable';
import styles from '../admin.module.css';

const API_BASE = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_API_URL : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000');

export default function BannersPage() {
    const [banners, setBanners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<any>(null);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        buttonText: 'Get Started Free',
        buttonLink: '/signup',
        image: '/hero-banner-1.png',
        bgColor: 'linear-gradient(135deg, rgba(10, 88, 50, 0.82) 0%, rgba(13, 110, 63, 0.75) 100%)',
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
            const res = await fetch(`${API_BASE}/banners/upload`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: formDataUpload
            });

            if (res.ok) {
                const data = await res.json();
                setFormData(prev => ({ ...prev, image: data.url }));
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

    const fetchBanners = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/banners`, {
                headers: getAuthHeaders()
            });
            if (res.ok) {
                setBanners(await res.json());
            }
        } catch (err) {
            console.error("Failed to fetch banners", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingBanner ? `${API_BASE}/banners/${editingBanner.id}` : `${API_BASE}/banners`;
        const method = editingBanner ? 'PATCH' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setModalOpen(false);
                setEditingBanner(null);
                fetchBanners();
            }
        } catch (err) {
            console.error("Error saving banner", err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this banner?")) return;
        try {
            const res = await fetch(`${API_BASE}/banners/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (res.ok) {
                fetchBanners();
            }
        } catch (err) {
            console.error("Error deleting banner", err);
        }
    };

    const openModal = (banner: any = null) => {
        if (banner) {
            setEditingBanner(banner);
            setFormData({
                title: banner.title,
                subtitle: banner.subtitle || '',
                buttonText: banner.buttonText || 'Get Started',
                buttonLink: banner.buttonLink || '/signup',
                image: banner.image || '',
                bgColor: banner.bgColor || '',
                isActive: banner.isActive,
                order: banner.order || 0
            });
        } else {
            setEditingBanner(null);
            setFormData({
                title: '',
                subtitle: '',
                buttonText: 'Get Started Free',
                buttonLink: '/signup',
                image: '/hero-banner-1.png',
                bgColor: 'linear-gradient(135deg, rgba(10, 88, 50, 0.82) 0%, rgba(13, 110, 63, 0.75) 100%)',
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
                    <h1 className={styles.pageTitle}>Banner Management</h1>
                    <p className={styles.pageSubtitle}>Control the hero slider on the website homepage.</p>
                </div>
                <button className={styles.primaryButton} onClick={() => openModal()}>
                    <Plus size={18} /> Add New Banner
                </button>
            </div>

            <AdminTable headers={['Preview', 'Title', 'Status', 'Order', 'Actions']}>
                {loading ? (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>Loading banners...</td></tr>
                ) : banners.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>No banners found. Static fallback will be used on homepage.</td></tr>
                ) : (
                    banners.map((banner) => (
                        <tr key={banner.id}>
                            <td style={{ width: '120px' }}>
                                <div style={{ 
                                    width: '100px', 
                                    height: '50px', 
                                    borderRadius: '4px', 
                                    backgroundImage: `url(${banner.image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundColor: '#f3f4f6',
                                    border: '1px solid #e5e7eb'
                                }}></div>
                            </td>
                            <td>
                                <div>
                                    <div style={{ fontWeight: 600, color: '#111827' }}>{banner.title}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{banner.subtitle?.substring(0, 50)}...</div>
                                </div>
                            </td>
                            <td>
                                {banner.isActive ? (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '0.875rem' }}>
                                        <CheckCircle size={16} /> Active
                                    </span>
                                ) : (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6b7280', fontSize: '0.875rem' }}>
                                        <XCircle size={16} /> Inactive
                                    </span>
                                )}
                            </td>
                            <td>{banner.order}</td>
                            <td>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button 
                                        className={styles.actionBtn} 
                                        onClick={() => openModal(banner)}
                                        title="Edit Banner"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button 
                                        className={styles.actionBtnDelete} 
                                        onClick={() => handleDelete(banner.id)}
                                        title="Delete Banner"
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
                        <h2 style={{ marginBottom: '24px', fontWeight: 700 }}>{editingBanner ? 'Edit Banner' : 'Add New Banner'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Title</label>
                                    <input 
                                        type="text" 
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Subtitle</label>
                                    <textarea 
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', minHeight: '80px' }}
                                        value={formData.subtitle}
                                        onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Button Text</label>
                                        <input 
                                            type="text" 
                                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                                            value={formData.buttonText}
                                            onChange={(e) => setFormData({...formData, buttonText: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Button Link</label>
                                        <input 
                                            type="text" 
                                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                                            value={formData.buttonLink}
                                            onChange={(e) => setFormData({...formData, buttonLink: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Background Color / Gradient</label>
                                    <input 
                                        type="text" 
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                                        value={formData.bgColor}
                                        onChange={(e) => setFormData({...formData, bgColor: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Image URL or Upload</label>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <input 
                                            type="text" 
                                            style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                                            placeholder="/hero-banner-1.png"
                                            value={formData.image}
                                            onChange={(e) => setFormData({...formData, image: e.target.value})}
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
                                    <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>
                                        Upload a local image or provide a path. Files are served from /uploads/.
                                    </p>
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
                                    {editingBanner ? 'Update Banner' : 'Create Banner'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
