import React from "react";
import { CheckCircle2 } from "lucide-react";

const AuthBenefits = ({ onPrivacyClick }) => {
  return (
    <>
      <div className="auth-benefits">
        <h3>It’s better when you're signed in</h3>

        <div><CheckCircle2 size={20} /> Exclusive Deals and Sporty Rewards</div>
        <div><CheckCircle2 size={20} /> Personalised Experiences</div>
        <div><CheckCircle2 size={20} /> Faster Checkout</div>
        <div><CheckCircle2 size={20} /> Easy Returns/Exchange</div>
      </div>

      <div className="auth-bottom-links">
        <span>Having trouble logging in?</span>
        <span onClick={onPrivacyClick} className="privacy-link">Privacy</span>
      </div>

      <p className="auth-note">
        This site is protected by reCaptcha. Google Privacy Policy applies
        as well as their terms.
      </p>
    </>
  );
};

export default AuthBenefits;
