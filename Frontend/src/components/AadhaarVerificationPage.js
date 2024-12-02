import React, { useState } from "react";
import "./AadharVerification.css";

const AadharVerification = () => {
  const [aadharNumber, setAadharNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState("");

  const handleAadharChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 12) setAadharNumber(value);
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 6) setOtp(value);
  };

  const generateOtp = async () => {
    try {
      const response = await fetch("https://sandbox.aadhaarkyc.io/api/aadhaar/generate-otp", {  // Ensure this matches the backend route
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ aadhaar: aadharNumber }),
      });

      if (response.ok) {
        setIsOtpSent(true);
        setMessage("OTP sent successfully.");
      } else {
        const error = await response.json();
        setMessage(error.message || "Failed to generate OTP.");
      }
    } catch (err) {
      console.error("Error generating OTP:", err);
      setMessage("Error generating OTP. Please try again.");
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await fetch("https://sandbox.aadhaarkyc.io/api/aadhaar/verify-otp", {  // Ensure this matches the backend route
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ aadhaar: aadharNumber, otp }),
      });

      if (response.ok) {
        setIsVerified(true);
        setMessage("Aadhaar verified successfully.");
      } else {
        const error = await response.json();
        setMessage(error.message || "Failed to verify OTP.");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setMessage("Error verifying OTP. Please try again.");
    }
  };

  const validateAadhar = async () => {
    try {
      const response = await fetch("https://sandbox.aadhaarkyc.io/api/aadhaar/validate", {  // Ensure this matches the backend route
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ aadhaar: aadharNumber }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`Aadhaar is valid. Details: ${JSON.stringify(data)}`);
      } else {
        const error = await response.json();
        setMessage(error.message || "Failed to validate Aadhaar.");
      }
    } catch (err) {
      console.error("Error validating Aadhaar:", err);
      setMessage("Error validating Aadhaar. Please try again.");
    }
  };

  return (
    <div className="aadhar-verification">
      <h1>Aadhaar Verification</h1>
      <div className="input-group">
        <label>
          Aadhaar Number:
          <input
            type="text"
            value={aadharNumber}
            onChange={handleAadharChange}
            placeholder="Enter 12-digit Aadhaar number"
            maxLength="12"
          />
        </label>
        <button onClick={generateOtp} disabled={aadharNumber.length !== 12}>
          Generate OTP
        </button>
      </div>

      {isOtpSent && (
        <div className="input-group">
          <label>
            OTP:
            <input type="text" value={otp} onChange={handleOtpChange} placeholder="Enter 6-digit OTP" maxLength="6" />
          </label>
          <button onClick={verifyOtp} disabled={otp.length !== 6}>
            Verify OTP
          </button>
        </div>
      )}

      {isVerified && (
        <div className="input-group">
          <button onClick={validateAadhar}>
            Validate Aadhaar
          </button>
        </div>
      )}

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default AadharVerification;
