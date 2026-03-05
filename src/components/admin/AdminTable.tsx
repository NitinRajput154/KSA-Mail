"use client";

import styles from '@/app/admin/admin.module.css';

interface AdminTableProps {
    headers: string[];
    children: React.ReactNode;
}

export default function AdminTable({ headers, children }: AdminTableProps) {
    return (
        <div className={styles.tableWrapper}>
            <table className={styles.adminTable}>
                <thead>
                    <tr>
                        {headers.map((header) => (
                            <th key={header}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {children}
                </tbody>
            </table>
        </div>
    );
}
