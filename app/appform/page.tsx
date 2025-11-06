"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useSession } from "next-auth/react";
import { PenTool, Loader2 } from "lucide-react";
import SignatureCanvas from 'react-signature-canvas';
import InitialForm from "./a";
import PersonalInformationForm from "./b";
import PrioritiesGoalsForm from "./c-h";
import BackgroundAchievementsForm from "./d"; //missing page
import CreativeWorksForm from "./i";
import LifelongLearningForm from "./j";
import SelfReportForm from "./selfassessment";
import { useRouter } from 'next/navigation'; // For the "Disagree" button
import DataPrivacyConsent from './undertaking'; // Import the new component

// ✅ 2. Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const getTodayDateISO = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
};

// --- Pagination Component ---
function Pagination({ currentStep, totalSteps, stepTitles }: { currentStep: number; totalSteps: number; stepTitles: string[] }) {
    // ... (Your existing Pagination code)
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

// --- Success Screen Component ---
function SuccessScreen() {
    // ... (Component code is unchanged)
    return (
        <div className="bg-white shadow-lg rounded-2xl w-full max-w-3xl p-12 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-black mb-4">Application Submitted!</h1>
            <p className="text-gray-600">Thank you for completing the form. We have received your application and will review it shortly.</p>
        </div>
    );
}

// --- Final Review Step Component ---
function FinalReviewStep({ nextStep, prevStep, signaturePadRef, isSubmitting }: {
    // ... (Component code is unchanged)
    nextStep: () => void,
    prevStep: () => void,
    signaturePadRef: React.RefObject<SignatureCanvas | null>,
    isSubmitting: boolean
}) {
    const [signatureError, setSignatureError] = useState<string | null>(null);

    const handleFinalSubmit = () => {
        if (signaturePadRef.current?.isEmpty()) {
            setSignatureError("A signature is required to submit the application.");
            return;
        }
        setSignatureError(null);
        nextStep(); // This calls the main handleSubmit function
    };

    return (
        <div className="bg-white shadow-lg rounded-2xl w-full max-w-3xl flex flex-col p-8 space-y-6">
            <div className="text-center">
                <h3 className="font-semibold text-2xl mb-2 text-black">Final Step: Review and Submit</h3>
                <p className="text-gray-600">
                    By signing below, I declare that all information provided is true and correct.
                </p>
            </div>

            <div className="pt-4 border-t border-gray-200">
                <h3 className="font-bold text-lg mb-2 flex items-center text-gray-800">
                    <PenTool size={20} className="mr-2 text-yellow-600" />
                    Applicant's Signature
                </h3>
                <div className="border rounded-lg overflow-hidden bg-gray-50">
                    <SignatureCanvas
                        ref={signaturePadRef} // Use the ref passed from the parent
                        penColor='black'
                        canvasProps={{ className: 'w-full h-40' }}
                    />
                </div>
                {signatureError && <p className="mt-2 text-sm text-red-600">{signatureError}</p>}
                <button
                    type="button"
                    onClick={() => signaturePadRef.current?.clear()}
                    className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                    Clear Signature
                </button>
            </div>

            <div className="flex justify-between pt-4">
                <button type="button" onClick={prevStep} disabled={isSubmitting} className="bg-gray-300 text-black font-semibold py-2 px-6 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50">
                    ← Back
                </button>
                <button
                    type="button"
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting}
                    className="bg-green-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 disabled:bg-gray-400"
                >
                    {isSubmitting && <Loader2 className="animate-spin" size={18} />}
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
            </div>
        </div>
    )
}

