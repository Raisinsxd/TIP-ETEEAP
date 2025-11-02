"use client";
import Link from "next/link";

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const { error } = searchParams;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-6">
      <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>

      {error && (
        <p className="text-red-400 mb-6">
          Something went wrong: <span className="font-semibold">{error}</span>
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
