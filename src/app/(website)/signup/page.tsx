"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Globe, Server, Check, Eye, EyeOff, ChevronLeft } from 'lucide-react';
import styles from './signup.module.css';

const API_BASE = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_API_URL : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000');

export default function Signup() {
    // ─── Form State ──────────────────────────────────────────
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // ─── Phone OTP State ─────────────────────────────────────
    const [phoneOtpCode, setPhoneOtpCode] = useState('');
    const [showPhoneOtpInput, setShowPhoneOtpInput] = useState(false);
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);
    const [phoneOtpLoading, setPhoneOtpLoading] = useState(false);
    const [phoneVerifyLoading, setPhoneVerifyLoading] = useState(false);


    // ─── Username check State ────────────────────────────────
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
    const [checkingUsername, setCheckingUsername] = useState(false);

    // ─── Feedback State ──────────────────────────────────────
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        setError('');

        if (name === 'username') {
            setUsernameAvailable(null);
        }
        if (name === 'username') {
            setUsernameAvailable(null);
        }
    };

    // ─── Check Username Availability ─────────────────────────
    const handleCheckUsername = async () => {
        if (!formData.username || formData.username.length < 3) {
            setError('Username must be at least 3 characters');
            return;
        }
        setCheckingUsername(true);
        try {
            const response = await fetch(`${API_BASE}/auth/check-username`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: formData.username }),
            });
            const data = await response.json();
            setUsernameAvailable(data.available);
            if (!data.available) {
                setError(`Username "${formData.username}" is already taken`);
            }
        } catch {
            setError('Could not check username availability');
        } finally {
            setCheckingUsername(false);
        }
    };

    // ═══════════════════════════════════════════════════════════
    // PHONE OTP
    // ═══════════════════════════════════════════════════════════
    const handleSendPhoneOtp = async () => {
        const phone = formData.phoneNumber.trim();
        if (!phone) { setError('Please enter your phone number'); return; }
        if (!/^\+\d{7,15}$/.test(phone)) { setError('Phone must start with + followed by country code (e.g. +9665XXXXXXXX or +91XXXXXXXXXX)'); return; }

        setPhoneOtpLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_BASE}/auth/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to send OTP');

            setShowPhoneOtpInput(true);
            setSuccess('OTP sent to your phone number!');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setPhoneOtpLoading(false);
        }
    };

    const handleVerifyPhoneOtp = async () => {
        if (!phoneOtpCode || phoneOtpCode.length < 4) { setError('Please enter a valid OTP'); return; }

        setPhoneVerifyLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_BASE}/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: formData.phoneNumber.trim(), otp: phoneOtpCode }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'OTP verification failed');

            setIsPhoneVerified(true);
            setShowPhoneOtpInput(false);
            setSuccess('Phone number verified! You can now set your password.');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setPhoneVerifyLoading(false);
        }
    };


    // ═══════════════════════════════════════════════════════════
    // SUBMIT REGISTRATION
    // ═══════════════════════════════════════════════════════════
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!isPhoneVerified) { setError('Please verify your phone number first.'); return; }
        if (formData.password !== formData.confirmPassword) { setError('Passwords do not match.'); return; }
        if (formData.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
        if (!formData.agreeToTerms) { setError('You must agree to the Terms of Service.'); return; }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.fullName,
                    username: formData.username,
                    phone: formData.phoneNumber.trim(),
                    password: formData.password,
                }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Signup failed');

            setSuccess('Account created successfully! Redirecting to login...');
            const webmailUrl = process.env.NEXT_PUBLIC_WEBMAIL_URL || 'https://webmail.ksamail.com/';
            setTimeout(() => { window.location.href = webmailUrl; }, 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.signupPage}>
            <div className={styles.container}>
                {/* Left Side - Branding & Info */}
                <div className={styles.infoSide}>
                    <div className={styles.infoContent}>
                        <Link href="/" className={styles.logo}>
                            <Image src="/logo.png" alt="KSA Mail" width={180} height={180} className={styles.logoImg} />
                        </Link>

                        <div className={styles.badge}>
                            <span className={styles.badgeDot}></span>
                            Join 2,800+ businesses
                        </div>

                        <h1 className={styles.infoTitle}>
                            Start your professional email journey today.
                        </h1>
                        <p className={styles.infoText}>
                            Get enterprise-grade email hosting with local Saudi servers,
                            premium security, and dedicated Arabic support.
                        </p>

                        <div className={styles.benefitList}>
                            <div className={styles.benefitItem}>
                                <div className={styles.benefitIcon}><Shield size={20} /></div>
                                <span>256-bit Encryption</span>
                            </div>
                            <div className={styles.benefitItem}>
                                <div className={styles.benefitIcon}><Server size={20} /></div>
                                <span>Local KSA Servers</span>
                            </div>
                            <div className={styles.benefitItem}>
                                <div className={styles.benefitIcon}><Check size={20} /></div>
                                <span>99.9% Uptime SLA</span>
                            </div>
                            <div className={styles.benefitItem}>
                                <div className={styles.benefitIcon}><Globe size={20} /></div>
                                <span>Custom Domains</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.infoOverlay}></div>
                </div>

                {/* Right Side - Signup Form */}
                <div className={styles.formSide}>
                    <Link href="/" className={styles.backLink}>
                        <ChevronLeft size={18} />
                        Back to home
                    </Link>

                    <div className={styles.formContainer}>
                        <div className={styles.formHeader}>
                            <h2>Create Your Account</h2>
                            <p>Get started with your free professional email in under 2 minutes</p>
                        </div>

                        {/* Feedback Messages */}
                        {error && <div className={styles.errorMessage}>{error}</div>}
                        {success && <div className={styles.successMessage}>{success}</div>}

                        <form className={styles.form} onSubmit={handleSubmit}>
                            {/* Full Name */}
                            <div className={styles.inputGroup}>
                                <label htmlFor="fullName">Full Name</label>
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    placeholder="Ahmed Al-Rashid"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Username */}
                            <div className={styles.inputGroup}>
                                <label htmlFor="username">KSA Mail Address</label>
                                <div className={styles.emailInputWrapper}>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        placeholder="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        onBlur={handleCheckUsername}
                                        required
                                    />
                                    <span className={styles.domainSuffix}>@ksamail.com</span>
                                </div>
                                {checkingUsername && (
                                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Checking availability...</span>
                                )}
                                {usernameAvailable === true && (
                                    <span className={styles.verifiedBadge}><Check size={14} /> Available</span>
                                )}
                                {usernameAvailable === false && (
                                    <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600 }}>✕ Username taken</span>
                                )}
                            </div>


                            {/* Phone Number + OTP Verification */}
                            <div className={styles.inputGroup}>
                                <label htmlFor="phoneNumber">Phone Number (Verification Required)</label>
                                <div className={styles.inputWithAction}>
                                    <input
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        type="tel"
                                        placeholder="+9665XXXXXXXX"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        disabled={isPhoneVerified}
                                        required
                                    />
                                    {!isPhoneVerified && (
                                        <button
                                            type="button"
                                            className={styles.verifyButton}
                                            onClick={handleSendPhoneOtp}
                                            disabled={phoneOtpLoading || !formData.phoneNumber}
                                        >
                                            {phoneOtpLoading ? 'Sending...' : showPhoneOtpInput ? 'Resend' : 'Verify'}
                                        </button>
                                    )}
                                </div>
                                {isPhoneVerified && (
                                    <span className={styles.verifiedBadge}><Check size={14} /> Verified</span>
                                )}

                                {/* Phone OTP Input */}
                                {showPhoneOtpInput && !isPhoneVerified && (
                                    <div className={styles.otpGroup}>
                                        <div className={styles.otpHeader}>
                                            <span>Enter OTP sent to your phone</span>
                                        </div>
                                        <div className={styles.otpInputWrapper}>
                                            <input
                                                type="text"
                                                maxLength={6}
                                                placeholder="000000"
                                                value={phoneOtpCode}
                                                onChange={(e) => setPhoneOtpCode(e.target.value.replace(/\D/g, ''))}
                                            />
                                            <button
                                                type="button"
                                                className={styles.confirmOtpButton}
                                                onClick={handleVerifyPhoneOtp}
                                                disabled={phoneVerifyLoading || phoneOtpCode.length < 4}
                                            >
                                                {phoneVerifyLoading ? 'Verifying...' : 'Confirm'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Password */}
                            <div className={styles.inputGroup}>
                                <label htmlFor="password">Password</label>
                                <div className={styles.passwordWrapper}>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder={isPhoneVerified ? "Min. 8 characters" : "Verify phone to enable"}
                                        value={formData.password}
                                        onChange={handleChange}
                                        disabled={!isPhoneVerified}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className={styles.toggleVisibility}
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={!isPhoneVerified}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className={styles.inputGroup}>
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <div className={styles.passwordWrapper}>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder={isPhoneVerified ? "Re-enter your password" : "Verify phone to enable"}
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        disabled={!isPhoneVerified}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className={styles.toggleVisibility}
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        disabled={!isPhoneVerified}
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Terms */}
                            <div className={styles.checkboxGroup}>
                                <input
                                    type="checkbox"
                                    id="terms"
                                    name="agreeToTerms"
                                    checked={formData.agreeToTerms}
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="terms">
                                    I agree to the <Link href="/terms">Terms of Service</Link> and <Link href="/privacy">Privacy Policy</Link>
                                </label>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={loading || !isPhoneVerified}
                                style={{
                                    opacity: !isPhoneVerified ? 0.5 : 1,
                                    cursor: !isPhoneVerified ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {loading ? 'Creating Account...' : 'Create Account →'}
                            </button>

                            <div className={styles.divider}>
                                <span>OR</span>
                            </div>

                            <p className={styles.loginPrompt}>
                                Already have an account? <a href={process.env.NEXT_PUBLIC_WEBMAIL_URL || "https://webmail.ksamail.com/"}>Sign in</a>
                            </p>
                        </form>

                        <p className={styles.securityFooter}>
                            <Shield size={14} /> Protected by 256-bit SSL encryption
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
