export const INITIAL_RETURN_PRODUCTS = [];

export const REASON_OPTIONS = [
  "Select a reason",
  "Defective product / manufacturing fault",
  "Size doesn't fit",
  "Product doesn't match expectations",
  "Received wrong item or variant",
  "Transit damage / broken packaging",
  "Other issues",
];

export const RETURN_REASONS = REASON_OPTIONS;

export const REFUND_METHODS = [
  {
    id: "wallet",
    label: "Dzire Store Credits / Wallet",
    desc: "Instant credit to your store wallet after product inspection",
  },
  {
    id: "source",
    label: "Refund to Original Payment Mode",
    desc: "Returned to UPI / Bank / Card within 5-7 working days",
  },
];
