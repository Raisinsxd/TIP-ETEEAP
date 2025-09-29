"use client";

// This component receives state and functions as props from page.tsx
export default function SelfReportForm({ formData, setFormData, nextStep, prevStep }: { formData: any, setFormData: Function, nextStep: () => void, prevStep: () => void }) {

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    // Updates the main state in page.tsx
    setFormData((prev: any) => ({ 
        ...prev, 
        selfAssessment: { ...prev.selfAssessment, [name]: value } 
    }));
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">
      <form className="bg-white shadow-lg rounded-2xl w-full max-w-3xl flex flex-col">
        <h2 className="text-center font-bold text-xl mt-4 mb-2 text-black">
          APPLICATION FORM AND PRELIMINARY ASSESSMENT FORM
        </h2>

        <div className="flex-1 overflow-y-auto mb-2 max-h-[70vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 px-6 pt-4 pb-6">
          <h3 className="font-semibold text-lg mb-4 text-black">
            II. SELF-REPORT/SELF-ASSESSMENT
          </h3>

          <h4 className="font-semibold text-md mb-3 text-black">
            A. Personal Information
          </h4>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-semibold text-black">
              1. What did you learn about your job?
            </label>
            <textarea
              name="jobLearning"
              rows={3}
              value={formData.selfAssessment.jobLearning}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-lg px-3 py-2 text-black"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-semibold text-black">
              2. What did you learn about working with others?
            </label>
            <textarea
              name="teamworkLearning"
              rows={3}
              value={formData.selfAssessment.teamworkLearning}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-lg px-3 py-2 text-black"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-semibold text-black">
              3. What did you learn about yourself?
            </label>
            <textarea
              name="selfLearning"
              rows={3}
              value={formData.selfAssessment.selfLearning}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-lg px-3 py-2 text-black"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1 text-sm font-semibold text-black">
              4. What were the benefits of your work experience?
            </label>
            <textarea
              name="workBenefits"
              rows={3}
              value={formData.selfAssessment.workBenefits}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-lg px-3 py-2 text-black"
            />
          </div>

          <h4 className="font-semibold text-md mb-3 text-black">
            B. Write an essay on how attaining a degree contributes to your
            personal development, community, workplace, society, and country
          </h4>
          <textarea
            name="essay"
            rows={6}
            value={formData.selfAssessment.essay}
            onChange={handleChange}
            className="w-full border border-gray-400 rounded-lg px-3 py-2 text-black mb-6"
          />
        </div>

        <div className="flex justify-between mt-2 px-6 pb-4">
          <button type="button" onClick={prevStep} className="bg-gray-300 text-black font-semibold py-2 px-6 rounded-lg hover:bg-gray-400 transition-colors">
            ← Back
          </button>
          <button type="button" onClick={nextStep} className="bg-yellow-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-yellow-600 transition-colors">
            Next →
          </button>
        </div>
      </form>
    </div>
  );
}