"use client";

import {
    Settings as SettingsIcon,
    Mail,
    Bell,
    Globe,
    Server,
    Shield,
    Layout,
    Save
} from 'lucide-react';
import styles from '../admin.module.css';

export default function SettingsPage() {
    return (
        <div style={{ animation: 'fade-in 0.5s ease-out' }}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Platform Settings</h1>
                    <p className={styles.pageSubtitle}>Global configuration for your email hosting infrastructure.</p>
                </div>
                <button className={styles.primaryButton} style={{ boxShadow: '0 10px 15px -3px rgba(22, 163, 74, 0.2)' }}>
                    <Save size={18} />
                    Save All Changes
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '32px' }}>
                {/* Settings Navigation */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <SettingsNavItem icon={Globe} label="General Settings" active={true} />
                    <SettingsNavItem icon={Mail} label="Default Mail Policies" />
                    <SettingsNavItem icon={Server} label="SMTP/IMAP Config" />
                    <SettingsNavItem icon={Bell} label="Notification Rules" />
                    <SettingsNavItem icon={Shield} label="Admin Security" />
                    <SettingsNavItem icon={Layout} label="UI & Branding" />
                </div>

                {/* Content Area */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className={styles.card} style={{ padding: '32px' }}>

                        <section style={{ marginBottom: '32px' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px', marginBottom: '24px' }}>General Platform Identity</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Service Name</label>
                                    <input
                                        defaultValue="KSA Mail Hosting"
                                        style={{ padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', outline: 'none', backgroundColor: '#f9fafb', fontWeight: 500 }}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Support Email</label>
                                    <input
                                        defaultValue="support@ksamail.sa"
                                        style={{ padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', outline: 'none', backgroundColor: '#f9fafb', fontWeight: 500 }}
                                    />
                                </div>
                            </div>
                        </section>

                        <section style={{ marginBottom: '32px' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px', marginBottom: '24px' }}>Default Domain Quotas</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
                                    <div>
                                        <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827' }}>Automatic DKIM Generation</p>
                                        <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Automatically generate RSA keys when a new domain is added.</p>
                                    </div>
                                    <div style={{ width: '40px', height: '20px', borderRadius: '100px', backgroundColor: '#16a34a', position: 'relative' }}>
                                        <div style={{ position: 'absolute', top: '4px', right: '4px', width: '12px', height: '12px', backgroundColor: 'white', borderRadius: '100%' }}></div>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Default Mailbox Quota (MB)</label>
                                        <input
                                            type="number"
                                            defaultValue={1024}
                                            style={{ padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', outline: 'none', backgroundColor: '#f9fafb', fontWeight: 500 }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Max Domain Quota (GB)</label>
                                        <input
                                            type="number"
                                            defaultValue={50}
                                            style={{ padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', outline: 'none', backgroundColor: '#f9fafb', fontWeight: 500 }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px', marginBottom: '24px' }}>Critical Actions</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                <button style={{ padding: '10px 20px', backgroundColor: 'white', border: '1px solid #fee2e2', color: '#dc2626', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 700 }}>
                                    Purge All Logs
                                </button>
                                <button style={{ padding: '10px 20px', backgroundColor: 'white', border: '1px solid #e5e7eb', color: '#4b5563', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 700 }}>
                                    Download Backup
                                </button>
                                <button style={{ padding: '10px 20px', backgroundColor: '#dc2626', color: 'white', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 700, border: 'none' }}>
                                    Restart All Mail Services
                                </button>
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
}

function SettingsNavItem({ icon: Icon, label, active }: any) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            backgroundColor: active ? '#16a34a' : 'transparent',
            color: active ? 'white' : '#4b5563',
            boxShadow: active ? '0 4px 6px -1px rgba(22, 163, 74, 0.2)' : 'none',
            fontWeight: active ? 700 : 500
        }}>
            <Icon size={18} />
            <span style={{ fontSize: '0.875rem' }}>{label}</span>
        </div>
    );
}
