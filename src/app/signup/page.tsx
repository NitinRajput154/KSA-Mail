"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Globe, Server, Check, Eye, EyeOff, ChevronLeft } from 'lucide-react';
import styles from './signup.module.css';

export default function Signup() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        recoveryEmail: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        agreeToTerms: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Verification Mock State
    const [emailOtp, setEmailOtp] = useState('');
    const [phoneOtp, setPhoneOtp] = useState('');
    const [showEmailOtpSpace, setShowEmailOtpSpace] = useState(false);
    const [showPhoneOtpSpace, setShowPhoneOtpSpace] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleVerifyEmail = () => {
        if (!formData.recoveryEmail) return alert('Please enter a recovery email');
        setShowEmailOtpSpace(true);
        // Mock sending OTP
    };

    const handleVerifyPhone = () => {
        if (!formData.phoneNumber) return alert('Please enter a phone number');
        setShowPhoneOtpSpace(true);
        // Mock sending OTP
    };

    const confirmEmailOtp = () => {
        if (emailOtp === '1234') {
            setIsEmailVerified(true);
            setShowEmailOtpSpace(false);
        } else {
            alert('Invalid OTP. Try 1234');
        }
    };

    const confirmPhoneOtp = () => {
        if (phoneOtp === '1234') {
            setIsPhoneVerified(true);
            setShowPhoneOtpSpace(false);
        } else {
            alert('Invalid OTP. Try 1234');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isEmailVerified || !isPhoneVerified) {
            return alert('Please verify your recovery email and phone number first.');
        }
        setLoading(true);

        console.log('Submitting signup data:', formData);
        await new Promise(resolve => setTimeout(resolve, 1500));

        setLoading(false);
        alert('Signup successful! (Backend integration pending)');
    };

    return (
        <div className={styles.signupPage}>
            <div className={styles.container}>
                {/* Left Side - Branding & Info */}
                <div className={styles.infoSide}>
                    <div className={styles.infoContent}>
                        <Link href="/" className={styles.logo}>
                            <Image src="/logo.png" alt="KSA Mail" width={80} height={80} />
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

                        <form className={styles.form} onSubmit={handleSubmit}>
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

                            <div className={styles.inputGroup}>
                                <label htmlFor="email">KSA Mail Address</label>
                                <div className={styles.emailInputWrapper}>
                                    <input
                                        id="email"
                                        name="email"
                                        type="text"
                                        placeholder="username"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                    <span className={styles.domainSuffix}>@ksamail.com</span>
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="recoveryEmail">Recovery Email</label>
                                <div className={styles.inputWithAction}>
                                    <input
                                        id="recoveryEmail"
                                        name="recoveryEmail"
                                        type="email"
                                        placeholder="personal@gmail.com"
                                        value={formData.recoveryEmail}
                                        onChange={handleChange}
                                        disabled={isEmailVerified}
                                        required
                                    />
                                    {!isEmailVerified && (
                                        <button type="button" className={styles.verifyButton} onClick={handleVerifyEmail}>
                                            Verify
                                        </button>
                                    )}
                                </div>
                                {isEmailVerified && <span className={styles.verifiedBadge}><Check size={14} /> Verified</span>}

                                {showEmailOtpSpace && (
                                    <div className={styles.otpGroup}>
                                        <div className={styles.otpHeader}>
                                            <span>Enter OTP sent to your email</span>
                                        </div>
                                        <div className={styles.otpInputWrapper}>
                                            <input
                                                type="text"
                                                maxLength={4}
                                                placeholder="0000"
                                                value={emailOtp}
                                                onChange={(e) => setEmailOtp(e.target.value)}
                                            />
                                            <button type="button" className={styles.confirmOtpButton} onClick={confirmEmailOtp}>Confirm</button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="phoneNumber">Phone Number (Recovery)</label>
                                <div className={styles.inputWithAction}>
                                    <input
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        type="tel"
                                        placeholder="+966 5XX XXX XXXX"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        disabled={isPhoneVerified}
                                        required
                                    />
                                    {!isPhoneVerified && (
                                        <button type="button" className={styles.verifyButton} onClick={handleVerifyPhone}>
                                            Verify
                                        </button>
                                    )}
                                </div>
                                {isPhoneVerified && <span className={styles.verifiedBadge}><Check size={14} /> Verified</span>}

                                {showPhoneOtpSpace && (
                                    <div className={styles.otpGroup}>
                                        <div className={styles.otpHeader}>
                                            <span>Enter OTP sent to your phone</span>
                                        </div>
                                        <div className={styles.otpInputWrapper}>
                                            <input
                                                type="text"
                                                maxLength={4}
                                                placeholder="0000"
                                                value={phoneOtp}
                                                onChange={(e) => setPhoneOtp(e.target.value)}
                                            />
                                            <button type="button" className={styles.confirmOtpButton} onClick={confirmPhoneOtp}>Confirm</button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="password">Password</label>
                                <div className={styles.passwordWrapper}>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Min. 8 characters"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className={styles.toggleVisibility}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <div className={styles.passwordWrapper}>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Re-enter your password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className={styles.toggleVisibility}
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

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

                            <button type="submit" className={styles.submitButton} disabled={loading}>
                                {loading ? 'Creating Account...' : 'Create Account →'}
                            </button>

                            <div className={styles.divider}>
                                <span>OR</span>
                            </div>

                            <p className={styles.loginPrompt}>
                                Already have an account? <Link href="/login">Sign in</Link>
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
