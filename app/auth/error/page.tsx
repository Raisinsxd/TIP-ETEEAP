"use client";
import Link from "next/link";

// 1. Define the correct props type for a page with searchParams
// Next.js can pass search params as a string, an array of strings, or undefined.
interface AuthErrorPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
  
  // 2. Handle the error prop, which could be a string, an array, or undefined
  const getErrorMessage = () => {
    const errorParam = searchParams?.error;
    if (Array.isArray(errorParam)) {
      return errorParam[0]; // Take the first error if it's an array
    }
    return errorParam || "An unknown error occurred"; // Use the error or a default message
  };

  const errorMessage = getErrorMessage();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-6">
      <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>

      {errorMessage && (
        <p className="text-red-400 mb-6">
          Something went wrong: <span className="font-semibold">{errorMessage}</span>
        </p>
      )}

      {/* Go Back Home Button */}
      <Link
        href="/"
        className="bg-yellow-400 text-black font-semibold py-2 px-4 rounded-lg hover:bg-yellow-300 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}