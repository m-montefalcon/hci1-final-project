// In-memory user store
export interface User {
  email: string;
  phone?: string;
  name: string;
  password?: string;
  isVerified: boolean;
  loginMethod: "phone" | "email" | "google";
}

class AuthStore {
  private users: User[] = [];
  private currentUser: User | null = null;
  private pendingVerification: {
    identifier: string; // email or phone
    method: "phone" | "email";
    isNewUser: boolean;
  } | null = null;
  private googleUserCounter: number = 1;

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
      loginMethod: "email",
    });

    return { success: true };
  }

  // Initiate login with phone/email
  initiateLogin(
    identifier: string,
    method: "phone" | "email",
  ): { success: boolean; error?: string; isNewUser: boolean } {
    const isEmail = method === "email";
    const existingUser = this.users.find((u) =>
      isEmail ? u.email === identifier : u.phone === identifier,
    );

    // Store pending verification
    this.pendingVerification = {
      identifier,
      method,
      isNewUser: !existingUser,
    };

    // If new user, create unverified account
    if (!existingUser) {
      const newUser: User = {
        email: isEmail ? identifier : `${identifier}@phone.temp`,
        phone: isEmail ? undefined : identifier,
        name: isEmail
          ? identifier.split("@")[0]
          : `User ${identifier.slice(-4)}`,
        isVerified: false,
        loginMethod: method,
      };
      this.users.push(newUser);
    }

    return { success: true, isNewUser: !existingUser };
  }

  // Google login (auto-create and verify)
  loginWithGoogle(): {
    success: boolean;
    user: User;
  } {
    // Generate email like sample1@gmail.com, sample2@gmail.com
    const email = `sample${this.googleUserCounter}@gmail.com`;
    this.googleUserCounter++;

    // Check if user already exists (shouldn't happen with counter)
    let user = this.users.find((u) => u.email === email);

    if (!user) {
      user = {
        email,
        name: `Sample User ${this.googleUserCounter - 1}`,
        isVerified: true, // Google users are auto-verified
        loginMethod: "google",
      };
      this.users.push(user);
    }

    this.currentUser = user;
    return { success: true, user };
  }

  // Set pending verification
  setPendingVerification(email: string, method: "phone" | "email") {
    this.pendingVerification = {
      identifier: email,
      method,
      isNewUser: false,
    };
  }

  // Get pending verification
  getPendingVerification() {
    return this.pendingVerification;
  }

  // Verify OTP (accepts any 6 digit code) and login user
  verifyOTP(otp: string): { success: boolean; error?: string; user?: User } {
    if (!this.pendingVerification) {
      return { success: false, error: "No pending verification" };
    }

    if (!/^\d{6}$/.test(otp)) {
      return { success: false, error: "OTP must be 6 digits" };
    }

    // Find user by identifier
    const { identifier, method } = this.pendingVerification;
    const user = this.users.find((u) =>
      method === "email" ? u.email === identifier : u.phone === identifier,
    );

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Verify and login
    user.isVerified = true;
    this.currentUser = user;
    this.pendingVerification = null;

    return { success: true, user };
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
