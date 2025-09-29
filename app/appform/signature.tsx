"use client";

import { useState } from "react";
// Import all the form step components
import InitialForm from "./a";
import PersonalInformationForm from "./b";
import PrioritiesGoalsForm from "./c-h";
import CreativeWorksForm from "./i";
import LifelongLearningForm from "./j";
import SelfReportForm from "./selfassessment";
import SignatureForm from "./signature";

// HELPER to get today's date
const getTodayDateISO = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

// --- Shared UI Components ---

function Pagination({ currentStep, totalSteps, stepTitles }: { currentStep: number; totalSteps: number; stepTitles: string[] }) {
  if (currentStep > totalSteps + 1) return null;
  const steps = stepTitles.map((title, index) => ({ number: index + 1, title }));
  return (
    <div className="w-full max-w-5xl mb-8">
      <div className="flex items-start justify-center">
        {steps.map((step, index) => {
          const isActive = step.number === currentStep;
          const isCompleted = step.number < currentStep;
          return (
            <div key={step.number} className="flex items-center">
              <div className="flex flex-col items-center text-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-colors duration-300 ${isActive ? "bg-yellow-500 text-white" : isCompleted ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}>
                  {isCompleted ? "✔" : step.number}
                </div>
                <p className={`mt-2 text-xs font-semibold w-20 ${isActive ? "text-yellow-600" : "text-gray-500"}`}>{step.title}</p>
              </div>
              {index < steps.length - 1 && (<div className={`w-24 border-t-2 transition-colors duration-300 ${isCompleted ? "border-green-500" : "border-gray-200"}`}></div>)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SuccessScreen() {
    return (
        <div className="bg-white shadow-lg rounded-2xl w-full max-w-3xl p-12 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-black mb-4">Application Submitted!</h1>
            <p className="text-gray-600">Thank you for completing the form. We have received your application and will review it shortly.</p>
        </div>
    );
}

// --- Main Page Component ---
export default function ApplicationFormPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    initial: { name: "", degree: "", campus: "", date: getTodayDateISO(), folderLink: "", photo: null },
    personalInfo: { fullAddress: "", mobile: "", email: "" },
    goals: { degrees: [""], statement: "" },
    creativeWorks: [{ title: "", institution: "", dates: "" }],
    lifelongLearning: { hobbies: "", skills: "", workActivities: "", volunteer: "", travels: "" },
    selfAssessment: { jobLearning: "", teamworkLearning: "", selfLearning: "", workBenefits: "", essay: "" },
    signature: null,
  });

  const stepTitles = ["Initial Info", "Personal", "Goals", "Creative Works", "Learning", "Self Assessment", "Signature"];
  const totalSteps = stepTitles.length;

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = () => {
    console.log("FINAL FORM DATA:", formData);
    // You would typically send the formData to your API here
    nextStep(); // Move to success screen
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <InitialForm formData={formData} setFormData={setFormData} nextStep={nextStep} />;
      case 2: return <PersonalInformationForm formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 3: return <PrioritiesGoalsForm formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 4: return <CreativeWorksForm formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 5: return <LifelongLearningForm formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 6: return <SelfReportForm formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 7: return <SignatureForm formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} prevStep={prevStep} />;
      case 8: return <SuccessScreen />;
      default: return <div>Form complete or invalid step.</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6 font-sans">
      <Pagination currentStep={currentStep} totalSteps={totalSteps} stepTitles={stepTitles} />
      {renderStep()}
    </div>
  );
}

