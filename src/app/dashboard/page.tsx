"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { TfiAlignJustify } from "react-icons/tfi";
import { FiArrowDown } from "react-icons/fi";
import TransferTanacoinForm from "../../components/Transfer_tanacoins";
import RetrieveTanacoinForm from "../../components/Retrieve_tanacoins";
import GiftsTanacoinForm from "../../components/Gifts_tanacoins";
import PurchaseToken from "../../components/purchase_token";
import TransactionsList from "../../components/TransactionsList";
import PaymentsList from "../../components/PaymentsList";
import { UpdateData } from '../../../src/utils/types';
import { updateUserDetails } from '../../../src/utils/UpdateUserDetails';
import CombinedForm from '../../components/CombinedForm';
import "./dashboardcss.css";

interface UserData {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  profile_picture: string | null;
  tnc_wallet_id: string;
  user_id: number;
  created_at: string;
}

interface WalletData {
  balance: string;
  tnc_wallet_unique_id: string;
  wallet_created_at: string;
  tnc_wallet_id: string | null;
}

interface Transaction {
  transaction_id: number;
  amount: string;
  transaction_date: string;
  status: string;
  recipient_tnc_wallet_id: string;
}

interface Payment {
  payment_id: number;
  payment_amount: string;
  crypto_type: string;
  payment_transaction_hash: string;
  payment_date: string;
  payment_status: string;
}

