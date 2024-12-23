'use client'
import { useState, useEffect } from "react";
import RegisterUser from "../../components/registerUser"; // Import the LoginUser component
import './register_css.css'
export default function Home() {
  const [isOpen, setIsOpen] = useState(true); // Manage isOpen state locally


  useEffect(() => {
    // Only run the effect on the client side
    if (!isOpen) {
      // If the modal is closed, redirect to the dashboard
      window.location.href = "/"; // Redirect to the dashboard
    }
  }, [isOpen]);
  const handleClose = () => {
    setIsOpen(false); 
  }
  return (
    <div>
      <div className={`modal-overlay`}>
      {isOpen && <RegisterUser  isOpen={isOpen} setIsOpen={setIsOpen} onClose={handleClose} />}
      </div>
    </div>
  );
}
