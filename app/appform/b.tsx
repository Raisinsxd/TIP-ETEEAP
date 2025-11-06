"use client";

import { useState } from "react";

export default function PersonalInformationForm({
  formData, // This is formData.personalInfo, e.g., { fullAddress: ..., mobile: ..., email: ... }
  setFormData, // This is handlePersonalChange
  nextStep,
  prevStep,
}: {
  formData: any;
  setFormData: Function;
  nextStep: () => void;
  prevStep: () => void;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  // --- This function is for most text inputs ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // --- NEW: This function calculates age from a date string ---
  const calculateAge = (dateString: string): number => {
    if (!dateString) return 0;
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    // Check if the birthday has occurred this year
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // --- NEW: Special handler for the date picker ---
  // It updates both the birthDate and the calculated age
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; // name will be "birthDate"
    const calculatedAge = calculateAge(value);

    setFormData({
      ...formData,
      [name]: value, // Update birthDate
      age: calculatedAge, // Update age
    });

    if (errors.birthDate) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateAndProceed = () => {
    const newErrors: Record<string, string> = {};
    
    // Read all fields from the 'personalInfo' object
    const { fullAddress, mobile, email, birthDate } = formData;

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

    // --- NEW: Validation for birthDate ---
    if (!birthDate?.trim()) {
      newErrors.birthDate = "Date of birth is required.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      nextStep();
    }
  };

  // --- This default object ensures formData.age exists on first render ---
  const data = formData || { 
    fullAddress: "", 
    mobile: "", 
    email: "", 
    birthDate: "", 
    age: "" 
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
              value={data.fullAddress || ""}
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
              name="mobile"
              type="tel"
              value={data.mobile || ""}
              onChange={(e) => {
                const value = e.target.value;
                // Regex to allow only numbers (or an empty string)
                const numericRegex = /^[0-9]*$/;
                
                // Only call the original handleChange if the new value is numeric
                if (numericRegex.test(value)) {
                  handleChange(e);
                }
              }}
              maxLength={13} 
              inputMode="numeric" // Added for better mobile UX
              placeholder="09XXXXXXXXX"
              className={`w-full border rounded-lg p-2 text-black ${
                errors.mobile ? "border-red-500" : "border-gray-400"
              }`}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-black">
              Email:
            </label>
            <input
              name="email"
              type="email"
              value={data.email || ""}
              onChange={handleChange}
              className={`w-full border rounded-lg p-2 text-black ${
                errors.email ? "border-red-500" : "border-gray-400"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* --- NEW: Date of Birth --- */}
          <div>
            <label className="block text-sm font-semibold text-black">
              Date of Birth:
            </label>
            <input
              name="birthDate"
              type="date"
              value={data.birthDate || ""}
              onChange={handleDateChange} // Use the special handler
              max={new Date().toISOString().split("T")[0]} // Cannot be born in the future
              className={`w-full border rounded-lg p-2 text-black ${
                errors.birthDate ? "border-red-500" : "border-gray-400"
              }`}
            />
            {errors.birthDate && (
              <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>
            )}
          </div>

          {/* --- NEW: Age --- */}
          <div>
            <label className="block text-sm font-semibold text-black">
              Age:
            </label>
            <input
              name="age"
              type="number"
              value={data.age || ""}
              readOnly // Makes the input non-editable
              placeholder="Age (auto-calculated)"
              className="w-full border rounded-lg p-2 text-black bg-gray-100 cursor-not-allowed"
            />
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