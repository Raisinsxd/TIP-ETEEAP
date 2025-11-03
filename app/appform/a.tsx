"use client";

import { useState } from "react";
import { Camera } from "lucide-react";

export default function InitialForm({
  formData,
  setFormData,
  nextStep,
}: {
  formData: any; // Receives the full state { initial: {...}, personalInfo: {...}, ... }
  setFormData: Function;
  nextStep: () => void;
}) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    // ✅ FIX: Read from formData.initial.photo
    formData.initial.photo ? URL.createObjectURL(formData.initial.photo) : null
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    // ✅ FIX: Save data inside the 'initial' object
    setFormData((prev: any) => ({
      ...prev,
      initial: {
        ...prev.initial,
        [name]: value, // e.g., 'name': 'John Doe'
      }
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setErrors((prev) => ({
          ...prev,
          photo: "Image size must be less than 2MB.", // ✅ FIX: Use 'photo'
        }));
        return;
      }

      setPhotoPreview(URL.createObjectURL(file));
      // ✅ FIX: Save the file object to 'initial.photo'
      setFormData((prev: any) => ({
        ...prev,
        initial: {
          ...prev.initial,
          photo: file,
        }
      }));
      if (errors.photo) setErrors((prev) => ({ ...prev, photo: "" }));
    }
  };

  const validateAndProceed = () => {
    const newErrors: Record<string, string> = {};
    
    // ✅ FIX: Read from the nested 'initial' object
    const { name, degree, campus, folderLink, photo } = formData.initial;

    // ✅ FIX: Validate the correct property names
    if (!name?.trim()) newErrors.name = "Name is required.";
    if (!degree) newErrors.degree = "Degree is required.";
    if (!campus) newErrors.campus = "Campus is required.";
    if (!photo) newErrors.photo = "Photo is required.";

    if (!folderLink?.trim()) {
      newErrors.folderLink = "Folder link is required.";
    } else {
      try {
        new URL(folderLink);
      } catch {
        newErrors.folderLink = "Invalid URL format.";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      nextStep();
    }
  };

  return (
    <form
      className="bg-white shadow-lg rounded-2xl w-full max-w-3xl p-6"
      onSubmit={(e) => e.preventDefault()}
    >
      <h2 className="text-center font-bold text-xl mb-4 text-black">
        APPLICATION FORM AND PRELIMINARY ASSESSMENT FORM
      </h2>

      <div className="grid grid-cols-3 gap-4 items-start mb-4">
        <div className="col-span-2">
          {/* Name */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold text-black">
              Name of the Applicant:
            </label>
            <input
              type="text"
              // ✅ FIX: Use 'name'
              name="name" 
              value={formData.initial.name || ""} // ✅ FIX: Read from initial
              onChange={handleChange}
              className={`w-full border rounded-lg px-3 py-2 text-black ${
                errors.name ? "border-red-500" : "border-gray-400" // ✅ FIX: Check errors.name
              }`}
            />
            {errors.name && ( // ✅ FIX: Check errors.name
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Degree */}
          <div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-black">
                Degree Applied For:
              </label>
              <select
                // ✅ FIX: Use 'degree'
                name="degree"
                value={formData.initial.degree || ""} // ✅ FIX: Read from initial
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2 text-black ${
                  errors.degree ? "border-red-500" : "border-gray-400" // ✅ FIX: Check errors.degree
                }`}
              >
                <option value="">Select degree</option>
                <option value="BSCS">BSCS (Computer Science)</option>
                <option value="BSIS">BSIS (Information Systems)</option>
                <option value="BSIT">BSIT (Information Technology)</option>
                <option value="BSCpE">BSCpE (Computer Engineering)</option>
                <option value="BSIE">BSIE (Industrial Engineering)</option>
                <optgroup label="Bachelor of Science in Business Administration">
                  <option value="BSBA-LSCM">BSBA (Logistics and Supply Chain Management)</option>
                  <option value="BSBA-FM">BSBA (Financial Management)</option>
                  <option value="BSBA-HRM">BSBA (Human Resources Management)</option>
                  <option value="BSBA-MM">BSBA (Marketing Management)</option>
                </optgroup>
              </select>
              {errors.degree && ( // ✅ FIX: Check errors.degree
                <p className="text-red-500 text-sm mt-1">{errors.degree}</p>
              )}
            </div>
          </div>
        </div> 

        {/* Photo */}
        <div className="flex flex-col items-center justify-center">
          <label
            htmlFor="photo-upload"
            className={`w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center cursor-pointer overflow-hidden ${
              errors.photo ? "ring-2 ring-red-500" : "" // ✅ FIX: Check errors.photo
            }`}
          >
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <Camera className="text-white w-8 h-8" />
            )}
          </label>
          <input
            id="photo-upload"
            type="file"
            accept="image/jpeg,image/png"
            onChange={handlePhotoUpload}
            className="hidden"
          />
          <p className="text-sm mt-2 text-black">Add Photo</p>
          {errors.photo && ( // ✅ FIX: Check errors.photo
            <p className="text-red-500 text-sm mt-1">{errors.photo}</p>
          )}
        </div>
      </div>

      {/* Campus */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-semibold text-black">
          Campus:
        </label>
        <select
          name="campus"
          value={formData.initial.campus || ""} // ✅ FIX: Read from initial
          onChange={handleChange}
          className={`w-full border rounded-lg px-3 py-2 text-black ${
            errors.campus ? "border-red-500" : "border-gray-400"
          }`}
        >
          <option value="">Select campus</option>
          <option value="QC">Quezon City</option>
          <option value="Manila">Manila</option>
        </select>
        {errors.campus && (
          <p className="text-red-500 text-sm mt-1">{errors.campus}</p>
        )}
      </div>

      {/* Folder Link */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-semibold text-black">
          Folder Link (e.g., Google Drive):
        </label>
        <input
          type="url"
          name="folderLink"
          value={formData.initial.folderLink || ""} // ✅ FIX: Read from initial
          onChange={handleChange}
          className={`w-full border rounded-lg px-3 py-2 text-black ${
            errors.folderLink ? "border-red-500" : "border-gray-400"
          }`}
        />
        {errors.folderLink && (
          <p className="text-red-500 text-sm mt-1">{errors.folderLink}</p>
        )}
      </div>

      <button
        type="button"
        onClick={validateAndProceed}
        className="w-full bg-yellow-500 text-white font-semibold py-2 rounded-lg hover:bg-yellow-600"
      >
        Proceed →
      </button>
    </form>
  );
}