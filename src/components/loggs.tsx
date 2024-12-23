'use client';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/loggs.module.css';
import RegistrationForm from '../components/registerUser';
import Login from '../components/loginUser';
import WalletConnect from "@/components/walletmanag";

const UserAvatarDropdown: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<"login" | "signup" | "none">("none");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn, walletConnected, logout } = useAuth();

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
    if (activeModal !== "none") setActiveModal("none");
  };

  const handleLogoutClick = () => {
    logout();
    setDropdownOpen(false);
  };


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`${styles.profileContainer} ${dropdownOpen ? styles['dropdown-active'] : ''}`}>
      <div className={styles.iconWithText} role="button" tabIndex={0} onClick={toggleDropdown} onKeyDown={(e) => e.key === 'Enter' && toggleDropdown()}>
        <Image
          src="/images/user-avatar.svg"
          alt="User  Avatar"
          className={styles['user-avatar']}
          width={40}
          height={40}
          aria-label="User  avatar dropdown"
        />
        <span className={styles.avatar_text}>
          {isLoggedIn || walletConnected ? 'Logout' : 'Login/Register'}
        </span>
      </div>
      {dropdownOpen && (
        <div className={styles['dropdown-menu']}>
          {isLoggedIn || walletConnected ? (
            <div className={styles.dropdownItemLogout} onClick={handleLogoutClick}>
              Logout
            </div>
          ) : (
            <>
              <div onClick={() => setActiveModal("signup")} className={styles.dropdownItemRegister}>
                Register
              </div>
              <div onClick={() => setActiveModal("login")} className={styles.dropdownItemLogin}>
                Log In
              </div>
            </>
          )}
          <WalletConnect></WalletConnect>
        </div>
      )}
      {activeModal !== "none" && (
        <div className={styles.overlay} onClick={() => setActiveModal("none")}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            {activeModal === "signup" && <RegistrationForm onClose={() => setActiveModal("none")} isOpen={true} setIsOpen={() => {}} />}
            {activeModal === "login" && <Login onClose={() => setActiveModal("none")} isOpen={true} setIsOpen={() => {}} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAvatarDropdown;