"use client";

import { useState } from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import { Shield, Server, Eye, EyeOff, ChevronLeft, Lock } from 'lucide-react';
import styles from '@/app/(website)/login/login.module.css';

const API_BASE = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_API_URL : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000');

export default function AdminLogin() {
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

        try {
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'true' === 'true' ? 'include' : 'same-origin',
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Quick check if the returned user is an admin
            if (data.user?.role !== 'ADMIN') {
                throw new Error('Access Denied. You are not an administrator.');
            }

            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('access_token', data.access_token);
            // Explicitly set the token on the frontend domain so NextJs middleware can process it
            const secureFlag = window.location.protocol === 'https:' ? 'Secure;' : '';
            document.cookie = `access_token=${data.access_token}; path=/; max-age=3600; ${secureFlag} SameSite=Lax`;
            
            alert(`Welcome back, Admin ${data.user.name}!`);
            window.location.href = '/admin'; // Redirect to admin panel
        } catch (error: any) {
            alert(`Admin Login Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.loginPage}>
            <div className={styles.container}>
                {/* Left Side - Info */}
                <div className={styles.infoSide}>
                    <div className={styles.infoContent}>
                        <NextLink href="/" className={styles.logo}>
                            <Image src="/logo.png" alt="KSA Mail" width={150} height={150} className={styles.logoImg} />
                        </NextLink>

                        <h1 className={styles.infoTitle}>
                            KSA Mail Admin Portal
                        </h1>
                        <p className={styles.infoText}>
                            Restricted access for authorized personnel only. Manage infrastructure, users, and organization settings.
                        </p>

                        <div className={styles.benefitList}>
                            <div className={styles.benefitItem}>
                                <div className={styles.benefitIcon}><Lock size={20} /></div>
                                <span>Advanced Security Control</span>
                            </div>
                            <div className={styles.benefitItem}>
                                <div className={styles.benefitIcon}><Server size={20} /></div>
                                <span>Infrastructure Management</span>
                            </div>
                            <div className={styles.benefitItem}>
                                <div className={styles.benefitIcon}><Shield size={20} /></div>
                                <span>Audit & Compliance Logs</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.infoOverlay}></div>
                </div>

                {/* Right Side - Form */}
                <div className={styles.formSide}>
                    <NextLink href="/" className={styles.backLink}>
                        <ChevronLeft size={18} />
                        Back to main site
                    </NextLink>

                    <div className={styles.formContainer}>
                        <div className={styles.formHeader}>
                            <h2>Admin Access</h2>
                            <p>Enter your administrative credentials</p>
                        </div>

                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="email">Admin Email (or Username)</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="text"
                                    placeholder="admin@ksamail.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="password">Security Key / Password</label>
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
                                    <span>Remember my session</span>
                                </label>
                            </div>

                            <button type="submit" className={styles.submitButton} disabled={loading}>
                                {loading ? 'Logging In...' : 'Login'}
                            </button>
                        </form>
                    </div>

                    <p className={styles.legalFooter}>
                        Unauthorized access is strictly prohibited. Activity is logged.
                    </p>
                </div>
            </div>
        </div>
    );
}
