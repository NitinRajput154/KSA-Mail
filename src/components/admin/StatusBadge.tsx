import styles from '@/app/admin/admin.module.css';

interface StatusBadgeProps {
    status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const getStyleClass = () => {
        switch (status.toLowerCase()) {
            case 'active':
            case 'valid':
            case 'success':
            case 'online':
                return styles.badgeSuccess;
            case 'suspended':
            case 'invalid':
            case 'failed':
            case 'offline':
            case 'error':
                return styles.badgeError;
            case 'pending':
            case 'warning':
                return styles.badgeWarning;
            default:
                return '';
        }
    };

    return (
        <span className={`${styles.badge} ${getStyleClass()}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}
