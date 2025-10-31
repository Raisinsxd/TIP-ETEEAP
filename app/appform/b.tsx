// appform/b.tsx
"use client";

import { useState } from "react";

export default function PersonalInformationForm({
  formData,
  setFormData,
  nextStep,
  prevStep,
}: {
  formData: any;
  setFormData: Function;
  nextStep: () => void;
  prevStep: () => void;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ✅ FIX: Flatten the state. Save directly to the formData object.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateAndProceed = () => {
    const newErrors: Record<string, string> = {};
    
    // ✅ FIX: Read from the flattened and correctly named formData properties
    const { fullAddress, mobileNumber, emailAddress } = formData;

    if (!fullAddress?.trim()) newErrors.fullAddress = "Full address is required.";

    if (!mobileNumber?.trim()) newErrors.mobileNumber = "Mobile number is required.";
    else if (!/^\d{11}$/.test(mobileNumber))
      newErrors.mobileNumber = "Mobile number must be 11 digits.";

    if (!emailAddress?.trim()) newErrors.emailAddress = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress))
      newErrors.emailAddress = "Please enter a valid email address.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      nextStep();
    }
  };

  return (
    <form
      className="bg-white shadow-lg rounded-2xl w-full max-w-3xl flex flex-col"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="flex-1 overflow-y-auto max-h-[70vh] p-6">
        <h3 className="font-semibold text-lg mb-4 text-black">
          A. Personal Information
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {/* Full Address */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-black">
              Full Address:
            </label>
            <input
              name="fullAddress"
              value={formData.fullAddress || ""}
              onChange={handleChange}
              className={`w-full border rounded-lg p-2 text-black ${
                errors.fullAddress ? "border-red-500" : "border-gray-400"
              }`}
            />
            {errors.fullAddress && (
              <p className="text-red-500 text-sm mt-1">{errors.fullAddress}</p>
            )}
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm font-semibold text-black">
              Mobile Number:
            </label>
            <input
              // ✅ FIX: Use the key d.tsx expects
              name="mobileNumber"
              value={formData.mobileNumber || ""}
              onChange={handleChange}
              maxLength={11}
              placeholder="09XXXXXXXXX"
              className={`w-full border rounded-lg p-2 text-black ${
                errors.mobileNumber ? "border-red-500" : "border-gray-400"
              }`}
            />
            {errors.mobileNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-black">
              Email:
            </label>
            <input
              // ✅ FIX: Use the key d.tsx expects
              name="emailAddress"
              type="email"
              value={formData.emailAddress || ""}
              onChange={handleChange}
              className={`w-full border rounded-lg p-2 text-black ${
                errors.emailAddress ? "border-red-500" : "border-gray-400"
              }`}
            />
            {errors.emailAddress && (
              <p className="text-red-500 text-sm mt-1">{errors.emailAddress}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between p-6">
        <button
          type="button"
          onClick={prevStep}
          className="bg-gray-300 text-black font-semibold py-2 px-6 rounded-lg"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={validateAndProceed}
          className="bg-yellow-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-yellow-600"
        >
          Next →
        </button>
      </div>
    </form>
  );
}