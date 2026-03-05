import Image from 'next/image';
import Link from 'next/link';
import { Shield, Headphones, Database, BarChart3, Globe, Users } from 'lucide-react';
import styles from '../page.module.css';

export default function Home() {
  return (
    <div className={styles.landing}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={`container ${styles.heroContainer}`}>
          <div className={styles.heroContent}>
            <span className={styles.badge}>Professional Email Hosting</span>
            <h1 className={styles.heroTitle}>
              Professional Email Service for <br />
              <span className={styles.highlight}>Saudi Arabia</span>
            </h1>
            <p className={styles.heroDescription}>
              Reliable, encrypted, and scalable email hosting built for Saudi businesses
              and government-aligned enterprises.
            </p>
            <div className={styles.heroActions}>
              <Link href="/signup" className={styles.primaryButton}>
                Get Started Free <span className={styles.arrow}>→</span>
              </Link>
              <Link href="/login" className={styles.outlineButton}>
                Log In
              </Link>
            </div>
            <div className={styles.heroFooter}>
              <span>✓ No setup fees</span>
              <span>✓ 99.9% uptime SLA</span>
              <span>✓ Saudi-hosted servers</span>
            </div>
          </div>

          <div className={styles.heroCards}>
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
            </div>

            <div className={styles.statsHorizontal}>
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
            </div>
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

      {/* Footer Branding */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerBranding}>
            <Image src="/logo.png" alt="KSA Mail" width={100} height={100} />
            <p className={styles.footerText}>Professional email hosting for Saudi enterprises.</p>
            <Link href="mailto:support@ksamail.com" className={styles.footerEmail}>support@ksamail.com</Link>
          </div>
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
