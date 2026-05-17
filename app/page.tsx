"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authStore } from "@/lib/auth";

type LoginMethod = "phone" | "email" | "google" | null;

export default function Home() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<LoginMethod>(null);
  const [loading, setLoading] = useState(false);

  const handleMethodSelect = (method: LoginMethod) => {
    setSelectedMethod(method);
  };

  const handleContinue = () => {
    if (!selectedMethod) return;

    setLoading(true);

    if (selectedMethod === "google") {
      // Auto-create and login with Google
      const result = authStore.loginWithGoogle();
      if (result.success) {
        setTimeout(() => {
          router.push("/dashboard");
        }, 500);
      }
    } else {
      // Redirect to identifier input page
      router.push(`/login-input?method=${selectedMethod}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Choose your login method</p>
        </div>

        {/* Login Method Cards */}
        <div className="space-y-3 mb-6">
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
                className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
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
                <h3 className="font-semibold text-gray-900">Email</h3>
                <p className="text-sm text-gray-600">Login with email OTP</p>
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
                className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
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
                <h3 className="font-semibold text-gray-900">Phone</h3>
                <p className="text-sm text-gray-600">Login with phone OTP</p>
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

          {/* Google Option */}
          <button
            onClick={() => handleMethodSelect("google")}
            disabled={loading}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left cursor-pointer ${
              selectedMethod === "google"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-gray-300 bg-white"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                  selectedMethod === "google" ? "bg-blue-600" : "bg-gray-100"
                }`}
              >
                <svg
                  className={`w-6 h-6 ${selectedMethod === "google" ? "text-white" : "text-gray-600"}`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Google Account</h3>
                <p className="text-sm text-gray-600">Quick login with Google</p>
              </div>
              {selectedMethod === "google" && (
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
        <button
          onClick={handleContinue}
          disabled={!selectedMethod || loading}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
            !selectedMethod || loading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white active:scale-[0.98]"
          }`}
        >
          {loading ? (
            <span className="inline-flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing...
            </span>
          ) : (
            "Continue"
          )}
        </button>
      </div>
    </div>
  );
}
