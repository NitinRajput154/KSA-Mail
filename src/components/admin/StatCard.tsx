import { LucideIcon } from 'lucide-react';
import styles from '@/app/admin/admin.module.css';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: string;
        positive: boolean;
    };
    description?: string;
    progress?: number;
}

export default function StatCard({ title, value, icon: Icon, trend, description, progress }: StatCardProps) {
    return (
        <div className={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div className={styles.statCardIcon}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <span className={`${styles.badge} ${trend.positive ? styles.badgeSuccess : styles.badgeError}`} style={{ fontSize: '0.7rem' }}>
                        {trend.positive ? '+' : ''}{trend.value}
                    </span>
                )}
            </div>
            <div>
                <p className={styles.statLabel}>{title}</p>
                <h3 className={styles.statValue}>{value}</h3>
                {description && <p className={styles.statDesc}>{description}</p>}
                {progress !== undefined && (
                    <div className={styles.progressContainer}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                            <span style={{ color: '#6b7280' }}>Usage</span>
                            <span style={{ fontWeight: 600 }}>{progress}%</span>
                        </div>
                        <div className={styles.progressBar}>
                            <div
                                className={styles.progressFill}
                                style={{
                                    width: `${progress}%`,
                                    backgroundColor: progress > 90 ? '#ef4444' : progress > 70 ? '#f59e0b' : '#16a34a'
                                }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
