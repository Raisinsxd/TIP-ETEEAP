// appform/i.tsx
"use client";

import { Plus, Minus } from "lucide-react";

type CreativeWork = {
  title: string;
  institution: string;
  dates: string;
};

// This component now receives state and functions as props from page.tsx
export default function CreativeWorksForm({ formData, setFormData, nextStep, prevStep }: { formData: any, setFormData: Function, nextStep: () => void, prevStep: () => void }) {
  
  // Get the specific data for this form from the formData prop
  const works: CreativeWork[] = formData.creativeWorks || [];

  const handleWorkChange = (index: number, field: keyof CreativeWork, value: string) => {
    const updated = [...works];
    updated[index] = { ...updated[index], [field]: value };
    // Update the main state in page.tsx
    setFormData((prev: any) => ({ ...prev, creativeWorks: updated }));
  };

  const addWork = () => {
    // Update the main state in page.tsx
    setFormData((prev: any) => ({
      ...prev,
      creativeWorks: [...prev.creativeWorks, { title: "", institution: "", dates: "" }],
    }));
  };

  const removeWork = (index: number) => {
    const updated = works.filter((_, i) => i !== index);
    // Update the main state in page.tsx
    setFormData((prev: any) => ({ ...prev, creativeWorks: updated }));
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">
      <form className="bg-white shadow-lg rounded-2xl w-full max-w-3xl flex flex-col">
        <h2 className="text-center font-bold text-xl mt-4 mb-2 text-black">
          APPLICATION FORM AND PRELIMINARY ASSESSMENT FORM
        </h2>

        <div className="bg-yellow-100 text-black px-6 py-3 rounded-lg text-sm mb-4 flex items-center gap-2 mx-auto w-full max-w-2xl text-center shadow">
          <span>⚠️</span>
          <span>All information indicated herein shall be certified true copy and notarized</span>
        </div>

        <div className="flex-1 overflow-y-auto mb-2 max-h-[70vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 px-6 pt-4 pb-6">
          <h3 className="font-semibold text-lg mb-2 text-black">
            I. Creative Works and Special Accomplishments
          </h3>
          <p className="italic text-sm text-gray-700 mb-4 leading-relaxed">
            (Please enumerate the various creative works and special accomplishments you have done in the past...)
          </p>

          {works.map((work, idx) => (
            <div key={idx} className="border border-gray-300 rounded-xl p-4 mb-4 bg-gray-50 shadow-sm">
              <div className="mb-3">
                <label className="block text-sm font-semibold text-black mb-1">Title and Brief Description:</label>
                <input type="text" value={work.title} onChange={(e) => handleWorkChange(idx, "title", e.target.value)} className="w-full border border-gray-400 rounded-lg px-3 py-2 text-black bg-white"/>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-semibold text-black mb-1">Name and Address of the Institution/Industry/Agency:</label>
                <input type="text" value={work.institution} onChange={(e) => handleWorkChange(idx, "institution", e.target.value)} className="w-full border border-gray-400 rounded-lg px-3 py-2 text-black bg-white"/>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-semibold text-black mb-1">Inclusive Dates of Attendance:</label>
                <input type="text" value={work.dates} onChange={(e) => handleWorkChange(idx, "dates", e.target.value)} className="w-full border border-gray-400 rounded-lg px-3 py-2 text-black bg-white"/>
              </div>

              <div className="flex justify-end gap-2 mt-2">
                {idx > 0 && ( <button type="button" onClick={() => removeWork(idx)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg flex items-center gap-1"><Minus size={16} /> Remove</button>)}
                {idx === works.length - 1 && ( <button type="button" onClick={addWork} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg flex items-center gap-1"><Plus size={16} /> Add</button>)}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation buttons now use props from page.tsx */}
        <div className="flex justify-between mt-2 px-6 pb-4">
          <button type="button" onClick={prevStep} className="bg-gray-300 text-black font-semibold py-2 px-6 rounded-lg hover:bg-gray-400 transition-colors">← Back</button>
          <button type="button" onClick={nextStep} className="bg-yellow-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-yellow-600 transition-colors">Next →</button>
        </div>
      </form>
    </div>
  );
}