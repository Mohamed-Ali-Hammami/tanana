"use client";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import WalletConnect from "../components/walletmanag";
import styles from "../styles/makepayment.module.css";
import { parseUnits } from "viem";

interface Transaction {
  to: string;
  value?: bigint;  
  data?: string;  
  gasLimit?: bigint; 
}



const ETH_RECIEVER_ADDRESS = process.env.NEXT_PUBLIC_RECEIVER_ADDRESS ?? "";
const USDT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_USDT_CONTRACT_ADDRESS ?? "";
const BTC_RECIEVER_ADDRESS = process.env.NEXT_PUBLIC_BTC_RECIEVER_ADDRESS ?? "";

interface MakePaymentButtonProps {
  paymentAmount: number;
  paymentMethod: "ETH" | "USDT" | "BTC";
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  disabled?: boolean;
  tanacoinRate: number;
}

const MakePaymentButton: React.FC<MakePaymentButtonProps> = ({
  paymentAmount,
  paymentMethod,
  setError,
  setLoading,
  disabled = false,
}) => {
  const { walletAddress, walletConnected, handleSendTransaction } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [transactionConfirmed, setTransactionConfirmed] = useState(false);

  // Get the correct receiver address based on the payment method
  const getReceiverAddress = (method: string) => {
    switch (method) {
      case "ETH":
        return ETH_RECIEVER_ADDRESS;
      case "USDT":
        return USDT_CONTRACT_ADDRESS;
      case "BTC":
        return BTC_RECIEVER_ADDRESS;
      default:
        return "";
    }
  };

  const receiverAddress = getReceiverAddress(paymentMethod);

  const estimateGasAndSend = async () => {
    try {
      // Estimating the gas here to show it before sending the transaction
      const estimatedGas = await handleSendTransaction({
        to: receiverAddress,
        value: parseUnits(paymentAmount.toString(), 18),
      });

      // Set the gas fee dynamically
      console.log("Estimated Gas:", estimatedGas);

      return estimatedGas;
    } catch (error) {
      console.error("Error estimating gas:", error);
      setError("Error estimating gas.");
      return null;
    }
  };
  const handlePayment = async () => {
    if (disabled) return;
  
    if (!walletConnected || !walletAddress) {
      console.error("Error: Wallet is not connected.");
      setError("Please connect your wallet first!");
      return;
    }
  
    if (!receiverAddress) {
      console.error("Error: Receiver address is not defined for the selected payment method.");
      setError("Receiver address is not available for the selected payment method.");
      return;
    }
  
    setIsProcessing(true);
    setLoading(true);
    setTransactionHash(null);
    setTransactionConfirmed(false);
  
    try {
      console.log(`Processing payment of ${paymentAmount} ${paymentMethod} to ${receiverAddress}`);
  
      const estimatedGas = await estimateGasAndSend();
  
      if (!estimatedGas) return;
  
      // Prepare the transaction
      let tx: Transaction;
      if (paymentMethod === "ETH") {
        tx = {
          to: receiverAddress,
          value: parseUnits(paymentAmount.toString(), 18), // Convert to Wei
          gasLimit: estimatedGas, // Set gas limit dynamically
        };
      } else if (paymentMethod === "USDT") {
        const usdtAmountInWei = paymentAmount * 1e6; // USDT has 6 decimals
        tx = {
          to: USDT_CONTRACT_ADDRESS,
          data: `0xa9059cbb${receiverAddress.slice(2)}${usdtAmountInWei.toString(16).padStart(64, "0")}`,
          gasLimit: estimatedGas, // Set gas limit dynamically
        };
      } else {
        console.error("BTC payments are not supported yet.");
        setError("BTC payments are not supported yet.");
        return;
      }
  
      console.log("Transaction prepared:", tx);
  
      // Send transaction and get the transaction hash
      const txResponse = await handleSendTransaction(tx);
    } 
     finally {
      setIsProcessing(false);
      setLoading(false);
    }
  };
  
  

  return (
    <div className={styles.paymentContainer}>
      {!walletConnected ? (
        <div>
          <p>Wallet not connected. Please connect your wallet.</p>
          <WalletConnect />
        </div>
      ) : (
        <button
          className={styles.paymentButton}
          onClick={handlePayment}
          disabled={isProcessing || disabled || transactionConfirmed}
        >
          {isProcessing ? "Processing..." : transactionConfirmed ? "Payment Confirmed" : "Make Payment"}
        </button>
      )}
      {transactionHash && (
        <div>
          <p>Transaction Hash: {transactionHash}</p>
          <a href={`https://etherscan.io/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">
            View on Etherscan
          </a>
        </div>
      )}
    </div>
  );
};

export default MakePaymentButton;
