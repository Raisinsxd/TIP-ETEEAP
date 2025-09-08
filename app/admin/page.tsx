"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  async function handleAuth() {
    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    if (authMode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
      else window.location.href = "/admin/dashboard"; // redirect manually on success
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) alert(error.message);
      else alert("Registration successful! You can now log in.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-96">
        <h1 className="text-2xl font-bold text-center mb-6 flex items-center gap-2 text-black">
          <img src="/assets/TIPLogo.png" alt="TIP Logo" className="w-8 h-8" />
          {authMode === "login" ? "Admin Login" : "Admin Register"}
        </h1>

        {authMode === "register" && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-4 p-3 border rounded-lg text-black focus:ring focus:ring-yellow-300"
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 border rounded-lg text-black focus:ring focus:ring-yellow-300"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-3 border rounded-lg text-black focus:ring focus:ring-yellow-300"
        />

        <button
          onClick={handleAuth}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg mb-4 transition"
        >
          {authMode === "login" ? "Login" : "Register"}
        </button>

        <p className="text-sm text-center">
          {authMode === "login" ? "Don’t have an account?" : "Already registered?"}{" "}
          <button
            onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
            className="text-yellow-600 font-semibold hover:underline"
          >
            {authMode === "login" ? "Register here" : "Login here"}
          </button>
        </p>
      </div>
    </div>
  );
}
