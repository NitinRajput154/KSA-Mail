"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Check, Eye, EyeOff } from 'lucide-react';
import styles from './forgot-password.module.css';

const API_BASE = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_API_URL : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000');

type Step = 'INITIATE' | 'VERIFY_OTP' | 'RESET_PASSWORD' | 'SUCCESS';

export default function ForgotPassword() {
    const [step, setStep] = useState<Step>('INITIATE');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // Form States
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [maskedTarget, setMaskedTarget] = useState('');
    const [recoveryMethod, setRecoveryMethod] = useState('');

    // Step 1: Request OTP
    const handleInitiate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            const response = await fetch(`${API_BASE}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to initiate password reset');
            }

            // Even if the account does not exist, backend returns a success message
            // to prevent enumeration. It might return maskedTarget = null
            setMaskedTarget(data.maskedTarget || 'your recovery contact');
            setRecoveryMethod(data.method || 'email');
            setStep('VERIFY_OTP');
        } catch (error: any) {
            setErrorMsg(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            const response = await fetch(`${API_BASE}/auth/forgot-password/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Invalid OTP');
            }

            setResetToken(data.resetToken);
            setStep('RESET_PASSWORD');
        } catch (error: any) {
            setErrorMsg(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        if (newPassword !== confirmPassword) {
            setErrorMsg('Passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            setErrorMsg('Password must be at least 8 characters long');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE}/auth/forgot-password/reset`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resetToken, newPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to reset password');
            }

            setStep('SUCCESS');
        } catch (error: any) {
            setErrorMsg(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.forgotPasswordPage}>
            <div className={styles.card}>
                <Link href="/" className={styles.logo}>
                    <Image src="/header-logo.png" alt="KSA Mail" width={150} height={150} className={styles.logoImg} />
                </Link>

                {errorMsg && (
                    <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '1.5rem', width: '100%', fontSize: '0.875rem', textAlign: 'left' }}>
                        {errorMsg}
                    </div>
                )}

                {/* --- STEP 1: INITIATE --- */}
                {step === 'INITIATE' && (
                    <>
                        <div className={styles.cardHeader}>
                            <h2>Forgot Password</h2>
                            <p>Enter your KSA Mail address and we'll send an OTP to your verified phone number.</p>
                        </div>
                        <form className={styles.form} onSubmit={handleInitiate}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="email">KSA Mail Address</label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="you@ksamail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className={styles.submitButton} disabled={loading}>
                                {loading ? 'Sending...' : 'Send OTP'}
                            </button>
                            <Link href={process.env.NEXT_PUBLIC_WEBMAIL_URL || "https://webmail.ksamail.com/"} className={styles.backLink}>
                                <ChevronLeft size={18} /> Back to Sign In
                            </Link>
                        </form>
                    </>
                )}

                {/* --- STEP 2: VERIFY OTP --- */}
                {step === 'VERIFY_OTP' && (
                    <>
                        <div className={styles.cardHeader}>
                            <h2>Verify OTP</h2>
                            <p>We've sent a code to <br /><strong className={styles.emailDisplay}>{maskedTarget}</strong></p>
                        </div>
                        <form className={styles.form} onSubmit={handleVerifyOtp}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="otp">Verification Code</label>
                                <input
                                    id="otp"
                                    type="text"
                                    placeholder="Enter 6-digit code"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className={styles.submitButton} disabled={loading}>
                                {loading ? 'Verifying...' : 'Verify OTP'}
                            </button>
                            <button
                                type="button"
                                className={styles.backLink}
                                onClick={() => setStep('INITIATE')}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                            >
                                <ChevronLeft size={18} /> Change Email
                            </button>
                        </form>
                    </>
                )}

                {/* --- STEP 3: RESET PASSWORD --- */}
                {step === 'RESET_PASSWORD' && (
                    <>
                        <div className={styles.cardHeader}>
                            <h2>Create New Password</h2>
                            <p>Enter a strong new password for your account.</p>
                        </div>
                        <form className={styles.form} onSubmit={handleResetPassword}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="newPassword">New Password</label>
                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                    <input
                                        id="newPassword"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        style={{ width: '100%' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    id="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className={styles.submitButton} disabled={loading}>
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    </>
                )}

                {/* --- STEP 4: SUCCESS --- */}
                {step === 'SUCCESS' && (
                    <>
                        <div className={styles.iconWrapper}>
                            <Check size={40} />
                        </div>
                        <div className={styles.cardHeader}>
                            <h2>Password Reset!</h2>
                            <p>Your password has been successfully updated. You can now use your new password to sign in.</p>
                        </div>
                        <Link href={process.env.NEXT_PUBLIC_WEBMAIL_URL || "https://webmail.ksamail.com/"} className={styles.submitButton} style={{ textDecoration: 'none', display: 'inline-block' }}>
                            Go to Sign In
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
