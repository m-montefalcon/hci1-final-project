"use client";

import { useState } from "react";

export function Mailbox() {
  const [selectedEmail, setSelectedEmail] = useState<number | null>(null);
  const [readEmails, setReadEmails] = useState<Set<number>>(new Set());

  const emails = [
    {
      from: "System",
      subject: "Welcome to App Hub!",
      body: "Thank you for joining App Hub! We're excited to have you on board. Explore our features and feel free to reach out if you need any help.",
      time: "2 hours ago",
      unread: true,
    },
    {
      from: "Support",
      subject: "Getting Started Guide",
      body: "Here's a quick guide to help you get started with App Hub. Check out our AI Assistant and Mailbox features to make the most of your experience.",
      time: "1 day ago",
      unread: true,
    },
    {
      from: "Updates",
      subject: "New Features Available",
      body: "We've just released new features! Check out the latest updates to enhance your productivity and workflow.",
      time: "3 days ago",
      unread: true,
    },
  ];

  const handleEmailClick = (index: number) => {
    setSelectedEmail(index);
    setReadEmails((prev) => new Set(prev).add(index));
  };

  const selectedEmailData =
    selectedEmail !== null ? emails[selectedEmail] : null;

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Mailbox</h2>
        <p className="text-gray-600 mt-1">Manage your messages</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Email List */}
        <div className="lg:col-span-1 border-r border-gray-200 p-4 space-y-2 max-h-150 overflow-y-auto">
          {emails.map((email, index) => {
            const isUnread = !readEmails.has(index);
            return (
              <div
                key={index}
                onClick={() => handleEmailClick(index)}
                className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedEmail === index
                    ? "border-blue-500 bg-blue-50"
                    : isUnread
                      ? "bg-blue-50 border-blue-200 hover:border-blue-300"
                      : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <h3
                    className={`font-semibold text-sm ${isUnread ? "text-gray-900" : "text-gray-700"}`}
                  >
                    {email.from}
                  </h3>
                  {isUnread && (
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  )}
                </div>
                <p className="text-sm text-gray-900 truncate">
                  {email.subject}
                </p>
                <p className="text-xs text-gray-500 mt-1">{email.time}</p>
              </div>
            );
          })}
        </div>

        {/* Email Content */}
        <div className="lg:col-span-2 p-6">
          {selectedEmailData ? (
            <div>
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedEmailData.subject}
                </h3>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-medium text-gray-900">From: </span>
                    <span className="text-gray-600">
                      {selectedEmailData.from}
                    </span>
                  </div>
                  <span className="text-gray-500">
                    {selectedEmailData.time}
                  </span>
                </div>
              </div>
              <div className="text-gray-700 leading-relaxed">
                {selectedEmailData.body}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-400"
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
                <p className="text-lg">Select an email to read</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
