import React from 'react';
import styles from '../styles/modalscss.module.css'; // Adjust path as needed

interface Payment {
  payment_id: number;
  payment_amount: string;
  crypto_type: string;
  payment_transaction_hash: string;
  payment_date: string;
  payment_status: string;
}

interface PaymentsListProps {
  payments: Payment[];
}

const PaymentsList: React.FC<PaymentsListProps> = ({ payments }) => {
  if (payments.length === 0) {
    return <div className={styles['payments-list-container']}><p>No payments available.</p></div>;
  }

  return (
    <div className={styles['payments-list-container']}>
      <h2>Liste d&apos;achats de TNC</h2>
      <table className={styles['payments-list']}>
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>Amount</th>
            <th>Crypto Type</th>
            <th>Transaction Hash</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.payment_id}>
              <td>{payment.payment_id}</td>
              <td>{payment.payment_amount} {payment.crypto_type}</td>
              <td>
                <span className={`${styles['crypto-type']} ${styles[`crypto-type-${payment.crypto_type}`]}`}>
                  {payment.crypto_type}
                </span>
              </td>
              <td>
                <a>
                  {payment.payment_transaction_hash}
                </a>
              </td>
              <td>{new Date(payment.payment_date).toLocaleDateString()}</td>
              <td className={`${styles['status']} ${styles[`status-${payment.payment_status}`]}`}>
                {payment.payment_status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentsList;
