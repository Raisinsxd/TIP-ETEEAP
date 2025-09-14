"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Admin {
  id: string;
  name: string;
  email: string;
  password: string; // ideally hashed and not handled directly here
}

export default function AdminPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [admins, setAdmins] = useState<Admin[]>([]);
  const router = useRouter();

  // Fetch all admins for display (optional - remove if not needed)
  useEffect(() => {
    async function fetchAdmins() {
      const { data, error } = await supabase.from<Admin>("admin").select("*");
      if (error) {
        console.error("Failed to fetch admins:", error.message);
      } else if (data) {
        setAdmins(data);
      }
    }
    fetchAdmins();
  }, []);

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    if (authMode === "login") {
      // Login: Check if email and password match an admin
      const { data, error } = await supabase
        .from<Admin>("admin")
        .select("*")
        .eq("email", email)
        .eq("password", password) // ⚠️ Use hashing in production
        .single();

      if (error || !data) {
        alert("Invalid admin credentials.");
      } else {
        router.push("/admin/dashboard");
      }
    } else {
      // Register: Insert new admin with name, email, password
      if (!name) {
        alert("Please enter your name to register.");
        return;
      }
      const { error } = await supabase.from("admin").insert([
        {
          name,
          email,
          password, // ⚠️ Use hashed passwords in production
        },
      ]);
      if (error) {
        console.error("Error registering admin:", error.message);
        alert("Failed to register admin: " + error.message);
      } else {
        alert("Admin registered successfully! You can now log in.");
        setAuthMode("login");
        // Clear form
        setName("");
        setEmail("");
        setPassword("");
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-96">
        <h1 className="text-2xl font-bold text-center mb-6 flex items-center gap-2 text-black">
          <img src="/assets/TIPLogo.png" alt="TIP Logo" className="w-8 h-8" />
          {authMode === "login" ? "Admin Login" : "Admin Register"}
        </h1>
        <form onSubmit={handleAuth} className="flex flex-col">
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
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg mb-4 transition"
          >
            {authMode === "login" ? "Login" : "Register"}
          </button>
        </form>
        <p className="text-sm text-center">
          {authMode === "login" ? "Don’t have an account?" : "Already registered?"}{" "}
          <button
            onClick={() =>
              setAuthMode(authMode === "login" ? "register" : "login")
            }
            className="text-yellow-600 font-semibold hover:underline"
          >
            {authMode === "login" ? "Register here" : "Login here"}
          </button>
        </p>

      </div>
    </div>
  );
}