const Dashboard = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedAction, setSelectedAction] = useState<'changePassword' | 'changeUsername' | 'changeEmail' | 'changeProfilePicture' | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState<boolean>(false); // State to control modal visibility
  const [showProfileActions, setShowProfileActions] = useState<boolean>(false);
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleClose = () => {
    setSelectedAction(null);
  };

  const toggleProfileActions = () => {
    setShowProfileActions((prevState) => !prevState);
  };

  const getSessionToken = () => localStorage.getItem("token");

  const handleActionSelect = (action: 'changePassword' | 'changeUsername' | 'changeEmail' | 'changeProfilePicture') => {
    setSelectedAction(prevAction => (prevAction === action ? null : action));
  };

  const handleUpdate = async (updateData: UpdateData) => {
    const token = localStorage.getItem('token') || '';
    try {
      const response = await updateUserDetails(updateData, token);
      if (response.success) {
        setUserData(prevData => {
          if (!prevData) return null;

          return {
            ...prevData,
            ...(updateData.username && { username: updateData.username }),
            ...(updateData.email && { email: updateData.email }),
            ...(updateData.profilePicture && { 
              profile_picture: typeof updateData.profilePicture === 'string' 
                ? updateData.profilePicture 
                : URL.createObjectURL(updateData.profilePicture)
            }),
          };
        });
        alert('User details updated successfully!');
      } else {
        alert(`Error: ${response.message}`);
      }
    } catch (error) {
      console.error("Failed to update user details:", error);
      alert("An error occurred while updating your details. Please try again.");
    } finally {
      setSelectedAction(null);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = getSessionToken();
      if (!token) return;

      try {
        const response = await fetch(`${apiUrl}/dashboard/data`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const data = await response.json();
        setUserData(data.user_data[0]);
        setWalletData(data.wallet_data[0]);
        setTransactions(data.transactions || []);
        setPayments(data.payments || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  let profilePictureSrc = '';

  if (userData?.profile_picture) {
    const base64Prefix = 'data:image/jpeg;base64,';
    if (userData.profile_picture.startsWith('dataimage/jpegbase64')) {
      profilePictureSrc = userData.profile_picture.replace('dataimage/jpegbase64', base64Prefix);
    } else {
      profilePictureSrc = base64Prefix + userData.profile_picture;
    }
  }
  useEffect(() => {
    if (activeTab === "purchase" && !isPurchaseModalOpen) {
      setIsPurchaseModalOpen(true);
    }
  }, [activeTab, isPurchaseModalOpen]);
  const renderContent = () => {
    switch (activeTab) {
      case "transactions":
        return (
          <div className="tab-container">
            <button className="close-button" onClick={() => setActiveTab("")}>
              ×
            </button>
            <TransactionsList transactions={transactions} />
          </div>
        );
      case "payments":
        return (
          <div className="tab-container">
            <button className="close-button" onClick={() => setActiveTab("")}>
              ×
            </button>
            <PaymentsList payments={payments} />
          </div>
        );
      case "transfert":
        return (
          <div className="tab-container">
            <button className="close-button" onClick={() => setActiveTab("")}>
              ×
            </button>
            <TransferTanacoinForm />
          </div>
        );
      case "retrieve":
        return (
          <div className="tab-container">
            <button className="close-button" onClick={() => setActiveTab("")}>
              ×
            </button>
            <RetrieveTanacoinForm />
          </div>
        );
      case "Gifts":
        return (
          <div className="tab-container">
            <button className="close-button" onClick={() => setActiveTab("")}>
              ×
            </button>
            <GiftsTanacoinForm />
          </div>
        );
        case "purchase":
          return (
            <div className="tab-container">
              <button className="close-button" onClick={() => { setActiveTab(""); setIsPurchaseModalOpen(false); }}>
                ×
              </button>
              <div className="purchase-container">
                <h2>Purchase Tanacoin</h2>
                {/* Include PurchaseToken inside purchase-container */}
                <PurchaseToken 
                  isOpen={isPurchaseModalOpen} 
                  setIsPurchaseModalOpen={setIsPurchaseModalOpen} 
                />
              </div>
            </div>
          );
        default:
          return null;
      }
    };

  if (loading) return <div>Loading...</div>;

  if (!userData || !walletData) return <div>No user or wallet data found. Please log in.</div>;

  return (
    <div className="container-dashboard">
      <header className="header">
        <div className="logo-section">
          <Image className="tanacoin" src="/images/export.png" alt="Tanacoin" width={150} height={80} />
        </div>
        <h1>Dashboard {userData.username}</h1>
        <Image className="logo" src="/images/your-logo.png" alt="Logo" width={120} height={100} />
      </header>

      <main className="main-content">


        <section className="profile">
          <div className="profile-picture-wrapper">
            {profilePictureSrc ? (
              <Image
                src={profilePictureSrc}
                alt={`${userData.username}'s profile picture`}
                width={150}
                height={150}
                className="profile-image"
                unoptimized
              />
            ) : (
              <div className="no-profile-picture">No Profile Picture Available</div>
            )}
          </div>
          <div className="user-details">
            <p><strong className="strong">First name:</strong> {userData.first_name}</p>
            <p><strong className="strong">Last name:</strong> {userData.last_name}</p>
            <p><strong className="strong">Email:</strong> {userData.email}</p>
            <p><strong className="strong">TNC Address:</strong> {userData.tnc_wallet_id}</p>
          </div>
          <section>
          <section className="balance-container">
          <div className="balance-box">
            <h3>Balance</h3>
            <p>{walletData?.balance} TNC</p>
          </div>
        </section>
        <button title="profile action"
            className="toggle-profile-actions-button"
            onClick={toggleProfileActions}
          >
            <div className="icon-container">
              <FiArrowDown className={`icon ${showProfileActions ? 'visible' : 'hidden'}`} size={24} />
              <TfiAlignJustify className={`icon ${showProfileActions ? 'hidden' : 'visible'}`} size={24} />
            </div>
          </button>

        </section>
        </section>



        {showProfileActions && (
          <section>
            <div className="profile-buttons-container">
              <button className="action-button" onClick={() => handleActionSelect('changeUsername')}>Change Username</button>
              <button className="action-button" onClick={() => handleActionSelect('changeEmail')}>Change Email</button>
              <button className="action-button" onClick={() => handleActionSelect('changePassword')}>Change Password</button>
              <button className="action-button" onClick={() => handleActionSelect('changeProfilePicture')}>Update Profile Picture</button>
            </div>
          </section>
        )}

        <section>
          <div className="form-container">

            {selectedAction && (
          <div>
          <button className="close-button-two" onClick={handleClose}>
            ×
          </button>
            <CombinedForm
              action={selectedAction}
              onUpdate={handleUpdate}
              onClose={handleClose}
            />
          </div>
            )}
          </div>
        </section>

      <section className="tabs">
        {["transactions", "payments", "transfert", "purchase", "retrieve", "Gifts"].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "tab active" : "tab"}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1).replace("_", " ")}
          </button>
        ))}
      </section>

        <section className="tab-content">{renderContent()}</section>
      </main>
    </div>
  );
};

export default Dashboard;
