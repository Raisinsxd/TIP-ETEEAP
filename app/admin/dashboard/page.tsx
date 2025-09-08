"use client";

import { useEffect, useState } from "react";
import { createClient, Session } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  date_logged_in?: string | null;
}

interface ModalState {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export default function DashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    message: "",
    onConfirm: () => {},
  });
  const [activeTab, setActiveTab] = useState<"Dashboard" | "UserManagement">("Dashboard");

  const showConfirmModal = (message: string, onConfirm: () => void, onCancel?: () => void) =>
    setModal({
      isOpen: true,
      message,
      onConfirm: () => {
        onConfirm();
        setModal({ ...modal, isOpen: false });
      },
      onCancel: () => {
        if (onCancel) onCancel();
        setModal({ ...modal, isOpen: false });
      },
    });

  const showMessageModal = (message: string) =>
    setModal({ isOpen: true, message, onConfirm: () => setModal({ ...modal, isOpen: false }) });

  // --- Update date_logged_in safely (only for authenticated users) ---
  const updateLoginDate = async (userEmail?: string) => {
    if (!userEmail) return;
    try {
      await supabase
        .from("users")
        .update({ date_logged_in: new Date().toISOString() })
        .eq("email", userEmail);
    } catch (err) {
      console.error("Error updating date_logged_in:", err);
    }
  };

  // --- Auth State ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.email) updateLoginDate(session.user.email);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user?.email) updateLoginDate(session.user.email);
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- Fetch users ---
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("users").select("*");
      if (error) console.error("Error fetching users:", error);
      else setUsers(data as User[]);
      setLoading(false);
    };

    fetchUsers();

    const channel = supabase
      .channel("public:users")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "users" },
        (payload) => {
          if (payload.eventType === "INSERT") setUsers((prev) => [...prev, payload.new as User]);
          if (payload.eventType === "UPDATE")
            setUsers((prev) => prev.map((u) => (u.id === payload.new.id ? (payload.new as User) : u)));
          if (payload.eventType === "DELETE")
            setUsers((prev) => prev.filter((u) => u.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // --- CRUD ---
  const handleSubmit = async () => {
    if (!name || !email) return showMessageModal("Name and email are required.");
    try {
      if (editingUser) {
        const { error } = await supabase.from("users").update({ name, email, role }).eq("id", editingUser.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("users").insert([{ name, email, role }]);
        if (error) throw error;
      }
      setEditingUser(null);
      setName("");
      setEmail("");
      setRole("user");
    } catch (error) {
      console.error("Error handling user:", error);
    }
  };

  const handleDelete = (id: string) => {
    showConfirmModal("Are you sure you want to delete this user?", async () => {
      try {
        const { error } = await supabase.from("users").delete().eq("id", id);
        if (error) throw error;
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    });
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-white text-yellow-400">Loading users...</div>;

  return (
    <div className="flex min-h-screen bg-white text-yellow-400 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 border-r border-yellow-400 p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-6 text-black">Admin Panel</h2>
        <nav className="flex flex-col gap-3 text-black">
          <button onClick={() => setActiveTab("Dashboard")} className={`text-left px-3 py-2 rounded hover:bg-yellow-200 ${activeTab === "Dashboard" ? "bg-yellow-200 font-semibold" : ""}`}>Dashboard</button>
          <button onClick={() => setActiveTab("UserManagement")} className={`text-left px-3 py-2 rounded hover:bg-yellow-200 ${activeTab === "UserManagement" ? "bg-yellow-200 font-semibold" : ""}`}>User Management</button>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto space-y-8">
        {/* Dashboard */}
        {activeTab === "Dashboard" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-black mb-4">User Login Log</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-50 border border-yellow-400 rounded-xl overflow-hidden shadow-md">
                <thead className="bg-gray-100 text-black">
                  <tr>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Role</th>
                    <th className="p-3 text-left">Date Logged In</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-yellow-400 hover:bg-yellow-100 transition text-black">
                      <td className="p-3">{user.name}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">{user.role}</td>
                      <td className="p-3">{user.date_logged_in ? new Date(user.date_logged_in).toLocaleString() : "Never"}</td>
                    </tr>
                  ))}
                  {users.length === 0 && <tr><td colSpan={4} className="p-4 text-center text-yellow-600">No login records found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* User Management */}
        {activeTab === "UserManagement" && (
          <>
            <div className="bg-gray-50 border border-yellow-400 rounded-xl p-6 shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-black">{editingUser ? "Edit User" : "Add User"}</h2>
              <div className="flex flex-wrap gap-3 mb-4">
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="border border-yellow-400 p-2 rounded flex-1 bg-white text-black placeholder-yellow-600"/>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border border-yellow-400 p-2 rounded flex-1 bg-white text-black placeholder-yellow-600"/>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="border border-yellow-400 p-2 rounded bg-white text-black">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={handleSubmit} className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 transition">{editingUser ? "Update" : "Create"}</button>
                {editingUser && <button onClick={() => {setEditingUser(null); setName(""); setEmail(""); setRole("user");}} className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition">Cancel</button>}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-50 border border-yellow-400 rounded-xl overflow-hidden shadow-md">
                <thead className="bg-gray-100 text-black">
                  <tr>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Role</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-yellow-400 hover:bg-yellow-100 transition text-black">
                      <td className="p-3">{user.name}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">{user.role}</td>
                      <td className="p-3 flex gap-2">
                        <button onClick={() => handleEdit(user)} className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500 transition">Edit</button>
                        <button onClick={() => handleDelete(user.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && <tr><td colSpan={4} className="p-4 text-center text-yellow-600">No users found.</td></tr>}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Modal */}
        {modal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="bg-white border border-yellow-400 rounded-lg p-6 w-80 text-black">
              <p className="mb-4">{modal.message}</p>
              <div className="flex justify-end gap-3">
                {modal.onCancel && <button onClick={modal.onCancel} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>}
                <button onClick={modal.onConfirm} className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500">Confirm</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
