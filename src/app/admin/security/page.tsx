"use client";

import {
    ShieldCheck,
    Lock,
    Settings,
    ShieldAlert,
    ArrowRight,
    ShieldHalf
} from 'lucide-react';
import StatusBadge from '@/components/admin/StatusBadge';
import styles from '../admin.module.css';

export default function SecuritySettingsPage() {
    return (
        <div style={{ animation: 'fade-in 0.5s ease-out' }}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Security Configuration</h1>
                    <p className={styles.pageSubtitle}>Manage global security policies, DKIM keys, and server hardening.</p>
                </div>
            </div>

            <div className={styles.dashboardRows}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ShieldCheck size={20} style={{ color: '#16a34a' }} />
                        Domain Protection Status
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                        <SecurityPolicyCard
                            title="SPF (Sender Policy Framework)"
                            status="Compliant"
                            description="Global SPF policy is currently enforcing authorized server list only."
                            lastChecked="2 hours ago"
                        />
                        <SecurityPolicyCard
                            title="DKIM (DomainKeys Identified Mail)"
                            status="Active"
                            description="RSA-2048 keys are being used for outgoing mail signing."
                            lastChecked="10 mins ago"
                        />
                        <SecurityPolicyCard
                            title="DMARC Policy"
                            status="Quarantine"
                            description="Current policy: v=DMARC1; p=quarantine; pct=100; adkim=r; aspf=r"
                            lastChecked="Daily check"
                        />
                    </div>

                    <div className={styles.card}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ fontWeight: 700, color: '#111827' }}>DKIM Key Generator</h3>
                            <button style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a' }}>ROTATE KEYS</button>
                        </div>
                        <div style={{
                            backgroundColor: '#f9fafb',
                            padding: '16px',
                            borderRadius: '8px',
                            fontFamily: 'monospace',
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            wordBreak: 'break-all',
                            border: '1px solid #f3f4f6',
                            lineHeight: 1.6
                        }}>
                            v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7pU3vG... (truncated for preview)
                        </div>
                        <p style={{ marginTop: '12px', fontSize: '0.625rem', color: '#9ca3af' }}>Selector: <span style={{ fontWeight: 700, color: '#4b5563' }}>dkim_ksa_2026</span></p>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Lock size={20} style={{ color: '#2563eb' }} />
                        Server Hardening
                    </h2>

                    <div className={`${styles.card}`} style={{ padding: '0' }}>
                        <div style={{ padding: '20px', borderBottom: '1px solid #f3f4f6' }}>
                            <HardeningSwitch
                                title="Strict SSL/TLS Enforcement"
                                enabled={true}
                                description="Reject connections from clients without modern TLS/SSL support."
                            />
                        </div>
                        <div style={{ padding: '20px', borderBottom: '1px solid #f3f4f6' }}>
                            <HardeningSwitch
                                title="Two-Factor Authentication (2FA)"
                                enabled={true}
                                description="Enforce 2FA for all administrator accounts."
                            />
                        </div>
                        <div style={{ padding: '20px', borderBottom: '1px solid #f3f4f6' }}>
                            <HardeningSwitch
                                title="Brute Force Protection"
                                enabled={true}
                                description="Automatically ban IPs after 5 failed login attempts."
                            />
                        </div>
                        <div style={{ padding: '20px' }}>
                            <HardeningSwitch
                                title="Outbound Rate Limiting"
                                enabled={false}
                                description="Prevent spam outbreaks by limiting mails per hour per mailbox."
                            />
                        </div>

                        <div style={{ margin: '20px', padding: '20px', backgroundColor: '#fef2f2', borderRadius: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <ShieldAlert size={18} style={{ color: '#dc2626' }} />
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#991b1b', textTransform: 'uppercase' }}>Fail2ban active list</span>
                                </div>
                                <span style={{ fontSize: '0.625rem', fontWeight: 700, color: '#dc2626', backgroundColor: '#fee2e2', padding: '2px 8px', borderRadius: '100px' }}>12 BANNED IPS</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {['185.12.44.11', '94.223.1.201', '45.122.3.9'].map(ip => (
                                    <div key={ip} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', backgroundColor: '#ffffff', padding: '8px 12px', borderRadius: '6px', border: '1px solid #fee2e2' }}>
                                        <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#4b5563' }}>{ip}</span>
                                        <button style={{ fontSize: '0.625rem', fontWeight: 700, color: '#dc2626' }}>UNBAN</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SecurityPolicyCard({ title, status, description, lastChecked }: any) {
    return (
        <div className={styles.card} style={{ transition: 'all 0.2s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</h3>
                <StatusBadge status={status} />
            </div>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.6, marginBottom: '16px' }}>{description}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.625rem', color: '#9ca3af', fontWeight: 500 }}>
                <Settings size={12} />
                Last Check: {lastChecked}
            </div>
        </div>
    );
}

function HardeningSwitch({ title, enabled, description }: any) {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827' }}>{title}</span>
                <div style={{
                    width: '40px',
                    height: '20px',
                    borderRadius: '100px',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    backgroundColor: enabled ? '#16a34a' : '#d1d5db'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '4px',
                        left: enabled ? '24px' : '4px',
                        width: '12px',
                        height: '12px',
                        backgroundColor: 'white',
                        borderRadius: '100%',
                        transition: 'left 0.2s'
                    }}></div>
                </div>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{description}</p>
        </div>
    );
}
