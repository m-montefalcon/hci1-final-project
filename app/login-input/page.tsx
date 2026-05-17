/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { authStore } from "@/lib/auth";
import {
  validateEmail,
  validatePhone,
  formatPhoneNumber,
} from "@/lib/validation";

export default function LoginInputPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const method = searchParams.get("method") as "phone" | "email" | null;

  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!method || (method !== "phone" && method !== "email")) {
      router.push("/");
    }
  }, [method, router]);

  const validateInput = (value: string): string => {
    if (!value.trim()) {
      return method === "email"
        ? "Email is required"
        : "Phone number is required";
    }

    if (method === "email") {
      const emailError = validateEmail(value);
      if (emailError) return emailError;
    } else {
      const phoneError = validatePhone(value);
      if (phoneError) return phoneError;
    }

    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    const validationError = validateInput(identifier);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = authStore.initiateLogin(identifier, method!);
      if (result.success) {
        // Redirect to OTP verification
        setTimeout(() => {
          router.push(`/otp-verify?method=${method}`);
        }, 500);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Auto-format phone number for Philippines
    if (method === "phone") {
      value = formatPhoneNumber(value);

      // Limit to +(63) + 10 digits (16 characters total)
      if (value.length > 16) {
        value = value.substring(0, 16);
      }
    }

    setIdentifier(value);
    if (touched) {
      const validationError = validateInput(value);
      setError(validationError);
    }
  };

  if (!method) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {method === "email" ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                )}
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              {method === "email" ? "Enter Your Email" : "Enter Your Phone"}
            </h1>
            <p className="text-gray-600 mt-2">
              We'll send you a verification code
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type={method === "email" ? "email" : "tel"}
              label={method === "email" ? "Email Address" : "Phone Number"}
              placeholder={
                method === "email" ? "you@example.com" : "+(63) 9058893221"
              }
              value={identifier}
              onChange={handleInputChange}
              onBlur={() => setTouched(true)}
              error={touched ? error : ""}
              disabled={loading}
              autoFocus
            />

            <Button type="submit" className="w-full" loading={loading}>
              {loading ? "Sending Code..." : "Send Verification Code"}
            </Button>
          </form>

          {/* Back Link */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/")}
              className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
              disabled={loading}
            >
              ← Back to login methods
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
