// UPI Deep Link Helper for payment redirect

// Merchant UPI ID for GoBhraman
const MERCHANT_UPI_ID = "8433676328@indie";
const MERCHANT_NAME = "GoBhraman";

export interface UpiPaymentDetails {
  amount: number;
  transactionNote: string;
  transactionRef?: string;
}

/**
 * Generates a UPI deep link that opens installed UPI apps
 * Works with Google Pay, PhonePe, Paytm, BHIM, etc.
 */
export const generateUpiDeepLink = (details: UpiPaymentDetails): string => {
  const params = new URLSearchParams({
    pa: MERCHANT_UPI_ID,
    pn: MERCHANT_NAME,
    am: details.amount.toString(),
    tn: details.transactionNote,
    cu: "INR",
  });

  if (details.transactionRef) {
    params.append("tr", details.transactionRef);
  }

  return `upi://pay?${params.toString()}`;
};

/**
 * Triggers UPI payment by redirecting to the deep link
 * On mobile, this opens the UPI app selector
 */
export const triggerUpiPayment = (details: UpiPaymentDetails): void => {
  const deepLink = generateUpiDeepLink(details);
  window.location.href = deepLink;
};

/**
 * Validates UPI ID format
 */
export const isValidUpiId = (upiId: string): boolean => {
  // UPI ID format: username@bankhandle
  const upiPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
  return upiPattern.test(upiId);
};

/**
 * Common UPI handles for validation hints
 */
export const commonUpiHandles = [
  "@upi",
  "@okaxis",
  "@okhdfc",
  "@okhdfcbank",
  "@okicici",
  "@oksbi",
  "@ybl",
  "@paytm",
  "@ibl",
  "@axl",
];
