"use client"
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/navbar.module.css';
import UserAvatarDropdown from '../components/loggs';
import ContactUsForm from './ContactUsForm';
import DashboardSidebar from './DashboardSidebar';

export default function Navbar() {
  const [contactFormOpen, setContactFormOpen] = useState(false);
  const toggleContactForm = () => setContactFormOpen(!contactFormOpen);


  return (
    <div className={styles.navbarContainer}>
      <nav className={styles.navbar}>
        <DashboardSidebar />

        {/* Logo Section */}
        <div className={styles.logo}>
          <Image src="/images/your-logo.png" alt="Logo" width={50} height={50} />
          <Image src="/images/export.png" alt="Tanacoin" width={100} height={50} />
        </div>
        
        {/* Menu Links */}
        <div className={styles.menu}>
          <Link href="/">Home</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/about_us">About</Link>

          {/* Contact Us */}
          <a onClick={(e) => { e.stopPropagation(); toggleContactForm(); }} className={styles.contactLink}>
            <div className={styles.iconWithText}>
              <Image src="/images/mail_icon.svg" alt="Mail Icon" width={20} height={20} />
              <span className={styles.mail_text}>Contact Us</span>
            </div>
          </a>

          {/* User Avatar Dropdown */}
          <UserAvatarDropdown />
        </div>
        {/* Modals and Forms */}
        {contactFormOpen && (
          <div className={styles.modalOverlay} onClick={toggleContactForm}>
            <div onClick={(e) => e.stopPropagation()}>
              <ContactUsForm onClose={() => setContactFormOpen(false)} />
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}