// appform/b.tsx
"use client";

export default function PersonalInformationForm({ formData, setFormData, nextStep, prevStep }: { formData: any, setFormData: Function, nextStep: () => void, prevStep: () => void }) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, personalInfo: { ...prev.personalInfo, [name]: value } }));
  };

  return (
    <form className="bg-white shadow-lg rounded-2xl w-full max-w-3xl flex flex-col">
      <div className="flex-1 overflow-y-auto max-h-[70vh] p-6">
        <h3 className="font-semibold text-lg mb-4 text-black">A. Personal Information</h3>
        <div className="grid grid-cols-2 gap-4">
          
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-black">Full Address:</label>
            <input name="fullAddress" value={formData.personalInfo.fullAddress} onChange={handleChange} className="w-full border border-gray-400 rounded-lg p-2 text-black" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black">Mobile Number:</label>
            <input name="mobile" value={formData.personalInfo.mobile} onChange={handleChange} className="w-full border border-gray-400 rounded-lg p-2 text-black" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-black">Email:</label>
            <input name="email" value={formData.personalInfo.email} onChange={handleChange} className="w-full border border-gray-400 rounded-lg p-2 text-black" />
          </div>

        </div>
      </div>
      <div className="flex justify-between p-6">
        <button type="button" onClick={prevStep} className="bg-gray-300 text-black font-semibold py-2 px-6 rounded-lg">← Back</button>
        <button type="button" onClick={nextStep} className="bg-yellow-500 text-white font-semibold py-2 px-6 rounded-lg">Next →</button>
      </div>
    </form>
  );
}