// --- Main Page Component ---
export default function ApplicationFormPage() {
    const { data: session } = useSession(); // Get the user's session
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const signaturePadRef = useRef<SignatureCanvas>(null);

    // --- ✅ 1. HOOKS MOVED INSIDE & STATE CHANGED ---
    const [hasConsented, setHasConsented] = useState(false); // Default to false
    // We no longer need isLoadingConsent
    const router = useRouter();
    // ---

    // [Inside ApplicationFormPage component]
    const [formData, setFormData] = useState({
        initial: { name: "", degree: "", campus: "", date: getTodayDateISO(), folderLink: "", photo: null as File | null },
        personalInfo: { fullAddress: "", mobile: "", email: "", birthDate: "", age: null as number | null },
        goals: { degrees: [""], statement: "" },
        education: { tertiary: [], secondary: [], elementary: [], technical: [] },
        nonFormal: [] as any[],
        certifications: [] as any[],
        publications: [] as any[],
        inventions: [] as any[],
        work: { employment: [], consultancy: [], selfEmployment: [] },
        recognitions: [] as any[],
        professional_development: { memberships: [], projects: [], research: [] },
        creativeWorks: [{ title: "", institution: "", dates: "" }],
        lifelongLearning: { hobbies: "", skills: "", workActivities: "", volunteer: "", travels: "" },
        selfAssessment: { jobLearning: "", teamworkLearning: "", selfLearning: "", workBenefits: "", essay: "" }
    });

    const stepTitles = [
        "Initial Info",
        "Personal",
        "Goals",
        "Background & Achievements", // d.tsx
        "Creative Works",
        "Learning",
        "Self Assessment",
        "Submit",
    ];

    const totalSteps = stepTitles.length;

    // Load data from localStorage on mount
    useEffect(() => {
        try {
            const savedData = localStorage.getItem('applicationFormData');
            const savedStep = localStorage.getItem('applicationFormStep');

            if (savedData) {
                const parsedData = JSON.parse(savedData);

                // ✅ FIX: Robustly merge the loaded data
                setFormData(prev => {
                    // Start with a clean copy of the default state
                    const newState = JSON.parse(JSON.stringify(prev));

                    // Safely merge each top-level key
                    (Object.keys(prev) as Array<keyof typeof prev>).forEach(key => {
                        if (parsedData[key] !== undefined) {
                            if (typeof newState[key] === 'object' && !Array.isArray(newState[key]) && newState[key] !== null) {
                                // It's an object (like initial, personalInfo, goals)
                                // Merge it, but don't allow null to overwrite the object
                                newState[key] = { ...prev[key], ...(parsedData[key] || {}) };
                            } else {
                                // It's a primitive, array, or null
                                // Allow parsedData to overwrite
                                newState[key] = parsedData[key];
                            }
                        }
                    });

                    // --- Post-Merge Sanity Checks (The real fix) ---
                    // This ensures the nested objects have the correct structure
                    // no matter what localStorage had.

                    // 1. Ensure 'initial' is correct
                    newState.initial = { ...prev.initial, ...(newState.initial || {}) };
                    newState.initial.photo = prev.initial.photo; // Always reset file

                    // 2. Ensure 'goals' is correct and 'degrees' is an array
                    newState.goals = { ...prev.goals, ...(newState.goals || {}) };
                    if (!Array.isArray(newState.goals.degrees)) {
                        newState.goals.degrees = [""]; // Force it to be an array
                    }

                    // 3. Ensure 'personalInfo' is correct
                    newState.personalInfo = { ...prev.personalInfo, ...(newState.personalInfo || {}) };

                    // 4. Ensure other nested objects are correct
                    newState.education = { ...prev.education, ...(newState.education || {}) };
                    newState.work = { ...prev.work, ...(newState.work || {}) };
                    newState.lifelongLearning = { ...prev.lifelongLearning, ...(newState.lifelongLearning || {}) };
                    newState.selfAssessment = { ...prev.selfAssessment, ...(newState.selfAssessment || {}) };

                    // 5. Ensure array keys are arrays
                    if (!Array.isArray(newState.nonFormal)) newState.nonFormal = [];
                    if (!Array.isArray(newState.certifications)) newState.certifications = [];
                    if (!Array.isArray(newState.publications)) newState.publications = [];
                    if (!Array.isArray(newState.inventions)) newState.inventions = [];
                    if (!Array.isArray(newState.recognitions)) newState.recognitions = [];
                    if (!Array.isArray(newState.creativeWorks)) newState.creativeWorks = [{ title: "", institution: "", dates: "" }];

                    return newState;
                });
            }
            if (savedStep) {
                const step = parseInt(savedStep, 10);
                if (step < totalSteps + 2) {
                    setCurrentStep(step);
                }
            }
        } catch (error) {
            console.error("Failed to load form data from local storage", error);
            // If loading fails, clear the bad data
            localStorage.removeItem('applicationFormData');
            localStorage.removeItem('applicationFormStep');
        }
    }, []); // Run only once on mount

    // --- ✅ 2. REMOVED USEEFFECT THAT CHECKED CONSENT ---
    // (That useEffect is no longer here)

    // Save data to localStorage when it changes
    useEffect(() => {
        // Only save data if user has consented
        if (hasConsented && currentStep < totalSteps + 2) {
            const dataToSave = JSON.parse(JSON.stringify(formData));

            // ✅ FIX: Check if dataToSave.initial exists first
            if (dataToSave.initial && dataToSave.initial.photo) {
                delete dataToSave.initial.photo;
            }
            localStorage.setItem('applicationFormData', JSON.stringify(dataToSave));
            localStorage.setItem('applicationFormStep', currentStep.toString());
        }
    }, [formData, currentStep, hasConsented]); // Added hasConsented dependency

    const nextStep = () => setCurrentStep((prev) => prev + 1);
    const prevStep = () => setCurrentStep((prev) => prev - 1);

    // Helper to update a specific slice of state
    const createFormUpdater = (key: keyof typeof formData) => {
        return (data: any) => {
            setFormData((prev) => ({
                ...prev,
                [key]: data,
            }));
        };
    };

    // Create a specific handler for each step
    const handleInitialChange = createFormUpdater('initial');
    const handlePersonalChange = createFormUpdater('personalInfo');
    const handleGoalsChange = createFormUpdater('goals');

    // This one handler will update all keys from d.tsx
    const handleBackgroundChange = (updatedData: any) => {
        setFormData(prev => ({
            ...prev,
            ...updatedData // Assumes d.tsx passes back { education: ..., work: ..., etc. }
        }));
    };

    const handleCreativeWorksChange = createFormUpdater('creativeWorks');
    const handleLearningChange = createFormUpdater('lifelongLearning');
    const handleSelfAssessmentChange = createFormUpdater('selfAssessment');

    // --- ✅ 3. MODIFIED CONSENT HANDLER FUNCTIONS ---
    const handleConsentAgree = () => {
        // We no longer save to localStorage. Just set the state.
        setHasConsented(true);
    };

    const handleConsentDisagree = () => {
        // Send the user back to the dashboard or home page
        router.push('/'); // <-- You can change this path
    };
    // ---

    // ✅ The handleSubmit function WITH the UUID lookup and console.log
    const handleSubmit = async () => {
        setIsSubmitting(true);

        // --- 1. Validation ---
        if (!session?.user?.email || !session?.user?.id) { // Also check for id
            alert("You must be logged in to submit.");
            setIsSubmitting(false);
            return;
        }

        // ✅ Add console.log here as requested
        console.log("Current session user ID (from NextAuth):", session.user.id);

        const signatureDataUrl = signaturePadRef.current?.toDataURL('image/png');
        if (signaturePadRef.current?.isEmpty() || !signatureDataUrl) {
            alert("Signature is empty.");
            setIsSubmitting(false);
            return;
        }
        const photoFile = formData.initial.photo;
        if (!photoFile) {
            alert("1x1 Photo is missing from Step 1.");
            setIsSubmitting(false);
            return;
        }

        try {
            // --- 2. Look up the Supabase UUID using the email ---
            // ⚠️ Make sure 'users' is the correct table name and 'id' is the column with the Supabase UUID
            console.log(`Looking up user with email: ${session.user.email}`);



            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('id')
                .eq('email', session.user.email)
                .single();

            if (userError) {
                console.error("Session User:", session.user);
                console.error("User lookup error details:", userError);
                throw new Error(`Database error: ${userError.message}`);
            }

            if (!userData?.id) {
                throw new Error(`Could not find a matching user in the database for email ${session.user.email}. Please ensure your account is properly set up.`);
            }
            const supabaseUserId = userData.id; // This is the correct UUID
            console.log("Found Supabase User UUID:", supabaseUserId); // Debug log for found UUID

            // --- 3. Upload Photo using the correct UUID ---
            const photoFilePath = `${supabaseUserId}/photo_${Date.now()}_${photoFile.name}`;
            console.log("Uploading photo to:", photoFilePath); // Debug log for upload path
            const { data: photoUploadData, error: photoUploadError } = await supabase.storage
                .from('application_files')
                .upload(photoFilePath, photoFile, { upsert: true });
            if (photoUploadError) {
                console.error("Photo upload error details:", photoUploadError); // Log specific upload error
                throw photoUploadError;
            }
            const { data: photoUrlData } = supabase.storage.from('application_files').getPublicUrl(photoUploadData.path);
            console.log("Photo uploaded to URL:", photoUrlData.publicUrl); // Debug log for photo URL

            // --- 4. Upload Signature using the correct UUID ---
            const response = await fetch(signatureDataUrl);
            const blob = await response.blob();
            const signatureFile = new File([blob], `signature_${Date.now()}.png`, { type: "image/png" });
            const signatureFilePath = `${supabaseUserId}/signature_${signatureFile.name}`;
            console.log("Uploading signature to:", signatureFilePath); // Debug log for upload path

            const { data: sigUploadData, error: sigUploadError } = await supabase.storage
                .from('application_files')
                .upload(signatureFilePath, signatureFile, { upsert: true });
            if (sigUploadError) {
                console.error("Signature upload error details:", sigUploadError); // Log specific upload error
                throw sigUploadError;
            }
            const { data: sigUrlData } = supabase.storage.from('application_files').getPublicUrl(sigUploadData.path);
            console.log("Signature uploaded to URL:", sigUrlData.publicUrl); // Debug log for signature URL

            // --- 5. Prepare and Insert Data using the correct UUID ---
            console.log("Preparing data for insertion with user_id:", supabaseUserId); // Debug log before insert
            const insertPayload = {
                user_id: supabaseUserId, // ✅ Use the UUID found in the lookup
                applicant_name: formData.initial.name,
                degree_applied_for: formData.initial.degree,
                campus: formData.initial.campus,
                application_date: formData.initial.date,
                folder_link: formData.initial.folderLink,
                full_address: formData.personalInfo.fullAddress,
                mobile_number: formData.personalInfo.mobile,
                email_address: formData.personalInfo.email,
                age: formData.personalInfo.age,
                birth_date: formData.personalInfo.birthDate,
                goal_statement: formData.goals.statement,
                degree_priorities: formData.goals.degrees,
                creative_works: formData.creativeWorks,
                lifelong_learning: formData.lifelongLearning,
                self_assessment: formData.selfAssessment,
                photo_url: photoUrlData.publicUrl,
                signature_url: sigUrlData.publicUrl,
                // --- 👇 ADDED KEYS FROM d.tsx ---
                education_background: formData.education,
                non_formal_education: formData.nonFormal,
                certifications: formData.certifications,
                publications: formData.publications,
                inventions: formData.inventions,
                work_experiences: formData.work,
                recognitions: formData.recognitions,
                // ---------------------------------
                professional_development: formData.professional_development,
            };
            console.log("Insert Payload:", insertPayload); // Log the data being sent

            const { error: insertError } = await supabase
                .from('applications')
                .insert(insertPayload);

            if (insertError) {
                console.error("Database insert error details:", insertError); // Log specific insert error
                throw insertError;
            }
            console.log("Data inserted successfully!"); // Debug log for success

            // --- 6. Success ---
            localStorage.removeItem('applicationFormData');
            localStorage.removeItem('applicationFormStep');
            // ✅ REMOVED the line that cleared consent
            nextStep(); // Move to success screen

        } catch (error) {
            // Catch errors from any step (lookup, upload, insert)
            console.error("Error during submission process:", (error as Error).message);
            alert(`Submission failed: ${(error as Error).message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Render Logic ---
    const renderStep = () => {
        // ... (Your existing renderStep logic, including the loading state)
        if (isSubmitting) {
            return (
                <div className="bg-white shadow-lg rounded-2xl w-full max-w-3xl p-12 text-center">
                    <Loader2 className="animate-spin text-yellow-500 w-12 h-12 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-black">Submitting Application...</h1>
                    <p className="text-gray-600">Please wait, this may take a moment...</p>
                </div>
            );
        }

        switch (currentStep) {
            case 1:
                return (
                    <InitialForm
                        formData={formData.initial} // Pass the 'initial' slice
                        setFormData={handleInitialChange} // Pass the 'initial' handler
                        nextStep={nextStep}
                    />
                );

            case 2:
                return (
                    <PersonalInformationForm
                        formData={formData.personalInfo} // Pass the 'personalInfo' slice
                        setFormData={handlePersonalChange} // Pass the 'personalInfo' handler
                        nextStep={nextStep}
                        prevStep={prevStep}
                    />
                );

            case 3:
                return (
                    <PrioritiesGoalsForm
                        formData={formData.goals} // Pass the 'goals' slice
                        setFormData={handleGoalsChange} // Pass the 'goals' handler
                        nextStep={nextStep}
                        prevStep={prevStep}
                    />
                );

            case 4:
                // d.tsx is complex. We pass the relevant slices and the main setter
                return (
                    <BackgroundAchievementsForm
                        formData={formData} // Pass the whole object so it can read all its keys
                        setFormData={setFormData} // Pass the main setter
                        nextStep={nextStep}
                        prevStep={prevStep}
                    />
                );

            case 5:
                return (
                    <CreativeWorksForm
                        formData={formData.creativeWorks} // Pass the 'creativeWorks' slice
                        setFormData={handleCreativeWorksChange} // Pass the 'creativeWorks' handler
                        nextStep={nextStep}
                        prevStep={prevStep}
                    />
                );

            case 6:
                return (
                    <LifelongLearningForm
                        formData={formData.lifelongLearning} // Pass the 'lifelongLearning' slice
                        setFormData={handleLearningChange} // Pass the 'lifelongLearning' handler
                        nextStep={nextStep}
                        prevStep={prevStep}
                    />
                );

            case 7:
                return (
                    <SelfReportForm
                        formData={formData.selfAssessment} // Pass the 'selfAssessment' slice
                        setFormData={handleSelfAssessmentChange} // Pass the 'selfAssessment' handler
                        nextStep={nextStep}
                        prevStep={prevStep}
                    />
                );

            case 8:
                // ... (This case is correct)
                return (
                    <FinalReviewStep
                        nextStep={handleSubmit}
                        prevStep={prevStep}
                        signaturePadRef={signaturePadRef}
                        isSubmitting={isSubmitting}
                    />
                );

            case 9:
                return <SuccessScreen />;

            default:
                return <div>Form complete or invalid step.</div>;
        }

    };

    // --- ✅ 4. UPDATED FINAL RETURN ---
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6 font-sans">
            
            {/* We no longer need the 'isLoadingConsent' check */}

            {hasConsented ? (
                // --- If they HAVE consented, show the form ---
                <>
                    <Pagination currentStep={currentStep} totalSteps={totalSteps} stepTitles={stepTitles} />
                    {renderStep()}
                </>
            ) : (
                // --- If they have NOT consented, show the modal ---
                <DataPrivacyConsent
                    onAgree={handleConsentAgree}
                    onDisagree={handleConsentDisagree}
                />
            )}
            
        </div>
    );
}