"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Shield, Headphones, Database, BarChart3, Globe, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '../page.module.css';

const API_BASE = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_API_URL : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api');

// ─── Banner Data (replace with API integration) ──────
const BANNERS = [
  {
    id: 1,
    title: 'Professional Email Service for Saudi Arabia',
    subtitle: 'Reliable, encrypted, and scalable email hosting built for Saudi businesses and government-aligned enterprises.',
    buttonText: 'Get Started Free',
    buttonLink: '/signup',
    bgColor: 'linear-gradient(135deg, rgba(10, 88, 50, 0.82) 0%, rgba(13, 110, 63, 0.75) 100%)',
    image: '/hero-banner-1.png',
  },
  {
    id: 2,
    title: 'Enterprise-Grade Security & Compliance',
    subtitle: '256-bit AES encryption, TLS 1.3, and full data sovereignty compliance with Saudi regulations.',
    buttonText: 'Learn More',
    buttonLink: '/signup',
    bgColor: 'linear-gradient(135deg, rgba(6, 95, 70, 0.82) 0%, rgba(5, 150, 105, 0.75) 100%)',
    image: '/hero-banner-2.png',
  },
  {
    id: 3,
    title: 'Dedicated Arabic Support 24/7',
    subtitle: 'Get help when you need it from people who understand your business and speak your language.',
    buttonText: 'Contact Us',
    buttonLink: '/signup',
    bgColor: 'linear-gradient(135deg, rgba(13, 148, 136, 0.82) 0%, rgba(6, 95, 70, 0.75) 100%)',
    image: '/hero-banner-3.png',
  },
];

// ─── Ads Data (replace with API integration) ─────────
const SPONSOR_ADS = [
  {
    id: 1,
    title: 'Cloud Hosting Solutions',
    description: 'High-performance cloud infrastructure for businesses across the Kingdom. Scale seamlessly with enterprise-grade reliability.',
    image: '/ad-cloud.png',
    link: '#',
    sponsor: 'Saudi Cloud',
    bgColor: '#0f766e',
  },
  {
    id: 2,
    title: 'Business Communication Suite',
    description: 'Unified messaging, video conferencing, and collaboration tools designed for modern enterprises.',
    image: '/ad-comm.png',
    link: '#',
    sponsor: 'CommConnect',
    bgColor: '#065f46',
  },
  {
    id: 3,
    title: 'Cybersecurity Solutions',
    description: 'Advanced threat protection and compliance solutions built specifically for Saudi organizations.',
    image: '/ad-security.png',
    link: '#',
    sponsor: 'SecureNet KSA',
    bgColor: '#1e40af',
  },
];

const STRIP_ADS = [
  {
    id: 1,
    title: 'Cloud Enterprise Solutions',
    description: 'Scalable infrastructure for the Saudi Vision 2030 digital transformation.',
    image: '/ad-cloud.png',
    sponsor: 'KSA Cloud'
  },
  {
    id: 2,
    title: 'Secure Communication',
    description: 'End-to-end encrypted messaging and video for professional teams.',
    image: '/ad-comm.png',
    sponsor: 'CommConnect'
  },
  {
    id: 3,
    title: 'Advanced Cybersecurity',
    description: 'Protecting your data with local Saudi compliance and global standards.',
    image: '/ad-security.png',
    sponsor: 'SecureNet'
  },
  {
    id: 4,
    title: 'Managed IT Services',
    description: '24/7 expert support for your complete business technology stack.',
    image: '/hero-banner-3.png',
    sponsor: 'ITPro KSA'
  },
];

