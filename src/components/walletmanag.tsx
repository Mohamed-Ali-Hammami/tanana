"use client";
import React from "react";
import { useAppKit, useAppKitAccount, useDisconnect } from "@reown/appkit/react";
import { useAuth } from "../context/AuthContext";

const WalletConnect = () => {
  const { address, isConnected } = useAppKitAccount();
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();
  const {
    walletConnected,
    setWalletConnected,
    walletAddress,
    setWalletAddress,
    
  } = useAuth();

  const handleConnectWallet = async () => {
    try {
      await open();
      if (isConnected && address) {
        if (!walletConnected) {
          setWalletAddress(address);
          setWalletConnected(true);
        }
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet. Please try again.");
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      if (walletConnected) {
        setWalletAddress(undefined);
        setWalletConnected(false);
      }
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      alert("Failed to disconnect wallet. Please try again.");
    }
  };

  return (
    <div>
      <div>
        {walletConnected ? (
          <button onClick={handleDisconnect}>Disconnect Wallet</button>
        ) : (
          <button onClick={handleConnectWallet}>Connect Wallet</button>
        )}
      </div>

      <div>
        {walletAddress ? (
          <div>Connected Address: {walletAddress}</div>
        ) : (
          <div>
            Not connected yet, please click the button above to connect your wallet.
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletConnect;