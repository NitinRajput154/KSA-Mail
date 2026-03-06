"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft } from 'lucide-react';
import styles from './forgot-password.module.css';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        console.log('Resetting password for:', email);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);
        // Navigate to check-email with state
        window.location.href = `/check-email?email=${encodeURIComponent(email)}`;
    };

    return (
        <div className={styles.forgotPasswordPage}>
            <div className={styles.card}>
                <Link href="/" className={styles.logo}>
                    <Image src="/logo.png" alt="KSA Mail" width={150} height={150} className={styles.logoImg} />
                </Link>

                <div className={styles.cardHeader}>
                    <h2>Forgot Password</h2>
                    <p>No worries. Enter your recovery email address and we'll send you a link to reset your password.</p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className={styles.submitButton} disabled={loading}>
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>

                    <Link href="/login" className={styles.backLink}>
                        <ChevronLeft size={18} />
                        Back to Sign In
                    </Link>
                </form>
            </div>
        </div>
    );
}
