"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Check, ChevronLeft } from 'lucide-react';
import styles from '../forgot-password/forgot-password.module.css'; // Reusing styles

function CheckEmailContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || 'your-email@example.com';

    return (
        <div className={styles.forgotPasswordPage}>
            <div className={styles.card}>
                <Link href="/" className={styles.logo}>
                    <Image src="/logo.png" alt="KSA Mail" width={80} height={80} />
                </Link>

                <div className={styles.iconWrapper}>
                    <Check size={40} />
                </div>

                <div className={styles.cardHeader}>
                    <h2>Check Your Email</h2>
                    <p>We've sent a password reset link to <br /><span className={styles.emailDisplay}>{email}</span>. Please check your inbox and follow the instructions.</p>
                </div>

                <a href={process.env.NEXT_PUBLIC_WEBMAIL_URL || "https://webmail.ksamail.com/"} className={styles.submitButton} style={{ textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <ChevronLeft size={18} />
                    Back to Sign In
                </a>
            </div>
        </div>
    );
}

export default function CheckEmail() {
    return (
        <Suspense fallback={null}>
            <CheckEmailContent />
        </Suspense>
    );
}
