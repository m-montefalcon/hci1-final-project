// Validation utilities

export const validateEmail = (email: string): string | null => {
  if (!email) {
    return "Email is required";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }

  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return "Password is required";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }

  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }

  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number";
  }

  return null;
};

export const validateName = (name: string): string | null => {
  if (!name) {
    return "Name is required";
  }

  if (name.length < 2) {
    return "Name must be at least 2 characters long";
  }

  if (!/^[a-zA-Z\s]+$/.test(name)) {
    return "Name can only contain letters and spaces";
  }

  return null;
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string,
): string | null => {
  if (!confirmPassword) {
    return "Please confirm your password";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match";
  }

  return null;
};

export const validateOTP = (otp: string): string | null => {
  if (!otp) {
    return "OTP is required";
  }

  if (!/^\d{6}$/.test(otp)) {
    return "OTP must be exactly 6 digits";
  }

  return null;
};

// Philippines phone number validation
export const validatePhone = (phone: string): string | null => {
  if (!phone) {
    return "Phone number is required";
  }

  // Accept formats: +639058893221, +(63) 9058893221, +(63)9058893221
  const cleaned = phone.replace(/[\s\-\(\)]/g, ""); // Remove spaces, dashes, parentheses

  if (!/^\+63\d{10}$/.test(cleaned)) {
    return "Phone number must be in format +(63) followed by 10 digits";
  }

  return null;
};

// Format phone number to Philippines format: +(63) XXXXXXXXXX
export const formatPhoneNumber = (value: string): string => {
  // Remove all non-digit characters except +
  const cleaned = value.replace(/[^\d+]/g, "");

  // If user is typing from scratch
  if (cleaned.length === 0) {
    return "";
  }

  if (cleaned.startsWith("+63")) {
    // Already has +63, format it
    const digits = cleaned.substring(3);
    if (digits.length > 0) {
      return `+(63) ${digits}`;
    }
    return "+(63) ";
  }

  if (cleaned.startsWith("63")) {
    // Starts with 63, add +
    const digits = cleaned.substring(2);
    if (digits.length > 0) {
      return `+(63) ${digits}`;
    }
    return "+(63) ";
  }

  if (cleaned.startsWith("+")) {
    // Just +, assume they want +63
    const digits = cleaned.substring(1);
    if (digits.length > 0) {
      return `+(63) ${digits}`;
    }
    return "+(63) ";
  }

  if (/^\d/.test(cleaned)) {
    // Starts with digit, add +(63)
    return `+(63) ${cleaned}`;
  }

  return value;
};
