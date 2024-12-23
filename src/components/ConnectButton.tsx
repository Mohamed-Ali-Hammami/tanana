"use client";
import React from "react";
import { useAppKit, useAppKitAccount, useDisconnect } from "@reown/appkit/react";

const WalletConnect = () => {
  const { address, isConnected } = useAppKitAccount();
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();

  const handleConnectWallet = async () => {
    try {
      await open();
      if (isConnected && address) {
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet. Please try again.");
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      alert("Failed to disconnect wallet. Please try again.");
    }
  };

  return (
    <div>
      <div>
          <button onClick={handleDisconnect}>Disconnect Wallet</button>
          <button onClick={handleConnectWallet}>Connect Wallet</button>
      </div>

      <div>
        
          <div>Connected Address: </div>
          <div>
            Not connected yet, please click the button above to connect your wallet.
          </div>
      </div>
    </div>
  );
};

export default WalletConnect;