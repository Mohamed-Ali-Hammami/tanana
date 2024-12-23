"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react"; // Import useCallback
import { useSendTransaction, UseSendTransactionReturnType } from "wagmi";
import { useEstimateGas } from "wagmi";
import { jwtDecode } from "jwt-decode";
import { useAppKitAccount } from "@reown/appkit/react";
import { type Address, parseUnits } from "viem";

/** Interfaces **/
interface DecodedToken {
  exp: number;
  user_id?: number;
  role?: string;
}

interface Transaction {
  to: string;
  value?: bigint;  // ETH transactions
  data?: string;   // For USDT token transfers
  gasLimit?: bigint; // Gas limit for the transaction
}


interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  isSuperuser: boolean;
  setIsSuperuser: React.Dispatch<React.SetStateAction<boolean>>;
  user?: DecodedToken;
  setUser: React.Dispatch<React.SetStateAction<DecodedToken | undefined>>;
  token?: string;
  setToken: React.Dispatch<React.SetStateAction<string | undefined>>;
  walletConnected: boolean;
  setWalletConnected: React.Dispatch<React.SetStateAction<boolean>>;
  walletAddress?: string;
  setWalletAddress: React.Dispatch<React.SetStateAction<string | undefined>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loginWithCredentials: (formData: Record<string, unknown>) => Promise<void>;
  logout: () => void;
  sendTransaction?: UseSendTransactionReturnType['sendTransaction']; 
  estimateGas?: bigint | undefined;
  handleSendTransaction: (transaction: Transaction) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [user, setUser] = useState<DecodedToken | undefined>();
  const [token, setToken] = useState<string | undefined>();
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const { address, isConnected } = useAppKitAccount();
  const { sendTransaction } = useSendTransaction(); // This is the hook providing sendTransaction
  const { data: gas } = useEstimateGas({ to: "0xAddressHere" as Address, value: parseUnits("0.01", 18) });

  const setWalletState = useCallback((connected: boolean, address?: string) => {
    // Only update the state if the values are different
    if (walletConnected !== connected || walletAddress !== address) {
      setWalletConnected(connected);
      setWalletAddress(address || undefined);

      const CHAINID = 1;
      const userAddress = address || "";

      if (isLoggedIn) {
        if (connected) {
          console.log("Wallet connected with address:", userAddress);
          connectWithoutApiHandler(userAddress);
        }
      } else {
        if (connected) {
          console.log("Wallet is connected but user is not logged in.");
          connectWithApiHandler(userAddress, CHAINID);
        } else {
          console.log("Wallet is disconnected.");
        }
      }
    }
  }, [walletConnected, walletAddress, isLoggedIn]);
  /** Utility Functions **/
  const getLocalStorageItem = (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error accessing localStorage key "${key}":`, error);
      return null;
    }
  };

  const setLocalStorageItem = (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  const removeLocalStorageItem = (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };
  useEffect(() => {
    const storedToken = getLocalStorageItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode<DecodedToken>(storedToken);
        if (decoded.exp * 1000 > Date.now()) {
          setIsLoggedIn(true);
          setUser(decoded);
          setIsSuperuser(decoded.role === "superuser");
          setToken(storedToken);
        } else {
          removeLocalStorageItem("token");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        removeLocalStorageItem("token");
      }
    }

    if (isConnected !== walletConnected || address !== walletAddress) {
      setWalletState(isConnected, address);
    }
  }, [isConnected, address, walletConnected, walletAddress, setWalletState]);

  const loginWithCredentials = async (formData: Record<string, unknown>) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");
      setLocalStorageItem("token", data.token);
      setToken(data.token);
      const decoded = jwtDecode<DecodedToken>(data.token);
      setIsLoggedIn(true);
      setUser(decoded);
      setIsSuperuser(decoded.role === "superuser");
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };
  const connectWithApiHandler = async (walletAddress: string, chainId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/connect_wallet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet_address: walletAddress, chain_id: chainId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Wallet connection failed");
      setLocalStorageItem("token", data.token);
      const decoded = jwtDecode<DecodedToken>(data.token);
      setIsLoggedIn(true);
      setUser(decoded);
      setIsSuperuser(decoded.role === "superuser");
      window.location.href = data.is_superuser ? "/superuser_dashboard" : "/dashboard";
    } catch (error) {
      console.error("Error connecting wallet with API:", error);
    }
  };

  const connectWithoutApiHandler = async (walletAddress: string) => {
    try {
      const storedToken = getLocalStorageItem("token")
      if (!storedToken) throw new Error("Session token is missing.");

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({ wallet_address: walletAddress, action: "add_wallet" }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to update wallet on the server.");

      console.log("Wallet updated successfully:", result.message);
      // Instead of reloading, update the state directly.
      setWalletAddress(walletAddress);
      setWalletConnected(true);
    } catch (error) {
      console.error("Error adding wallet to server:", error);
      alert("Error adding wallet. Please try again.");
    }
  };

  const logout = () => {
    removeLocalStorageItem("token");
    setIsLoggedIn(false);
    setIsSuperuser(false);
    setUser(undefined);
    setToken(undefined);
    setWalletConnected(false);
    setWalletAddress(undefined);
  };

  const handleSendTransaction = async (transaction: Transaction) => {
    if (!sendTransaction || !isConnected) {
      alert("Transaction cannot be sent. Please connect your wallet.");
      return;
    }

    try {
      // Ensure 'to' is a valid Ethereum address format
      const toAddress = transaction.to.startsWith('0x') ? transaction.to : `0x${transaction.to}`;

      // Type assertion to ensure 'toAddress' matches '0x${string}'
      const typedToAddress: `0x${string}` = toAddress as `0x${string}`;

      const txResponse = await sendTransaction({
        to: typedToAddress, // Corrected address format with type assertion
        value: transaction.value, // Transaction value
      });
      return txResponse;
    } catch (error) {
      console.error("Error sending transaction:", error);
      alert("Transaction failed. Please try again.");
    }
  };

  /** Provider **/
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        isSuperuser,
        setIsSuperuser,
        user,
        setUser,
        token,
        setToken,
        walletConnected,
        setWalletConnected,
        walletAddress,
        setWalletAddress,
        loading,
        setLoading,
        loginWithCredentials,
        logout,
        sendTransaction,
        estimateGas: gas,
        handleSendTransaction,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
