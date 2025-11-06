// app/appform/DataPrivacyConsent.tsx
"use client";

import React from "react";

// Define the props it will accept
type ConsentProps = {
  onAgree: () => void;
  onDisagree: () => void;
};

export default function DataPrivacyConsent({ onAgree, onDisagree }: ConsentProps) {
  return (
    // This container darkens the background
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
      
      {/* This is the modal content from your image */}
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden">
        
        {/* Header */}
        <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Data Privacy Consent</h2>
        </div>

        {/* Body (Scrollable) */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <p className="text-gray-700 mb-4">
            In compliance with the Data Privacy Act of 2012 (R.A. 10173), we would like
            to secure your consent on the collection, use, processing, and disclosure
            of your personal information.
          </p>
          <p className="text-gray-700 mb-4">
            The personal information we will collect will be used for the following
            purposes:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Processing of your application.</li>
            <li>Assessment of your qualifications.</li>
            <li>Verifying the authenticity of your provided information.</li>
            <li>Communicating with you regarding your application status.</li>
          </ul>
          <p className="text-gray-700 mb-4">
            We are committed to ensuring that your personal data is secure and
            protected. Your information will only be accessible to authorized
            personnel and will not be shared with third parties without your
            explicit consent.
          </p>
          <p className="font-semibold text-gray-800">
            By clicking "I Agree", you are giving your full consent to the
            collection and processing of your personal data for the purposes
            stated above.
          </p>
        </div>

        {/* Footer with Buttons */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
          <button
            onClick={onDisagree}
            className="px-6 py-2 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            I Disagree
          </button>
          <button
            onClick={onAgree}
            className="px-6 py-2 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors"
          >
            I Agree
          </button>
        </div>

      </div>
    </div>
  );
}