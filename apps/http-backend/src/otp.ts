export function generateOTP(length = 6): string {
  return Math.floor(
    Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)
  ).toString();
}

export const otpStore = new Map<string, { otp: string; expiresAt: number }>();

export function storeOTP(email: string, otp: string, ttlInMinutes = 15) {
  const expiresAt = Date.now() + ttlInMinutes * 60 * 1000;
  otpStore.set(email, { otp, expiresAt });
}

export function isOTPValid(email: string, inputOTP: string): boolean {
  const entry = otpStore.get(email);
  if (!entry) return false;

  const { otp, expiresAt } = entry;

  const isValid = otp === inputOTP && Date.now() < expiresAt;

  if (isValid) {
    otpStore.delete(email);
  }

  return isValid;
}
