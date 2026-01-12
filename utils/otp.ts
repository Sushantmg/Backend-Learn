import crypto from "crypto";

export const generateOtp = (): number => {
  return crypto.randomInt(100000, 1000000); // secure 6-digit OTP
};
