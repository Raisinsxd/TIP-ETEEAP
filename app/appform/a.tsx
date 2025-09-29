// appform/a.tsx
"use client";

import { useState } from "react";
import { Camera } from "lucide-react";

export default function InitialForm({ formData, setFormData, nextStep }: { formData: any, setFormData: Function, nextStep: () => void }) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, initial: { ...prev.initial, [name]: value } }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
      setFormData((prev: any) => ({ ...prev, initial: { ...prev.initial, photo: file } }));
      if (errors.photo) setErrors(prev => ({ ...prev, photo: '' }));
    }
  };

  const validateAndProceed = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.initial.name.trim()) newErrors.name = "Name is required.";
    if (!formData.initial.degree) newErrors.degree = "Degree is required.";
    if (!formData.initial.campus) newErrors.campus = "Campus is required.";
    if (!formData.initial.folderLink.trim()) newErrors.folderLink = "Folder link is required.";
    if (!formData.initial.photo) newErrors.photo = "Photo is required.";
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      nextStep();
    }
  };

  return (
    <form className="bg-white shadow-lg rounded-2xl w-full max-w-3xl p-6">
      <h2 className="text-center font-bold text-xl mb-4 text-black">APPLICATION FORM AND PRELIMINARY ASSESSMENT FORM</h2>
      <div className="grid grid-cols-3 gap-4 items-start mb-4">
        <div className="col-span-2">
          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold text-black">Name of the Applicant:</label>
            <input type="text" name="name" value={formData.initial.name} onChange={handleChange} className={`w-full border rounded-lg px-3 py-2 text-black ${errors.name ? 'border-red-500' : 'border-gray-400'}`} />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold text-black">Degree Applied For:</label>
            <select name="degree" value={formData.initial.degree} onChange={handleChange} className={`w-full border rounded-lg px-3 py-2 text-black ${errors.degree ? 'border-red-500' : 'border-gray-400'}`}>
              <option value="">Select degree</option>
              <option value="BSCS">BSCS (Computer Science)</option>
              <option value="BSIT">BSIT (Information Technology)</option>
              <option value="BSIS">BSIS (Information Systems)</option>
              <option value="BSCpE">BSCpE (Computer Engineering)</option>
              <option value="BSIE">BSIE (Industrial Engineering)</option>
              <optgroup label="BSBA (Business Administration)">
                <option value="Logistics and Supply Chain Management">Logistics and Supply Chain Management</option>
                <option value="Financial Management">Financial Management</option>
                <option value="Human Resources Management">Human Resources Management</option>
                <option value="Marketing Management">Marketing Management</option>
              </optgroup>
            </select>
            {errors.degree && <p className="text-red-500 text-sm mt-1">{errors.degree}</p>}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <label htmlFor="photo-upload" className={`w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center cursor-pointer overflow-hidden ${errors.photo ? 'ring-2 ring-red-500' : ''}`}>
            {photoPreview ? <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" /> : <Camera className="text-white w-8 h-8" />}
          </label>
          <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
          <p className="text-sm mt-2 text-black">Add Photo</p>
          {errors.photo && <p className="text-red-500 text-sm mt-1">{errors.photo}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2 text-sm font-semibold text-black">Campus:</label>
          <select name="campus" value={formData.initial.campus} onChange={handleChange} className={`w-full border rounded-lg px-3 py-2 text-black ${errors.campus ? 'border-red-500' : 'border-gray-400'}`}>
            <option value="">Select campus</option>
            <option value="QC">Quezon City</option>
            <option value="Manila">Manila</option>
          </select>
          {errors.campus && <p className="text-red-500 text-sm mt-1">{errors.campus}</p>}
        </div>
        <div>
          <label className="block mb-2 text-sm font-semibold text-black">Date of Application:</label>
          <input type="date" name="date" value={formData.initial.date} readOnly className="w-full border rounded-lg px-3 py-2 text-black bg-gray-100 cursor-not-allowed" />
        </div>
      </div>
      <div className="mb-4">
        <label className="block mb-2 text-sm font-semibold text-black">Folder Link (e.g., Google Drive):</label>
        <input type="url" name="folderLink" value={formData.initial.folderLink} onChange={handleChange} className={`w-full border rounded-lg px-3 py-2 text-black ${errors.folderLink ? 'border-red-500' : 'border-gray-400'}`} />
        {errors.folderLink && <p className="text-red-500 text-sm mt-1">{errors.folderLink}</p>}
      </div>
      <button type="button" onClick={validateAndProceed} className="w-full bg-yellow-500 text-white font-semibold py-2 rounded-lg hover:bg-yellow-600">
        Proceed →
      </button>
    </form>
  );
}