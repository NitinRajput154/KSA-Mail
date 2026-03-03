import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerContainer}`}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/logo.png"
            alt="KSA Mail Logo"
            width={80}
            height={80}
            className={styles.logoImage}
          />
        </Link>

        <nav className={styles.nav}>
          <Link href="/login" className={styles.loginLink}>Login</Link>
          <Link href="/signup" className={styles.signupButton}>Sign Up Free</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
