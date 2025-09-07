"use client";
import React, { useState } from "react";
import Header from "./components/Header";
import { signIn } from "next-auth/react";

export default function Page() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-stretch min-h-screen">
        {/* Left Section */}
        <div className="relative flex flex-col justify-center items-center lg:w-1/2 p-8 lg:p-12 bg-gradient-to-br from-gray-800 via-gray-900 to-black">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-400 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500 rounded-full blur-3xl"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 text-center max-w-lg">
            {/* Logo and TIP */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-xl">
                <img
                  src="/assets/TIPLogo.png"
                  className="w-12 h-12 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    const fallback = target.nextElementSibling as HTMLElement;
                    target.style.display = "none";
                    if (fallback) fallback.style.display = "flex";
                  }}
                />
                <div className="hidden w-12 h-12 items-center justify-center text-black font-black text-lg">
                  TIP
                </div>
              </div>
              <div className="text-left">
                <p className="text-yellow-400 text-lg font-bold tracking-wider">
                  Technological
                </p>
                <p className="text-xs text-gray-400 uppercase tracking-widest">
                  Institute of the Philippines
                </p>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 drop-shadow-2xl mb-4 tracking-tight leading-none">
              ETEEAP
            </h1>

            {/* Subheading */}
            <div className="mb-8">
              <p className="text-xl lg:text-2xl font-light text-gray-300 mb-2 leading-relaxed">
                Expanded Tertiary Education
              </p>
              <p className="text-xl lg:text-2xl font-light text-gray-300 mb-4 leading-relaxed">
                Equivalency & Accreditation Program
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full"></div>
            </div>

            {/* Description */}
            <p className="text-base text-gray-400 mb-10 leading-relaxed max-w-sm mx-auto">
              Transform your professional experience into academic credentials
              through our comprehensive accreditation program.
            </p>

            {/* CTA Button */}
            <button
              onClick={() => setShowLogin(true)}
              className="group relative overflow-hidden bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold py-4 px-8 rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              <span className="relative z-10 flex items-center gap-3 text-lg">
                Get Started
                <span className="group-hover:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="lg:w-1/2 p-8 lg:p-12 bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-500 text-gray-900 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-300 rounded-full blur-3xl transform -translate-x-16 translate-y-16"></div>
          </div>

          <div className="relative z-10">
            {/* Header */}
            <div className="mb-10">
              <h2 className="text-4xl lg:text-5xl font-black mb-4 text-gray-900 leading-tight">
                Programs
                <span className="block text-3xl lg:text-4xl font-light text-gray-700">
                  Offered
                </span>
              </h2>
              <div className="w-16 h-1 bg-gray-800 rounded-full"></div>
            </div>

            {/* Programs Grid */}
            <div className="space-y-3">
              {[
                "Bachelor of Science in Computer Science",
                "Bachelor of Science in Information Systems",
                "Bachelor of Science in Information Technology",
                "Bachelor of Science in Computer Engineering",
                "Bachelor of Science in Industrial Engineering",
              ].map((program, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-4 p-4 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-300 hover:translate-x-2"
                >
                  <div className="w-2 h-2 bg-gray-800 rounded-full flex-shrink-0 group-hover:scale-150 transition-transform duration-300"></div>
                  <p className="text-lg font-medium text-gray-800 leading-relaxed group-hover:font-semibold transition-all duration-300">
                    {program}
                  </p>
                </div>
              ))}

              {/* Business Administration with Specializations */}
              <div className="group bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-300 hover:translate-x-2">
                <div className="flex items-center gap-4 p-4">
                  <div className="w-2 h-2 bg-gray-800 rounded-full flex-shrink-0 group-hover:scale-150 transition-transform duration-300"></div>
                  <p className="text-lg font-medium text-gray-800 leading-relaxed group-hover:font-semibold transition-all duration-300">
                    Bachelor of Science in Business Administration
                  </p>
                </div>
                <div className="ml-6 pb-4 space-y-2">
                  {[
                    "Logistics and Supply Chain Management",
                    "Financial Management",
                    "Human Resources Management",
                    "Marketing Management",
                  ].map((specialization, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 px-4 py-2"
                    >
                      <div className="w-1 h-1 bg-gray-600 rounded-full flex-shrink-0"></div>
                      <p className="text-base font-normal text-gray-700 leading-relaxed">
                        {specialization}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-10 p-6 bg-white/20 backdrop-blur-sm rounded-xl">
              <p className="text-sm text-gray-700 font-medium text-center">
                📚 All programs are designed for working professionals with
                relevant experience
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Dark overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowLogin(false)}
          ></div>

          {/* Card */}
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl z-10 overflow-hidden">
            <div className="flex">
              {/* Left Side */}
              <div className="w-1/2 bg-gradient-to-br from-slate-800 via-gray-900 to-black p-12 flex flex-col justify-center items-center text-white relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-yellow-400 rounded-full blur-2xl"></div>
                </div>

                {/* Logo & Title */}
                <div className="relative z-10 text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-xl mb-6 mx-auto">
                    <img
                      src="/assets/TIPLogo.png"
                      className="w-16 h-16 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        const fallback = target.nextElementSibling as HTMLElement;
                        target.style.display = "none";
                        if (fallback) fallback.style.display = "flex";
                      }}
                    />
                    <div className="hidden w-16 h-16 items-center justify-center text-black font-black text-xl">
                      TIP
                    </div>
                  </div>
                  <p className="text-yellow-400 text-sm font-bold tracking-wider mb-1">T.I.P.</p>
                  <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 mb-4 tracking-tight">
                    ETEEAP
                  </h1>
                  <div className="mb-8">
                    <p className="text-l font-light text-gray-300 mb-2">Expanded Tertiary Education</p>
                    <p className="text-l font-light text-gray-300 mb-4">Equivalency & Accreditation Program</p>
                    <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Right Side */}
              <div className="w-1/2 bg-white p-12 relative">
                {/* Close Button */}
                <button
                  onClick={() => setShowLogin(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all duration-200"
                >
                  ✕
                </button>

                {/* Welcome Section */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome !</h2>
                  <p className="text-gray-600 text-sm">Sign in to continue to ETEEAP</p>
                </div>

                {/* Google Login */}
                <form className="space-y-4">
                  <div className="flex flex-col gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => signIn("google", { callbackUrl: "/" })}
                      className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold py-3 px-6 rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                    >
                      <img
                        src="/assets/googleicon.png"
                        alt="Google"
                        className="w-6 h-6 rounded-full object-cover ring-2 ring-white/40"
                      />
                      Sign in with Google
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
       
      {/* Who Can Enroll Section */}
      <section id="who-can-enroll" className="py-16 px-8 lg:px-12 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-black mb-8 text-center">
            Who Can Enroll?
          </h2>
          <div className="bg-yellow-400 rounded-2xl p-10 shadow-xl relative">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Qualifications
            </h3>
            <ul className="space-y-4 text-lg leading-relaxed text-gray-800">
              <li>
                • A Filipino citizen and at least 23 years old as supported by
                PSA birth certificate;
              </li>
              <li>
                • Employed for an aggregate period of at least five (5) years in
                the industry, related to the academic degree or discipline,
                where equivalency of learning is being sought; and
              </li>
              <li>
                • Possess a high school diploma or a Philippine Educational
                Placement Test (PEPT)/Alternative Learning System certification
                stating “qualified to enter first year college.”
              </li>
            </ul>
            <div className="absolute top-6 right-6 bg-white text-yellow-600 font-bold rounded-full w-8 h-8 flex items-center justify-center shadow">
              !
            </div>
          </div>
        </div>
      </section>

      {/* Assessment Procedure Section */}
      <section id="assessment" className="py-16 px-8 lg:px-12 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-black mb-12 text-center">
            Assessment Procedure & Admission Requirements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Assessment Procedure */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-yellow-400 px-6 py-4">
                <h3 className="text-xl font-bold text-gray-900 text-center">
                  Assessment Procedure
                </h3>
              </div>
              <div className="p-8">
                <ul className="space-y-4 text-lg text-gray-700 leading-relaxed list-disc list-inside">
                  <li>
                    The applicant submits the accomplished application form and
                    supporting documents.
                  </li>
                  <li>
                    An ETEEAP staff checks and evaluates the completeness of the
                    submitted documents.
                  </li>
                  <li>
                    The staff turns over the applicant’s credentials to the
                    assessors for further evaluation.
                  </li>
                  <li>
                    The Chair and Dean endorse the competency evaluation results
                    and certificate of competency to the ETEEAP Head.
                  </li>
                  <li>
                    The ETEEAP Head recommends the competency evaluation results
                    and certificate of competency to the Vice President for
                    Academic Affairs (VPAA).
                  </li>
                  <li>
                    The VPAA approves the competency evaluation results and
                    certificate of competency.
                  </li>
                  <li>
                    The applicant complies with the recommended enrichment
                    courses/learning packages.
                  </li>
                  <li>
                    The assessor submits the evaluation results with a
                    certificate of competency noted by the Chair and Dean.
                  </li>
                </ul>
              </div>
            </div>

            {/* Admission Requirements */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gray-800 px-6 py-4">
                <h3 className="text-xl font-bold text-white text-center">
                  Admission Requirements
                </h3>
              </div>
              <div className="p-8">
                <ul className="space-y-4 text-lg text-gray-700 leading-relaxed list-disc list-inside">
                  <li>
                    Accomplished ETEEAP application and preliminary assessment
                    forms with recent 1x1 ID picture and supporting documents,
                    training certificates, recognitions, awards, etc.
                  </li>
                  <li>
                    School credentials: Transcript of Records, Diploma, Form
                    137/138
                  </li>
                  <li>Comprehensive curriculum vitae</li>
                  <li>
                    Statement of ownership/authenticity of
                    credentials/supporting documents
                  </li>
                  <li>
                    Endorsement letter from the last, or the current employer
                  </li>
                  <li>
                    Other documents (PSA birth certificate, barangay
                    clearance/NBI clearance/passport, marriage certificate [for
                    married woman])
                  </li>
                  <li>
                    Provide proof/evidence to support/demonstrate compliance
                    with the General and Program Criteria of ABET EAC (CpE & IE)
                    and ABET CAC (CS & IT) Requirements, and all other
                    accreditation/assessment requirements, that shall be
                    discussed during the Application Process.
                  </li>
                  <li>
                    Other evidences to support capability and knowledge in the
                    field for equivalency and accreditation
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application / Portfolio Form */}
      <section id="application" className="bg-white py-10">
        <div className="container mx-auto flex justify-center gap-6">
          <button className="group relative overflow-hidden bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold py-4 px-8 rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl">
            <span className="relative z-10 text-lg">Application Form</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </button>
          <button className="group relative overflow-hidden bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold py-4 px-8 rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl">
            <span className="relative z-10 text-lg">Portfolio Form</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Logo and Address */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/assets/TIPLogo.png"
                  alt="TIP Logo"
                  className="w-12 h-12 object-contain"
                />
                <h2 className="text-lg font-bold uppercase">
                  TECHNOLOGICAL INSTITUTE OF THE PHILIPPINES
                </h2>
              </div>
              <p className="text-sm leading-relaxed">
                363 P. Casal St., Quiapo, Manila <br />
                1338 Arlegui St., Quiapo, Manila <br />
                Tel. No: (02) 8733-9117 / (02) 7918-8476 / 0917-177-2566
              </p>
              <p className="text-sm leading-relaxed mt-4">
                938 Aurora Boulevard, Cubao, Quezon City <br />
                Tel. No: (02) 8911-0964 / (02) 7917-8477 / 0917-177-2556
              </p>
              <p className="text-sm mt-4">
                <span className="font-semibold">E-mail:</span> info@tip.edu.ph
              </p>
            </div>

            {/* Student Services */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Student Services</h3>
              <ul className="space-y-2 text-sm">
                <li>Canvas</li>
                <li>Library</li>
                <li>Career Center</li>
                <li>T.I.P. Email</li>
                <li>ARIS</li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>About T.I.P.</li>
                <li>FAQs</li>
                <li>Admission</li>
                <li>Careers at T.I.P.</li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:opacity-75">
                  <img
                    src="/assets/fblogo.png"
                    alt="Facebook"
                    className="w-6 h-6"
                  />
                </a>
                <a href="#" className="hover:opacity-75">
                  <img
                    src="/assets/xlogo.webp"
                    alt="Twitter"
                    className="w-6 h-6"
                  />
                </a>
                <a href="#" className="hover:opacity-75">
                  <img
                    src="/assets/iglogo.avif"
                    alt="Instagram"
                    className="w-6 h-6"
                  />
                </a>
                <a href="#" className="hover:opacity-75">
                  <img
                    src="/assets/ytlogo.webp"
                    alt="YouTube"
                    className="w-6 h-6"
                  />
                </a>
              </div>
            </div>
          </div>
          <div className="text-center text-xs text-gray-400 mt-10">
            © {new Date().getFullYear()} Technological Institute of the
            Philippines. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
