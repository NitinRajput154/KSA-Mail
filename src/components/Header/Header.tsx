import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerContainer}`}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/header-logo.png"
            alt="KSA Mail Logo"
            width={150}
            height={150}
            className={styles.logoImage}
          />
        </Link>

        <nav className={styles.nav}>
          <a href="https://webmail.ksamail.com/" className={styles.loginLink}>Login</a>
          <Link href="/signup" className={styles.signupButton}>Sign Up Free</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
