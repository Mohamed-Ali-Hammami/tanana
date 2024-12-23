import React from 'react';
import styles from '../styles/modalscss.module.css'; // Adjust path as needed

interface Transaction {
  transaction_id: number;
  amount: string;
  transaction_date: string;
  status: string;
  recipient_tnc_wallet_id: string;
}

interface TransactionsListProps {
  transactions: Transaction[];
}

const TransactionsList: React.FC<TransactionsListProps> = ({ transactions }) => {
  if (transactions.length === 0) {
    return <p>No transactions available.</p>;
  }

  return (
    <div className={styles['transactions-list-container']}>
      <h2>Transactions List</h2>
      <table className={styles['transactions-list']}>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
            <th>Recipient Wallet ID</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.transaction_id}>
              <td>{transaction.transaction_id}</td>
              <td>{transaction.amount}</td>
              <td>{new Date(transaction.transaction_date).toLocaleDateString()}</td>
              <td>
                <span className={`${styles['status']} ${styles[`status-${transaction.status.toLowerCase()}`]}`}>
                  {transaction.status}
                </span>
              </td>
              <td>{transaction.recipient_tnc_wallet_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsList;
