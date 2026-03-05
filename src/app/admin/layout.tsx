import Sidebar from '@/components/admin/Sidebar';
import Navbar from '@/components/admin/Navbar';
import styles from './admin.module.css';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={styles.adminLayout}>
            <Sidebar />
            <div className={styles.mainContent}>
                <Navbar />
                <main className={styles.pageContent}>
                    {children}
                </main>
            </div>
        </div>
    );
}