export default function Home() {
  // ─── Banner State ─────────────────────────────────────────
  const [banners, setBanners] = useState<any[]>(BANNERS);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  // Fetch Banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${API_BASE}/banners/active`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setBanners(data);
          }
        }
      } catch (err) {
        console.error("Failed to load dynamic banners:", err);
        // Fallback to static BANNERS is already set in state
      }
    };
    fetchBanners();
  }, []);

  const goToSlide = useCallback((index: number) => {
    setSlideDirection(index > currentBanner ? 'right' : 'left');
    setCurrentBanner(index);
  }, [currentBanner]);

  const goNext = useCallback(() => {
    setSlideDirection('right');
    setCurrentBanner(prev => (prev + 1) % banners.length);
  }, [banners.length]);

  const goPrev = useCallback(() => {
    setSlideDirection('left');
    setCurrentBanner(prev => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(goNext, 3000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, goNext]);

  const banner = banners[currentBanner];

  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const base = API_BASE || 'http://localhost:4000';
    if (url.startsWith('/uploads/')) return `${base.replace('/api', '')}${url}`;
    return url;
  };

  return (
    <div className={styles.landing}>
      {/* ═══════════════════════════════════════════════════════
          HERO SLIDER BANNER
          ═══════════════════════════════════════════════════════ */}
      <section
        className={styles.hero}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <div className={styles.heroSlider}>
          <div
            className={styles.heroTrack}
            style={{ transform: `translateX(-${currentBanner * 100}%)` }}
          >
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`${styles.heroSlide} ${index === currentBanner ? styles.heroSlideActive : ''}`}
                style={{ backgroundImage: `url(${getImageUrl(banner.image)})` }}
              >
                <div
                  className={styles.heroSlideOverlay}
                  style={{ background: 'none' }}
                ></div>

                <div className={`container ${styles.heroContainer}`}>
                  <div className={styles.heroContent}>
                    <span className={styles.badge}>Professional Email Hosting</span>
                    <h1 className={styles.heroTitle}>{banner.title}</h1>
                    <p className={styles.heroDescription}>{banner.subtitle}</p>
                    <div className={styles.heroActions}>
                      <Link href={banner.buttonLink} className={styles.primaryButton}>
                        {banner.buttonText} <span className={styles.arrow}>→</span>
                      </Link>
                      <a href={process.env.NEXT_PUBLIC_WEBMAIL_URL || "https://webmail.ksamail.com/"} className={styles.outlineButton}>
                        Log In
                      </a>
                    </div>
                    {/* <div className={styles.heroFooter}>
                      <span>✓ No setup fees</span>
                      <span>✓ 99.9% uptime SLA</span>
                      <span>✓ Saudi-hosted servers</span>
                    </div> */}
                  </div>

                  {/* <div className={styles.heroCards}>
                    <div className={styles.glassCard}>
                      <p className={styles.cardInfo}>TRUSTED BY LEADING COMPANIES</p>
                      <div className={styles.companyGrid}>
                        <div className={styles.companyItem}>
                          <div className={styles.logoBadge}>TC</div>
                          <span className={styles.companyName}>TechCorp</span>
                        </div>
                        <div className={styles.companyItem}>
                          <div className={styles.logoBadge}>GN</div>
                          <span className={styles.companyName}>GlobalNet</span>
                        </div>
                        <div className={styles.companyItem}>
                          <div className={styles.logoBadge}>DS</div>
                          <span className={styles.companyName}>DataSync</span>
                        </div>
                        <div className={styles.companyItem}>
                          <div className={styles.logoBadge}>CB</div>
                          <span className={styles.companyName}>CloudBase</span>
                        </div>
                      </div>
                    </div> */}

                  {/* <div className={styles.statsHorizontal}>
                      <div className={styles.statGlass}>
                        <div className={styles.statValue}>50K+</div>
                        <div className={styles.statLabel}>Active Users</div>
                      </div>
                      <div className={styles.statGlass}>
                        <div className={styles.statValue}>99.9%</div>
                        <div className={styles.statLabel}>Uptime</div>
                      </div>
                      <div className={styles.statGlass}>
                        <div className={styles.statValue}>24/7</div>
                        <div className={styles.statLabel}>Support</div>
                      </div>
                    </div> */}
                  {/* </div> */}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slider Controls */}
        <button
          className={`${styles.sliderArrow} ${styles.sliderArrowLeft}`}
          onClick={goPrev}
          aria-label="Previous banner"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          className={`${styles.sliderArrow} ${styles.sliderArrowRight}`}
          onClick={goNext}
          aria-label="Next banner"
        >
          <ChevronRight size={24} />
        </button>

        {/* Dots */}
        <div className={styles.sliderDots}>
          {banners.map((_, index) => (
            <button
              key={index}
              className={`${styles.sliderDot} ${index === currentBanner ? styles.sliderDotActive : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SPONSOR ADS SECTION
          ═══════════════════════════════════════════════════════ */}
      <section className={styles.sponsorAds}>
        <div className="container">
          <div className={styles.sponsorHeader}>
            <span className={styles.sectionBadge}>Our Partners</span>
            <h2 className={styles.sponsorTitle}>Trusted by Industry Leaders</h2>
          </div>

          <div className={styles.adsGrid}>
            {SPONSOR_ADS.map((ad) => (
              <a
                key={ad.id}
                href={ad.link}
                className={styles.adCard}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div
                  className={styles.adImageArea}
                  style={{ background: !ad.image ? ad.bgColor : undefined }}
                >
                  {ad.image && (
                    <Image
                      src={ad.image}
                      alt={ad.title}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  )}
                  <span className={styles.adSponsorTag}>Sponsored</span>
                  {!ad.image && (
                    <div className={styles.adPlaceholderIcon}>
                      {ad.sponsor.charAt(0)}{ad.sponsor.charAt(ad.sponsor.indexOf(' ') + 1) || ''}
                    </div>
                  )}
                </div>
                <div className={styles.adContent}>
                  <span className={styles.adSponsor}>{ad.sponsor}</span>
                  <h3 className={styles.adTitle}>{ad.title}</h3>
                  <p className={styles.adDescription}>{ad.description}</p>
                  <span className={styles.adArrow}>Learn more →</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>Why KSA Mail</span>
            <h2 className={styles.sectionTitle}>Everything You Need for Professional Email</h2>
          </div>

          <div className={styles.featureList}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Shield size={32} />
              </div>
              <div className={styles.featureInfo}>
                <h3>Secure & Encrypted</h3>
                <p>End-to-end encryption with TLS 1.3, advanced threat protection, and data sovereignty compliance. Your emails stay protected with enterprise-grade security protocols designed for sensitive business communications.</p>
                <span className={styles.featureCheck}>✓ 256-bit AES encryption</span>
              </div>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureInfo}>
                <h3>Local Saudi Support</h3>
                <p>Dedicated Arabic-speaking support team available around the clock. Get help when you need it from people who understand your business and speak your language.</p>
                <span className={styles.featureCheck}>✓ Arabic & English support</span>
              </div>
              <div className={styles.featureIcon}>
                <Headphones size={32} />
              </div>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Database size={32} />
              </div>
              <div className={styles.featureInfo}>
                <h3>Scalable Storage</h3>
                <p>Start with generous free storage and scale seamlessly as your business grows. Flexible upgrade options mean you only pay for what you need, with no hidden fees.</p>
                <span className={styles.featureCheck}>✓ Up to 50GB per mailbox</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reliability Section */}
      <section className={styles.reliability}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>Trust & Reliability</span>
            <h2 className={styles.sectionTitle}>Built for Reliability,<br />Designed for Saudi Arabia</h2>
          </div>

          <div className={styles.reliabilityGrid}>
            <div className={styles.reliabilityCard}>
              <div className={styles.reliabilityIcon}><BarChart3 /></div>
              <h3>99.9%</h3>
              <p>Guaranteed Uptime</p>
              <small>Industry-leading SLA</small>
            </div>
            <div className={styles.reliabilityCard}>
              <div className={styles.reliabilityIcon}><Globe /></div>
              <h3>KSA</h3>
              <p>Local Hosting</p>
              <small>Servers in Saudi Arabia</small>
            </div>
            <div className={styles.reliabilityCard}>
              <div className={styles.reliabilityIcon}><Headphones /></div>
              <h3>24/7</h3>
              <p>Support Available</p>
              <small>Arabic & English</small>
            </div>
            <div className={styles.reliabilityCard}>
              <div className={styles.reliabilityIcon}><Users /></div>
              <h3>2,847</h3>
              <p>Active Businesses</p>
              <small>Trusted across the Kingdom</small>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          HORIZONTAL AD STRIP
          ═══════════════════════════════════════════════════════ */}
      <section className={styles.adStripSection}>
        <div className={styles.adStripHeader}>
          <h3>Featured Partners</h3>
        </div>
        <div className={styles.adScrollingWrapper}>
          <div className={styles.adScrollingTrack}>
            {[...STRIP_ADS, ...STRIP_ADS].map((ad, index) => (
              <div key={`${ad.id}-${index}`} className={styles.adStripItem}>
                <Image
                  src={ad.image}
                  alt={ad.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
                <div className={styles.adBadgeStrip}>Sponsored</div>
                <div className={styles.adStripOverlay}>
                  <span>{ad.sponsor}</span>
                  <h4>{ad.title}</h4>
                  <p>{ad.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={`container`}>
          <div className={styles.ctaBox}>
            <h2>Ready to Get Your Professional Email?</h2>
            <p>Join thousands of Saudi professionals using KSA Mail for their business communications.</p>
            <Link href="/signup" className={styles.ctaButton}>
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerGrid}>
            {/* Brand Column */}
            <div className={styles.footerBrand}>
              <div className={styles.footerLogoRow}>
                <Image src="/logo.png" alt="KSA Mail" width={180} height={180} className={styles.footerLogo} />
              </div>
              <p className={styles.footerBrandDesc}>
                Professional, secure, and scalable email hosting built for Saudi businesses and government-aligned enterprises.
              </p>
              <div className={styles.footerSocials}>
                <a href="#" className={styles.socialIcon} aria-label="Twitter">𝕏</a>
                <a href="#" className={styles.socialIcon} aria-label="LinkedIn">in</a>
                <a href="#" className={styles.socialIcon} aria-label="Instagram">◉</a>
              </div>
            </div>

            {/* Quick Links */}
            <div className={styles.footerColumn}>
              <h4 className={styles.footerColumnTitle}>Quick Links</h4>
              <Link href="/signup" className={styles.footerLink}>Create Account</Link>
              <a href={process.env.NEXT_PUBLIC_WEBMAIL_URL || "https://webmail.ksamail.com/"} className={styles.footerLink}>Sign In</a>
              <Link href="#" className={styles.footerLink}>Privacy Policy</Link>
              <Link href="#" className={styles.footerLink}>Terms of Service</Link>
            </div>

            {/* Contact */}
            <div className={styles.footerColumn}>
              <h4 className={styles.footerColumnTitle}>Contact</h4>
              <Link href="mailto:support@ksamail.com" className={styles.footerLink}>support@ksamail.com</Link>
              <span className={styles.footerLink}>Riyadh, Saudi Arabia</span>
              <span className={styles.footerLink}>24/7 Support Available</span>
            </div>
          </div>

          <div className={styles.footerDivider}></div>

          <div className={styles.footerBottom}>
            <p>© 2026 KSA Mail. All rights reserved.</p>
            <div className={styles.footerLinks}>
              <Link href="#">Secure</Link>
              <span className={styles.separator}>•</span>
              <Link href="#">Reliable</Link>
              <span className={styles.separator}>•</span>
              <Link href="#">Professional</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
