"use client";
import React, { useEffect, useState } from "react";
import Login from "../components/loginUser";
import RegisterUser from "../components/registerUser";
import { useAuth } from '../context/AuthContext';
import PurchaseToken from "../components/purchase_token";
import WalletConnect from "@/components/walletmanag";

// Type for countdown state
interface Countdown {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

const HomePage: React.FC = () => {
  const [tanacoinData, setTanacoinData] = useState<{
    totalSupply: string;
    tanacoinRate: string;
    tanacoinsSold: string;
  }>({
    totalSupply: "Loading...",
    tanacoinRate: "Loading...",
    tanacoinsSold: "Loading...",
  });
  const [countdown, setCountdown] = useState<Countdown>({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const { isLoggedIn, walletConnected } = useAuth();
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState<boolean>(false);

  const fetchTanacoinData = async () => {
    try {
      // Making all API calls in parallel using Promise.all
      const [priceData, soldData, totalSupplyData] = await Promise.all([
        fetch(`${apiUrl}/tanacoin-info?type=price`),
        fetch(`${apiUrl}/tanacoin-info?type=sold`),
        fetch(`${apiUrl}/tanacoin-info?type=totalSupply`)
      ]);

      // Check if all the responses are OK
      if (!priceData.ok || !soldData.ok || !totalSupplyData.ok) {
        throw new Error("One or more API calls failed");
      }

      // Parse all responses concurrently
      const [priceJson, soldJson, totalSupplyJson] = await Promise.all([
        priceData.json(),
        soldData.json(),
        totalSupplyData.json()
      ]);

      // Setting the state based on the fetched data
      setTanacoinData({
        totalSupply: totalSupplyJson.totalSupply || "Unavailable",
        tanacoinRate: priceJson.price || "Unavailable",
        tanacoinsSold: soldJson.tanacoinsSold || "Unavailable",
      });
    } catch (error) {
      console.error("Error fetching Tanacoin data:", error);
      setTanacoinData({
        totalSupply: "Error loading supply.",
        tanacoinRate: "Error loading price.",
        tanacoinsSold: "Error loading sold tokens.",
      });
    }
  };

  useEffect(() => {
    fetchTanacoinData();

    const launchDate = new Date("April 3, 2025 00:00:00").getTime();
    const countdownTimer = setInterval(() => {
      const now = new Date().getTime();
      const timeLeft = launchDate - now;

      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      setCountdown({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });

      if (timeLeft < 0) {
        clearInterval(countdownTimer);
        setCountdown({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
        });
      }
    }, 1000);

    return () => clearInterval(countdownTimer);
  }, []);



  return (
    <div className="main-container">

                {/* Background Image */}
    <div className="hero-background-image"></div>

        {/* Hero Section */}
        <header className="hero-container">

          {/* Hero Content */}
          <div className="hero-content">
            <h1 className="hero-title">Welcome to the Future with Tanacoin!</h1>
            <p className="hero-description">
              Join the decentralized revolution! Tanacoin offers transparency, security, and unparalleled potential. Enjoy exclusive discounts of <span className="highlight-text">-25%</span> every weekend.
            </p>
            <p className="cta-description">
              Sign up, log in, or connect your wallet to start your journey into the blockchain future.
            </p>
            
            {/* Authentication Buttons */}
            <div className="auth-buttons">
              {isLoggedIn || walletConnected ? (
              <div>
                <h2>Purchase Tanacoin</h2>
                <button onClick={() => setIsPurchaseModalOpen(true)}>Open Purchase Modal</button>
                <PurchaseToken isOpen={isPurchaseModalOpen} setIsPurchaseModalOpen={setIsPurchaseModalOpen} />
              </div>  
              ) : (
                <>
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="cta-button"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setIsRegisterModalOpen(true)}
                    className="cta-button"
                  >
                    Register
                  </button>
                  
                </>
                
              )}
              <WalletConnect></WalletConnect>
            </div>
            
          </div>
        </header>
        
      {/* Our Story Section */}
      <section className="story-container">
        <div className="story-content">
          <h2>The Tanacoin Journey</h2>
          <div className="story-narrative">
            <div className="story-chapter">
              <h3>Origins</h3>
              <p>
                Born from the vision of blockchain pioneers, Tanacoin emerged as a solution to the limitations of traditional financial systems. 
                Our founders recognized the need for a truly decentralized, transparent, and accessible cryptocurrency that empowers individuals worldwide.
              </p>
            </div>
            <div className="story-chapter">
              <h3>Mission</h3>
              <p>
                We&apos;re not just creating a cryptocurrency; we&apos;re building a financial ecosystem that breaks down barriers, eliminates intermediaries, 
                and provides equal financial opportunities to everyone, regardless of geographical or economic constraints.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Token Details Section */}
      <section id="details" className="token-details-container">
        <div className="token-info">
          <h2>Why Choose Tanacoin?</h2>
          <p className="token-description">
            Tanacoin is your gateway to a revolutionary blockchain economy. With an early investment, you secure your future in a decentralized and transparent world.
          </p>
          <div className="token-stats-grid">
            <div className="stat-card">
              <h3>Total Supply</h3>
              <p>{tanacoinData.totalSupply} TNC</p>
            </div>
            <div className="stat-card">
              <h3>Pre-sale Price</h3>
              <p>${tanacoinData.tanacoinRate} per token</p>
            </div>
            <div className="stat-card">
              <h3>Tokens Sold</h3>
              <p>{tanacoinData.tanacoinsSold}</p>
            </div>
          </div>
          <span className="cta-description">
            Don&apos;t wait! Be among the first to own Tanacoin and benefit from pre-sale advantages.
          </span>
        </div>
      </section>
  
      {/* Technology Breakdown Section */}
      <section className="technology-container">
        <h2>Cutting-Edge Blockchain Technology</h2>
        <div className="technology-features">
          <div className="feature-card">
            <h3>Advanced Security</h3>
            <p>
              Utilizing state-of-the-art cryptographic protocols and decentralized network architecture 
              to ensure maximum security and protection of your digital assets.
            </p>
          </div>
          <div className="feature-card">
            <h3>Transparent Transactions</h3>
            <p>
              Every transaction is recorded on an immutable blockchain, providing complete transparency 
              and eliminating the possibility of fraudulent activities.
            </p>
          </div>
          <div className="feature-card">
            <h3>Global Accessibility</h3>
            <p>
              Break free from traditional banking limitations. Tanacoin enables instant, 
              low-cost transactions across borders, empowering global financial inclusion.
            </p>
          </div>
        </div>
      </section>
  
      {/* Countdown Section */}
      <section className="countdown-container">
        <h2>Countdown to Launch</h2>
        <div id="countdown-timer" className="countdown-timer">
          <div className="countdown-item">
            <span>{countdown.days}</span>
            <p>Days</p>
          </div>
          <div className="countdown-item">
            <span>{countdown.hours}</span>
            <p>Hours</p>
          </div>
          <div className="countdown-item">
            <span>{countdown.minutes}</span>
            <p>Minutes</p>
          </div>
          <div className="countdown-item">
            <span>{countdown.seconds}</span>
            <p>Seconds</p>
          </div>
        </div>
        <p className="cta-description">
          The clock is ticking! Be part of history by joining the Tanacoin launch today!
        </p>
      </section>
  
      {/* Footer Section */}
      <footer className="footer-container">
        <div className="footer-content">
          <div className="footer-info">
            <p>&copy; 2024 Tanacoin. All rights reserved.</p>
            <div className="social-links">
              <a href="https://twitter.com/Tanacoin" target="_blank" rel="noopener noreferrer">Twitter</a>
              <a href="https://discord.com/Tanacoin" target="_blank" rel="noopener noreferrer">Discord</a>
              <a href="https://linkedin.com/Tanacoin" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
          </div>
          <div className="footer-links">
            <a href="/whitepaper">Whitepaper</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
          </div>
        </div>
      </footer>
          {/* Login Modal */}
          {isLoginModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={() => setIsLoginModalOpen(false)}>
              X
            </button>
            <Login isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} onClose={() => setIsLoginModalOpen(false)}/>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {isRegisterModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={() => setIsRegisterModalOpen(false)}>
              X
            </button>
            <RegisterUser isOpen={isRegisterModalOpen} setIsOpen={setIsRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
