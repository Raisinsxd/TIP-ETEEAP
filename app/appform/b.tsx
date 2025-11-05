"use client";

import { useState } from "react";

export default function PersonalInformationForm({
  formData, // This is NOW formData.personalInfo, e.g., { fullAddress: ..., mobile: ..., email: ... }
  setFormData, // This is NOW handlePersonalChange
  nextStep,
  prevStep,
}: {
  formData: any;
  setFormData: Function;
  nextStep: () => void;
  prevStep: () => void;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 🔽🔽🔽 --- FIX #1: Correct handleChange --- 🔽🔽🔽
  // We must pass the NEW 'personalInfo' object to setFormData, not a function
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // 🔽🔽🔽 --- FIX #2: Correct validateAndProceed --- 🔽🔽🔽
  const validateAndProceed = () => {
    const newErrors: Record<string, string> = {};
    
    // Read 'mobile' and 'email' (must match the state in page.tsx)
    const { fullAddress, mobile, email } = formData;

    if (!fullAddress?.trim()) newErrors.fullAddress = "Full address is required.";

    if (!mobile?.trim()) {
      newErrors.mobile = "Mobile number is required.";
    } else if (!/^(09|\+639)\d{9}$/.test(mobile)) { // Use a regex for PH numbers
       newErrors.mobile = "Please enter a valid PH mobile number (e.g., 09xxxxxxxxx).";
    }

    if (!email?.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

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

        {/* 🔽🔽🔽 --- FIX #3: Correct JSX name, value, and error props --- 🔽🔽🔽 */}
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
              name="mobile" // Use 'mobile'
              type="tel"
              value={formData.mobile || ""} // Use 'mobile'
              onChange={handleChange}
              maxLength={13} // Allow for +63
              placeholder="09XXXXXXXXX"
              className={`w-full border rounded-lg p-2 text-black ${
                errors.mobile ? "border-red-500" : "border-gray-400" // Use 'mobile'
              }`}
            />
            {errors.mobile && (
              <p className="text-red-500 text-sm mt-1">{errors.mobile}</p> // Use 'mobile'
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-black">
              Email:
            </label>
            <input
              name="email" // Use 'email'
              type="email"
              value={formData.email || ""} // Use 'email'
              onChange={handleChange}
              className={`w-full border rounded-lg p-2 text-black ${
                errors.email ? "border-red-500" : "border-gray-400" // Use 'email'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p> // Use 'email'
            )}
          </div>
        </div>
        {/* 🔼🔼🔼 --- END OF FIXES --- 🔼🔼🔼 */}
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

