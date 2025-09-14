"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface User {
  id: string;
  name: string | null;
  email: string | null;
  date_logged_in: string | null;
}

export default function DashboardPage() {
  const [logs, setLogs] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"Dashboard" | "AdminManagement">(
    "Dashboard"
  );

  const [currentUser, setCurrentUser] = useState<{ email: string | null; name: string | null }>({ email: null, name: null });

  // Fetch current authenticated user info
  useEffect(() => {
    async function getUser() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
          console.error("Error getting user:", error.message);
          return;
        }

        if (user) {
          setCurrentUser({
            email: user.email,
            name: user.user_metadata?.full_name || user.user_metadata?.name || null,
          });
        }
      } catch (err) {
        console.error("Unexpected error fetching user info:", err);
      }
    }

    getUser();

    // Listen for auth changes
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser({
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || null,
        });
      } else {
        setCurrentUser({ email: null, name: null });
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Fetch user logs and subscribe to realtime inserts
  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("users")
          .select("id, name, email, date_logged_in")
          .order("date_logged_in", { ascending: false });

        if (error) {
          console.error(
            "Error fetching logs:",
            error.message,
            error.details,
            error.hint,
            error.code
          );
          setLogs([]);
        } else if (data) {
          setLogs(data as User[]);
        } else {
          setLogs([]);
        }
      } catch (err) {
        console.error("Unexpected error fetching logs:", err);
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();

    const channel = supabase
      .channel("public:users")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "users" },
        (payload) => {
          setLogs((prev) => [payload.new as User, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-white text-yellow-400">
        Loading logs...
      </div>
    );

  return (
    <div className="flex min-h-screen bg-white text-yellow-400 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 border-r border-yellow-400 p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-6 text-black">Admin Panel</h2>
        <nav className="flex flex-col gap-3 text-black">
          <button
            onClick={() => setActiveTab("Dashboard")}
            className={`text-left px-3 py-2 rounded hover:bg-yellow-200 ${
              activeTab === "Dashboard" ? "bg-yellow-200 font-semibold" : ""
            }`}
          >
            Users Logins
          </button>
          <button
            onClick={() => setActiveTab("AdminManagement")}
            disabled
            className="text-left px-3 py-2 rounded bg-gray-200 text-gray-500 cursor-not-allowed"
          >
            Admin Management (disabled)
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto space-y-8">
        {activeTab === "Dashboard" && (
          <div className="space-y-6">
            {currentUser.email && (
              <p className="mb-4 text-black">
                Logged in as: {currentUser.name ?? currentUser.email}
              </p>
            )}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-black">Users Logins</h2>
              <div className="text-sm text-gray-600">Total Logins: {logs.length}</div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-50 border border-yellow-400 rounded-xl overflow-hidden shadow-md">
                <thead className="bg-gray-100 text-black">
                  <tr>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Date Logged In</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-4 text-center text-yellow-600">
                        No login logs found.
                      </td>
                    </tr>
                  )}
                  {logs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b border-yellow-400 hover:bg-yellow-100 transition text-black"
                    >
                      <td className="p-3">{log.name ?? "-"}</td>
                      <td className="p-3">{log.email ?? "-"}</td>
                      <td className="p-3">
                        {log.date_logged_in
                          ? new Date(log.date_logged_in).toLocaleString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
