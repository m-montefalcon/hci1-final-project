"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { authStore } from "@/lib/auth";

export default function OTPSelectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [selectedMethod, setSelectedMethod] = useState<
    "phone" | "email" | null
  >(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      router.push("/register");
    }
  }, [email, router]);

  const handleMethodSelect = (method: "phone" | "email") => {
    setSelectedMethod(method);
  };

  const handleContinue = async () => {
    if (!selectedMethod || !email) return;

    setLoading(true);

    // Simulate sending OTP
    await new Promise((resolve) => setTimeout(resolve, 800));

    authStore.setPendingVerification(email, selectedMethod);

    router.push(`/otp-verify?method=${selectedMethod}`);
  };

  if (!email) return null;

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
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Verify Your Account
            </h1>
            <p className="text-gray-600 mt-2">
              Choose how you'd like to receive your verification code
            </p>
          </div>

          {/* Email Display */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600">Verifying for</p>
            <p className="font-medium text-gray-900 truncate">{email}</p>
          </div>

          {/* Verification Methods */}
          <div className="space-y-4 mb-6">
            {/* Email Option */}
            <button
              onClick={() => handleMethodSelect("email")}
              disabled={loading}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left cursor-pointer ${
                selectedMethod === "email"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                    selectedMethod === "email" ? "bg-blue-600" : "bg-gray-100"
                  }`}
                >
                  <svg
                    className={`w-6 h-6 ${selectedMethod === "email" ? "text-white" : "text-gray-600"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    Email Verification
                  </h3>
                  <p className="text-sm text-gray-600">
                    Receive code via email
                  </p>
                </div>
                {selectedMethod === "email" && (
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </button>

            {/* Phone Option */}
            <button
              onClick={() => handleMethodSelect("phone")}
              disabled={loading}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left cursor-pointer ${
                selectedMethod === "phone"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                    selectedMethod === "phone" ? "bg-blue-600" : "bg-gray-100"
                  }`}
                >
                  <svg
                    className={`w-6 h-6 ${selectedMethod === "phone" ? "text-white" : "text-gray-600"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    Phone Verification
                  </h3>
                  <p className="text-sm text-gray-600">Receive code via SMS</p>
                </div>
                {selectedMethod === "phone" && (
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </button>
          </div>

          {/* Continue Button */}
          <Button
            onClick={handleContinue}
            disabled={!selectedMethod}
            loading={loading}
            className="w-full"
          >
            {loading ? "Sending Code..." : "Continue"}
          </Button>

          {/* Back Link */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/register")}
              className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
              disabled={loading}
            >
              ← Back to registration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
