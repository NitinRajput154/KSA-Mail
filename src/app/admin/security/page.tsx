"use client";

import { useEffect, useState } from 'react';
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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function SecuritySettingsPage() {
    const [securityData, setSecurityData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const getAuthHeaders = (): Record<string, string> => {
        const tokenMatch = document.cookie.match(/(?:^|; )access_token=([^;]*)/);
        return tokenMatch ? { 'Authorization': `Bearer ${tokenMatch[1]}` } : {};
    };

    const fetchSecurityData = async () => {
        try {
            const res = await fetch(`${API_BASE}/admin/security`, {
                headers: { ...getAuthHeaders() },
                credentials: 'true' === 'true' ? 'include' : 'same-origin'
            });
            if (res.ok) {
                setSecurityData(await res.json());
            }
        } catch (error) {
            console.error('Failed to load security data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSecurityData();
    }, []);

    const handleUnban = async (ip: string) => {
        if (!confirm(`Are you sure you want to unban IP: ${ip}?`)) return;
        try {
            const res = await fetch(`${API_BASE}/admin/security/unban`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                credentials: 'true' === 'true' ? 'include' : 'same-origin',
                body: JSON.stringify({ ip })
            });
            if (res.ok) {
                alert(`Successfully unbanned ${ip}`);
                fetchSecurityData();
            } else {
                alert(`Failed to unban ${ip}`);
            }
        } catch (error) {
            console.error('Failed to unban IP:', error);
            alert('An error occurred while unbanning.');
        }
    };

    const activeBans = securityData?.fail2ban?.active_bans || [];
    const dkimData = securityData?.dkim || {};
    const dkimStatus = dkimData?.pubkey ? "Active" : "Not Configured";
    const dkimSelector = dkimData?.dkim_selector || "dkim";
    
    // Mailcow sometimes returns the full DNS record in privkey or we can construct it if pubkey exists
    const dkimRecordValue = dkimData.privkey && dkimData.privkey.startsWith("v=DKIM1")
        ? dkimData.privkey.replace(/"/g, '') // remove extra quotes
        : (dkimData.pubkey ? `v=DKIM1; k=rsa; p=${dkimData.pubkey}` : "No DKIM key found for ksamail.com");

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
                            status={loading ? "..." : "Compliant"}
                            description="Global SPF policy is currently enforcing authorized server list only."
                            lastChecked={loading ? "..." : "2 hours ago"}
                        />
                        <SecurityPolicyCard
                            title="DKIM (DomainKeys Identified Mail)"
                            status={loading ? "..." : dkimStatus}
                            description={dkimData?.pubkey ? "RSA keys are being used for outgoing mail signing." : "No DKIM signature applied for ksamail.com"}
                            lastChecked={loading ? "..." : "10 mins ago"}
                        />
                        <SecurityPolicyCard
                            title="DMARC Policy"
                            status={loading ? "..." : "Quarantine"}
                            description="Current policy: v=DMARC1; p=quarantine; pct=100; adkim=r; aspf=r"
                            lastChecked={loading ? "..." : "Daily check"}
                        />
                    </div>

                    <div className={styles.card}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ fontWeight: 700, color: '#111827' }}>DKIM Key (ksamail.com)</h3>
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
                            {loading ? 'Crunching numbers...' : dkimRecordValue}
                        </div>
                        <p style={{ marginTop: '12px', fontSize: '0.625rem', color: '#9ca3af' }}>Selector: <span style={{ fontWeight: 700, color: '#4b5563' }}>{loading ? '...' : dkimSelector}</span></p>
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
                                description={`Automatically ban IPs after ${securityData?.fail2ban?.max_attempts || 5} failed login attempts.`}
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
                                <span style={{ fontSize: '0.625rem', fontWeight: 700, color: '#dc2626', backgroundColor: '#fee2e2', padding: '2px 8px', borderRadius: '100px' }}>
                                    {loading ? '...' : `${activeBans.length} BANNED IPS`}
                                </span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                                {activeBans.length === 0 && !loading && (
                                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>No IP addresses are currently banned.</span>
                                )}
                                {activeBans.map((ban: any) => (
                                    <div key={ban.ip} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', backgroundColor: '#ffffff', padding: '8px 12px', borderRadius: '6px', border: '1px solid #fee2e2' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#4b5563' }}>{ban.ip}</span>
                                            <span style={{ fontSize: '0.65rem', color: '#9ca3af' }}>Until: {ban.banned_until}</span>
                                        </div>
                                        <button 
                                            onClick={() => handleUnban(ban.ip)} 
                                            style={{ fontSize: '0.625rem', fontWeight: 700, color: '#dc2626', padding: '4px 8px', backgroundColor: '#fee2e2', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                                        >
                                            UNBAN
                                        </button>
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
