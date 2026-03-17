import Sidebar from '@/components/admin/Sidebar';
import Navbar from '@/components/admin/Navbar';
import styles from './admin.module.css';
import { headers } from 'next/headers';
import { Toaster } from 'react-hot-toast';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const headersList = await headers();
    const pathname = headersList.get('x-pathname') || '';
    
    // Hide layout for the login page
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    return (
        <div className={styles.adminLayout}>
            <Toaster position="top-right" />
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
