import React from "react";
import {
  Users,
  Footprints,
  Backpack,
  Shirt,
} from "lucide-react";

export const TrouserIcon = ({ size = 15, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16v3l-2 13h-4.5L12 11l-1.5 9H6L4 7V4z" />
    <path d="M4 8h16" />
  </svg>
);

export const getItemMetaIcon = (category) => {
  switch (category) {
    case "Shoes":
      return <Footprints size={13} className="meta-icon" />;
    case "Trek Bag":
      return <Backpack size={13} className="meta-icon" />;
    case "Camping":
      return <Users size={13} className="meta-icon" />;
    case "Trouser":
      return <TrouserIcon size={13} className="meta-icon" />;
    case "Jacket":
    case "Rainwear":
    default:
      return <Shirt size={13} className="meta-icon" />;
  }
};
