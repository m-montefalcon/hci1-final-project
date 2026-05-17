"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { authStore } from "@/lib/auth";
import { validateOTP } from "@/lib/validation";

export default function OTPVerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const method = searchParams.get("method") as "phone" | "email" | null;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!method) {
      router.push("/register");
      return;
    }

    const pending = authStore.getPendingVerification();
    if (!pending) {
      router.push("/register");
      return;
    }

    // Focus first input
    inputRefs.current[0]?.focus();

    // Countdown timer
    const timer = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [method, router]);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits entered
    if (index === 5 && value && newOtp.every((digit) => digit)) {
      handleSubmit(newOtp.join(""));
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);

    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData
      .split("")
      .concat(Array(6 - pastedData.length).fill(""));
    setOtp(newOtp.slice(0, 6));

    // Focus last filled input or submit if complete
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();

    if (pastedData.length === 6) {
      handleSubmit(pastedData);
    }
  };

  const handleSubmit = async (otpValue?: string) => {
    const otpString = otpValue || otp.join("");

    const validationError = validateOTP(otpString);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    // Simulate async verification
    await new Promise((resolve) => setTimeout(resolve, 800));

    const result = authStore.verifyOTP(otpString);

    if (result.success) {
      router.push("/login?verified=true");
    } else {
      setError(result.error || "Invalid OTP");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }

    setLoading(false);
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;

    setResendTimer(60);
    setOtp(["", "", "", "", "", ""]);
    setError("");
    inputRefs.current[0]?.focus();

    // Simulate resend
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  if (!method) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Enter Verification Code
            </h1>
            <p className="text-gray-600 mt-2">
              We sent a 6-digit code to your{" "}
              {method === "email" ? "email" : "phone"}
            </p>
          </div>

          {/* OTP Input */}
          <div className="mb-6">
            <div className="flex gap-3 justify-center" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={loading}
                  className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 text-gray-900 ${
                    error
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                  aria-label={`Digit ${index + 1}`}
                />
              ))}
            </div>

            {error && (
              <p className="mt-3 text-sm text-red-600 text-center flex items-center justify-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </p>
            )}
          </div>

          {/* Verify Button */}
          <Button
            onClick={() => handleSubmit()}
            disabled={otp.some((digit) => !digit)}
            loading={loading}
            className="w-full mb-4"
          >
            Verify Code
          </Button>

          {/* Resend */}
          <div className="text-center">
            {resendTimer > 0 ? (
              <p className="text-sm text-gray-600">
                Resend code in{" "}
                <span className="font-medium text-blue-600">
                  {resendTimer}s
                </span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
              >
                Resend verification code
              </button>
            )}
          </div>

          {/* Back Link */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/otp-select")}
              className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
              disabled={loading}
            >
              ← Change verification method
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
