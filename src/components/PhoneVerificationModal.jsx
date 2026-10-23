import React, { useState, useEffect, useContext, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  Phone,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  X,
  Lock,
  Smartphone,
} from "lucide-react";
import { ShopContext } from "../context/ShopContext";
import "./PhoneVerificationModal.css";

const PhoneVerificationModal = () => {
  const { pathname } = useLocation();
  const { user, updateUserPhone } = useContext(ShopContext);

  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: Enter Phone, 2: Enter OTP, 3: Success
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const otpInputsRef = useRef([]);

  // Determine if current route is one of the target routes:
  // account (/account, /profile), cart (/cart), wishlist (/wishlist)
  const isTargetRoute =
    pathname === "/account" ||
    pathname.startsWith("/account/") ||
    pathname === "/profile" ||
    pathname.startsWith("/profile/") ||
    pathname === "/cart" ||
    pathname.startsWith("/cart/") ||
    pathname === "/wishlist" ||
    pathname.startsWith("/wishlist/");

  // Auto trigger when logged in, phone not verified, and on target route
  useEffect(() => {
    if (user && (!user.phone || !user.phoneVerified) && isTargetRoute) {
      setIsOpen(true);
      setStep(1);
      setErrorMsg("");
    } else {
      setIsOpen(false);
    }
  }, [pathname, user?.email, user?.phone, user?.phoneVerified, isTargetRoute]);

  // Listen to manual open event (e.g. user clicked "Verify Phone" on their profile)
  useEffect(() => {
    const handleManualOpen = () => {
      setIsOpen(true);
      setStep(1);
      setErrorMsg("");
    };

    window.addEventListener("openPhoneVerificationModal", handleManualOpen);
    return () => {
      window.removeEventListener("openPhoneVerificationModal", handleManualOpen);
    };
  }, []);

  // OTP Timer countdown
  useEffect(() => {
    let interval = null;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Focus first OTP input when entering step 2
  useEffect(() => {
    if (step === 2) {
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 150);
    }
  }, [step]);

  const handlePhoneChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, "");
    if (digitsOnly.length <= 10) {
      setPhoneNumber(digitsOnly);
      if (errorMsg) setErrorMsg("");
    }
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
      setTimer(30);
      setCanResend(false);
      setOtp(["", "", "", ""]);
    }, 600);
  };

  const handleOtpChange = (index, value) => {
    const cleanVal = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = cleanVal;
    setOtp(newOtp);
    if (errorMsg) setErrorMsg("");

    // Auto advance focus
    if (cleanVal && index < 3) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (pasteData) {
      const newOtp = [...otp];
      for (let i = 0; i < pasteData.length; i++) {
        newOtp[i] = pasteData[i];
      }
      setOtp(newOtp);
      const nextIndex = Math.min(pasteData.length, 3);
      otpInputsRef.current[nextIndex]?.focus();
    }
  };

  const handleResendOtp = () => {
    if (!canResend) return;
    setTimer(30);
    setCanResend(false);
    setOtp(["", "", "", ""]);
    setErrorMsg("");
    otpInputsRef.current[0]?.focus();
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 4) {
      setErrorMsg("Please enter the complete 4-digit OTP.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    setTimeout(() => {
      setIsLoading(false);
      setStep(3);

      const formattedPhone = `+91 ${phoneNumber}`;
      updateUserPhone(formattedPhone);

      // Automatically close modal after celebration
      setTimeout(() => {
        setIsOpen(false);
        setStep(1);
        setPhoneNumber("");
        setOtp(["", "", "", ""]);
      }, 1500);
    }, 700);
  };

  const handleClose = () => {
    setIsOpen(false);
    setErrorMsg("");
  };

  if (!isOpen) return null;

  return (
    <div className="phone-modal-overlay" onClick={handleClose}>
      <div
        className="phone-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          className="phone-modal-close-btn"
          onClick={handleClose}
          aria-label="Close popup"
        >
          <X size={18} />
        </button>

        {/* STEP 1: ENTER PHONE NUMBER */}
        {step === 1 && (
          <div className="phone-modal-step">
            <div className="phone-modal-icon-badge">
              <Smartphone size={28} className="badge-icon" />
            </div>

            <h2 className="phone-modal-title">Verify Mobile Number</h2>
            <p className="phone-modal-subtitle">
              Link your mobile number to receive instant order tracking, delivery
              updates, and ensure secure checkout.
            </p>

            <form onSubmit={handleSendOtp} className="phone-modal-form">
              <div className="phone-input-group">
                <div className="phone-country-pill">
                  <span className="country-flag">🇮🇳</span>
                  <span className="country-code">+91</span>
                </div>
                <input
                  type="tel"
                  className="phone-main-input"
                  placeholder="Enter 10-digit number"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  maxLength={10}
                  autoFocus
                />
              </div>

              {errorMsg && <p className="phone-modal-error">{errorMsg}</p>}

              <button
                type="submit"
                className="phone-modal-primary-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="spinner-text">Sending OTP...</span>
                ) : (
                  <>
                    <span>SEND OTP</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="phone-modal-trust-badge">
              <ShieldCheck size={15} color="#16a34a" />
              <span>We never share your number or send spam</span>
            </div>

            <button
              type="button"
              className="phone-modal-skip-btn"
              onClick={handleClose}
            >
              Skip for now
            </button>
          </div>
        )}

        {/* STEP 2: ENTER OTP */}
        {step === 2 && (
          <div className="phone-modal-step">
            <div className="phone-modal-icon-badge otp-badge">
              <Lock size={26} className="badge-icon" />
            </div>

            <h2 className="phone-modal-title">Enter Verification Code</h2>
            <p className="phone-modal-subtitle">
              We sent a 4-digit verification code to{" "}
              <strong>+91 {phoneNumber}</strong>
            </p>

            <button
              type="button"
              className="phone-change-number-link"
              onClick={() => {
                setStep(1);
                setErrorMsg("");
              }}
            >
              Change number
            </button>

            {/* Test demo note */}
            <div className="phone-demo-otp-chip">
              💡 Test OTP: <strong>1234</strong> (or any 4 digits)
            </div>

            <form onSubmit={handleVerifyOtp} className="phone-modal-form">
              <div className="otp-boxes-wrapper" onPaste={handleOtpPaste}>
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputsRef.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="otp-box-input"
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  />
                ))}
              </div>

              {errorMsg && <p className="phone-modal-error">{errorMsg}</p>}

              <div className="phone-resend-row">
                {timer > 0 ? (
                  <span className="timer-text">
                    Resend code in <strong>{timer}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    className="resend-btn"
                    onClick={handleResendOtp}
                  >
                    <RotateCcw size={14} />
                    <span>Resend OTP</span>
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="phone-modal-primary-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="spinner-text">Verifying...</span>
                ) : (
                  <>
                    <span>CONFIRM & VERIFY</span>
                    <CheckCircle2 size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* STEP 3: SUCCESS CELEBRATION */}
        {step === 3 && (
          <div className="phone-modal-step phone-success-step">
            <div className="phone-success-icon-badge">
              <CheckCircle2 size={44} color="#ffffff" />
            </div>

            <h2 className="phone-modal-title">Verified Successfully!</h2>
            <p className="phone-modal-subtitle">
              Your mobile number <strong>+91 {phoneNumber}</strong> has been
              successfully verified and linked to your profile.
            </p>

            <div className="phone-success-progress-bar">
              <div className="progress-fill" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneVerificationModal;
