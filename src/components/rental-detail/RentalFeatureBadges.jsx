import React from "react";
import { Check, Sparkles, Activity, Wrench, Shield } from "lucide-react";

const RentalFeatureBadges = () => {
  return (
    <div className="feature-badges-strip">
      <div className="feature-strip-badge">
        <Check size={16} />
        <span>Premium Quality</span>
      </div>
      <div className="feature-strip-badge">
        <Sparkles size={16} />
        <span>Lightweight</span>
      </div>
      <div className="feature-strip-badge">
        <Activity size={16} />
        <span>Breathable</span>
      </div>
      <div className="feature-strip-badge">
        <Wrench size={16} />
        <span>Ergonomic Design</span>
      </div>
      <div className="feature-strip-badge">
        <Shield size={16} />
        <span>High Durability</span>
      </div>
    </div>
  );
};

export default RentalFeatureBadges;
