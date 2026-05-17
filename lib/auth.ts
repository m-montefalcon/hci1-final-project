// In-memory user store
export interface User {
  email: string;
  name: string;
  password: string;
  isVerified: boolean;
}

class AuthStore {
  private users: User[] = [];
  private currentUser: User | null = null;
  private pendingVerification: {
    email: string;
    method: "phone" | "email";
  } | null = null;

  // Register new user
  register(
    email: string,
    name: string,
    password: string,
  ): { success: boolean; error?: string } {
    const existing = this.users.find((u) => u.email === email);
    if (existing) {
      return { success: false, error: "Email already registered" };
    }

    this.users.push({
      email,
      name,
      password,
      isVerified: false,
    });

    return { success: true };
  }

  // Set pending verification
  setPendingVerification(email: string, method: "phone" | "email") {
    this.pendingVerification = { email, method };
  }

  // Get pending verification
  getPendingVerification() {
    return this.pendingVerification;
  }

  // Verify OTP (accepts any 6 digit code)
  verifyOTP(otp: string): { success: boolean; error?: string } {
    if (!this.pendingVerification) {
      return { success: false, error: "No pending verification" };
    }

    if (!/^\d{6}$/.test(otp)) {
      return { success: false, error: "OTP must be 6 digits" };
    }

    const user = this.users.find(
      (u) => u.email === this.pendingVerification?.email,
    );
    if (user) {
      user.isVerified = true;
    }

    this.pendingVerification = null;
    return { success: true };
  }

  // Login user
  login(
    email: string,
    password: string,
  ): { success: boolean; error?: string; user?: User } {
    const user = this.users.find(
      (u) => u.email === email && u.password === password,
    );

    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }

    if (!user.isVerified) {
      return { success: false, error: "Account not verified" };
    }

    this.currentUser = user;
    return { success: true, user };
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Logout
  logout() {
    this.currentUser = null;
  }

  // Check if email exists
  emailExists(email: string): boolean {
    return this.users.some((u) => u.email === email);
  }

  // Get all users (for debugging)
  getAllUsers(): User[] {
    return this.users;
  }
}

// Singleton instance
export const authStore = new AuthStore();
