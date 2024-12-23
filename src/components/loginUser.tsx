import React, { useState } from "react";
import styles from "../styles/registerstyles.module.css";
import { useAuth } from '../context/AuthContext';

interface LoginProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void; 
}

const Login: React.FC<LoginProps> = ({ isOpen, onClose }) => {
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [loading, setIsLoading] = useState(false);
  const { loginWithCredentials } = useAuth(); // Using AuthContext
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    wallet_connect: false,
    wallet_address: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.wallet_connect) {
      try {
        setIsLoading(true);
        await loginWithCredentials({
          identifier: formData.identifier,
          password: formData.password,
        });
      } catch (error) {
        setErrorMessages((prev) => [...prev, "Login failed."]);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Handle wallet login, e.g., by redirecting to the dashboard if wallet is connected.
      window.location.href = "/dashboard";
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.container}>
    <button className={styles.closeBtn} onClick={onClose}>X</button>
      {loading && (
        <div className={styles.overlay}>
          <div className={styles.spinner}></div>
        </div>
      )}

      <div className={styles.formContainer}>

        <h1>Login</h1>
        {errorMessages.map((msg, idx) => (
          <p key={idx} className={styles.errorMessage}>
            {msg}
          </p>
        ))}

        <form onSubmit={handleSubmit}>
          {!formData.wallet_connect && (
            <>
              <div className={styles.inputGroup}>
                <label htmlFor="identifier">Username or Email:</label>
                <input
                  placeholder="Username/Email"
                  type="text"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="password">Password:</label>
                <input
                  placeholder="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className={styles.submitBtn}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
