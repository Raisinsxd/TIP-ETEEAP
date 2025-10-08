"use client";
import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminAuth() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // ✅ 1. Add state for confirm password and visibility
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [loading, setLoading] = useState(false);
  
  // ✅ 2. Add states for validation errors
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");


  const router = useRouter();

  // ✅ 3. Re-use validation logic from the admin management page
  const validateName = (name: string) => {
    if (!name.trim()) return "Name cannot be empty.";
    return "";
  };

  const validateEmail = (email: string) => {
    if (!email) return "Email is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address.";
    return "";
  };
  
  const validatePassword = (password: string) => {
    if (!password) return "Password is required.";
    if (password.length < 8) return "Password must be at least 8 characters long.";
    if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter.";
    if (!/[a-z]/.test(password)) return "Password must contain a lowercase letter.";
    if (!/\d/.test(password)) return "Password must contain a number.";
    if (!/[!@#$%^&*]/.test(password)) return "Password must contain a special character.";
    return "";
  };


  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    // ✅ 4. Run all validations before submitting
    if (authMode === "register") {
      const nameErr = validateName(name);
      const emailErr = validateEmail(email);
      const passwordErr = validatePassword(password);
      
      setNameError(nameErr);
      setEmailError(emailErr);
      setPasswordError(passwordErr);

      if (nameErr || emailErr || passwordErr) {
        return;
      }
      if (password !== confirmPassword) {
        setFormError("Passwords do not match.");
        return;
      }
    }

    setLoading(true);

    try {
      if (authMode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error || !data.session) {
          setFormError("Invalid credentials. Please try again.");
          setLoading(false);
          return;
        }
        router.replace("/admin/dashboard");
      } else { // Register
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });

        if (error || !data.user) {
          setFormError(error?.message ?? "Failed to register.");
          setLoading(false);
          return;
        }
        
        const { error: profileError } = await supabase.from("admin").insert({
          id: data.user.id,
          name,
          email,
        });

        if (profileError) {
          setFormError("Failed to save profile: " + profileError.message);
          setLoading(false);
          // Optional: You might want to delete the auth user here if profile creation fails
          return;
        }
        
        // Auto-login is handled by Supabase signUp by default if email confirmation is disabled.
        // If email confirmation is enabled, you should redirect them to a "check your email" page.
        alert("Registration successful! Please check your email to confirm your account.");
        setAuthMode("login"); // Switch to login form after successful registration
      }
    } finally {
      setLoading(false);
    }
  }
  
  // Handlers for real-time validation
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    setNameError(validateName(value));
  };
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value));
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-96">
        <h1 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2 text-black">
          <img src="/assets/TIPLogo.png" alt="TIP Logo" className="w-8 h-8" />
          {authMode === "login" ? "Admin Login" : "Admin Register"}
        </h1>

        <form onSubmit={handleAuth} className="flex flex-col">
          {authMode === "register" && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={handleNameChange}
                className="w-full p-3 border rounded-lg text-black focus:ring focus:ring-yellow-300"
              />
              {nameError && <p className="text-red-600 text-sm mt-1">{nameError}</p>}
            </div>
          )}
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              className="w-full p-3 border rounded-lg text-black focus:ring focus:ring-yellow-300"
            />
            {authMode === "register" && emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}
          </div>

          <div className="mb-4 relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full p-3 border rounded-lg text-black focus:ring focus:ring-yellow-300"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-gray-500">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {authMode === "register" && passwordError && <p className="text-red-600 text-sm mt-1">{passwordError}</p>}
          </div>

          {authMode === "register" && (
             <div className="mb-6 relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 border rounded-lg text-black focus:ring focus:ring-yellow-300"
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3.5 text-gray-500">
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>
          )}

          {formError && <p className="text-red-600 mb-4 text-center">{formError}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg mb-4 transition disabled:opacity-50"
          >
            {loading ? "Please wait..." : (authMode === "login" ? "Login" : "Register")}
          </button>
        </form>

        <p className="text-sm text-center text-black">
          {authMode === "login" ? "Don’t have an account?" : "Already registered?"}{" "}
          <button
            onClick={() => {
              setAuthMode(authMode === "login" ? "register" : "login");
              setFormError("");
            }}
            className="text-yellow-600 font-semibold hover:underline"
          >
            {authMode === "login" ? "Register here" : "Login here"}
          </button>
        </p>
      </div>
    </div>
  );
}