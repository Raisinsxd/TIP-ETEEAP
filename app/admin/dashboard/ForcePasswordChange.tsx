// app/admin/dashboard/ForcePasswordChange.tsx

"use client";
import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ForcePasswordChangeProps {
  userId: string;
  onPasswordChanged: () => void; // A function to reload the dashboard
}

export default function ForcePasswordChange({ userId, onPasswordChanged }: ForcePasswordChangeProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (password: string) => {
    if (!password) return "Password is required.";
    if (password.length < 8) return "Password must be at least 8 characters long.";
    if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter.";
    if (!/[a-z]/.test(password)) return "Password must contain a lowercase letter.";
    if (!/\d/.test(password)) return "Password must contain a number.";
    if (!/[!@#$%^&*]/.test(password)) return "Password must contain a special character.";
    return "";
  };
  
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validatePassword(newPassword);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // 1. Update the password in Supabase Auth
      const { error: updateAuthError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateAuthError) throw updateAuthError;

      // 2. Update the flag in your 'admin' table
      const { error: updateProfileError } = await supabase
        .from("admin")
        .update({ requires_password_change: false })
        .eq("id", userId);

      if (updateProfileError) throw updateProfileError;

      alert("Password updated successfully! The dashboard will now load.");
      onPasswordChanged(); // Trigger a refresh of the parent component

    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md text-black">
        <h2 className="text-2xl font-bold mb-2">Change Your Password</h2>
        <p className="text-gray-600 mb-6">For security, you must change your temporary password before proceeding.</p>
        <form onSubmit={handlePasswordUpdate}>
          <div className="space-y-4">
            <div className="relative">
              <label className="font-medium">New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full mt-1 p-3 border rounded-lg focus:ring focus:ring-yellow-300"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-10 text-gray-500">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="relative">
              <label className="font-medium">Confirm New Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full mt-1 p-3 border rounded-lg focus:ring focus:ring-yellow-300"
                required
              />
               <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-10 text-gray-500">
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Set New Password and Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}