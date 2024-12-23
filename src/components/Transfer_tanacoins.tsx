import React, { useState } from 'react';
import styles from '../styles/modalscss.module.css'; 

const TransferTanacoinForm: React.FC = () => {
  const [recipientWalletId, setRecipientWalletId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!recipientWalletId || !amount) {
      setErrorMessage('Please provide both recipient ID and amount.');
      return;
    }

    const token = localStorage.getItem('token'); // Retrieve token from local storage

    if (!token) {
      setErrorMessage('Authentication token is missing.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`${apiUrl}/dashboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify({
          action: 'transfer',
          recipient_tnc_wallet_id: recipientWalletId,
          amount: parseFloat(amount),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage(result.message); // Show success message on success
      } else {
        setErrorMessage(result.error || 'An error occurred during the transfer.');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('An unexpected error occurred while processing the transfer.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Transfer Tanacoin</h3>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="recipientWalletId" className={styles.label}>
            TNC wallet address:
          </label>
          <input
            id="recipientWalletId"
            type="text"
            value={recipientWalletId}
            onChange={(e) => setRecipientWalletId(e.target.value)}
            placeholder="Recipient ID"
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="amount" className={styles.label}>
            Amount:
          </label>
          <input
            id="amount"
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount to transfer"
            className={styles.input}
          />
        </div>

        <button type="submit" className={styles.submitButton} disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Transfer Tanacoin'}
        </button>
      </form>

      {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
      {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
    </div>
  );
};

export default TransferTanacoinForm;
