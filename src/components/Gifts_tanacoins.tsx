import React, { useState, useEffect } from 'react';
import styles from '../styles/modalscss.module.css';

const GiftsTanacoinForm: React.FC = () => {
  // State for countdown
  const [countdown, setCountdown] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const launchDate = new Date("April 3, 2025 00:00:00").getTime();

    const countdownTimer = setInterval(() => {
      const now = new Date().getTime();
      const timeLeft = launchDate - now;

      if (timeLeft >= 0) {
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
      } else {
        clearInterval(countdownTimer);
        setCountdown({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
        });
      }
    }, 1000);

    return () => clearInterval(countdownTimer); // Cleanup interval on component unmount
  }, []);

  return (
    <div className={styles.container}>
      <h3>Available When Tanacoin is Deployed</h3>
      {/* Countdown Section */}
      <section className={styles.countdownContainer}>
        <h2>Countdown to Launch</h2>
        <div id="countdown-timer" className={styles.countdownTimer}>
          <div className={styles.countdownItem}>
            <span>{countdown.days}</span>
            <p >Days</p>
          </div>
          <div className={styles.countdownItem}>
            <span>{countdown.hours}</span>
            <p>Hours</p>
          </div>
          <div className={styles.countdownItem}>
            <span>{countdown.minutes}</span>
            <p>Minutes</p>
          </div>
          <div className={styles.countdownItem}>
            <span>{countdown.seconds}</span>
            <p>Seconds</p>
          </div>
        </div>
        <p className={styles.ctaDescription}>
          The clock is ticking—be part of history by joining the Tanacoin launch today!
        </p>
      </section>
    </div>
  );
};

export default GiftsTanacoinForm;
