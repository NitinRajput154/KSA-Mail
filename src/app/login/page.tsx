"use client";

import { useState } from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import { Shield, Globe, Server, Check, Eye, EyeOff, ChevronLeft, Database, Lock } from 'lucide-react';
import styles from './login.module.css';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        console.log('Logging in with:', formData);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);
        alert('Login simulated successful!');
    };

    return (
        <div className={styles.loginPage}>
            <div className={styles.container}>
                {/* Left Side - Info */}
                <div className={styles.infoSide}>
                    <div className={styles.infoContent}>
                        <NextLink href="/" className={styles.logo}>
                            <Image src="/logo.png" alt="KSA Mail" width={80} height={80} />
                        </NextLink>

                        <h1 className={styles.infoTitle}>
                            Welcome back to your inbox.
                        </h1>
                        <p className={styles.infoText}>
                            Secure, professional email hosting trusted by thousands of businesses across Saudi Arabia.
                        </p>

                        <div className={styles.benefitList}>
                            <div className={styles.benefitItem}>
                                <div className={styles.benefitIcon}><Lock size={20} /></div>
                                <span>256-bit Encryption</span>
                            </div>
                            <div className={styles.benefitItem}>
                                <div className={styles.benefitIcon}><Server size={20} /></div>
                                <span>Local KSA Servers</span>
                            </div>
                            <div className={styles.benefitItem}>
                                <div className={styles.benefitIcon}><Shield size={20} /></div>
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

                {/* Right Side - Form */}
                <div className={styles.formSide}>
                    <NextLink href="/" className={styles.backLink}>
                        <ChevronLeft size={18} />
                        Back to home
                    </NextLink>

                    <div className={styles.formContainer}>
                        <div className={styles.formHeader}>
                            <h2>Sign In</h2>
                            <p>Enter your credentials to access your account</p>
                        </div>

                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="email">Email Address</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="password">Password</label>
                                <div className={styles.passwordWrapper}>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
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

                            <div className={styles.formFooter}>
                                <label className={styles.rememberMe}>
                                    <input
                                        type="checkbox"
                                        name="rememberMe"
                                        checked={formData.rememberMe}
                                        onChange={handleChange}
                                    />
                                    <span>Remember me</span>
                                </label>
                                <NextLink href="/forgot-password" className={styles.forgotPassword}>
                                    Forgot password?
                                </NextLink>
                            </div>

                            <button type="submit" className={styles.submitButton} disabled={loading}>
                                {loading ? 'Signing In...' : 'Sign In'}
                            </button>

                            <div className={styles.divider}>
                                <span>Don't have an account? <NextLink href="/signup">Create one free</NextLink></span>
                            </div>
                        </form>
                    </div>

                    <p className={styles.legalFooter}>
                        By signing in, you agree to our <NextLink href="/terms">Terms of Service</NextLink> and <NextLink href="/privacy">Privacy Policy</NextLink>.
                    </p>
                </div>
            </div>
        </div>
    );
}
