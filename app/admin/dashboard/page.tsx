// app/admin/dashboard/DashboardPage.tsx

"use client";

import { useEffect, useState, ComponentType } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import AdminManagement from "./adminmanage";
import UserManage from "./usermanage";
import ApplicantsManage from "./applicantsmanage";
import UserLoginsManage from "./userlogins";
import { GoogleUser } from "./page";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type TabName = "Home" | "AdminLogins" | "Applicants" | "UserLogins" | "AdminManagement";

const tabs: { [key in TabName]: { title: string; component: ComponentType<any> | null } } = {
  Home: { title: "Home", component: null },
  AdminLogins: { title: "Admin Login History", component: UserManage },
  Applicants: { title: "Applicant Submissions", component: ApplicantsManage },
  UserLogins: { title: "User Login History", component: UserLoginsManage },
  AdminManagement: { title: "Admin Management", component: AdminManagement },
};


export default function DashboardPage({ initialGoogleUsers }: { initialGoogleUsers: GoogleUser[] }) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabName>("Home");

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/admin");
        return;
      }
      setCurrentUser(session.user);
      setLoading(false);
    };
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/admin");
      } else {
        setCurrentUser(session.user);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin");
  }

  const ActiveComponent = tabs[activeTab].component;
  const pageTitle = tabs[activeTab].title;
  
  const componentProps: { [key: string]: any } = {
    UserLogins: { users: initialGoogleUsers },
    AdminManagement: { currentUserEmail: currentUser?.email ?? null },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-yellow-500">
        <p className="text-lg font-semibold">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen font-sans">
      {/* ===== Sidebar ===== */}
      <aside className="w-64 bg-white border-r border-gray-200 p-5 flex flex-col shrink-0">
        <div className="flex items-center gap-3 mb-8">
            <img src="/assets/TIPLogo.png" alt="TIP Logo" className="w-9 h-9" />
            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
        </div>

        {/* ✅ Main navigation wrapper */}
        <div className="flex flex-col flex-grow">
            <nav className="flex flex-col gap-2">
                {Object.keys(tabs).map((tabKey) => {
                    const tab = tabs[tabKey as TabName];
                    return (
                    <button
                        key={tabKey}
                        onClick={() => setActiveTab(tabKey as TabName)}
                        className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        activeTab === tabKey
                            ? "bg-yellow-400 text-white shadow-sm"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                        {tab.title === "Admin Login History" ? "Admin Logins" : tab.title === "User Login History" ? "User Logins" : tab.title}
                    </button>
                    );
                })}
            </nav>

            {/* ✅ Logout button moved here */}
            <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 bg-red-500 text-white hover:bg-red-600 mt-6"
            >
                Logout
            </button>
        </div>
      </aside>

      {/* ===== Main Content ===== */}
      <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">
        {activeTab === "Home" ? (
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Welcome to the Admin Panel</h2>
            <p className="text-gray-600 mt-2">Select a tab from the sidebar to manage your application.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">{pageTitle}</h2>
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              {ActiveComponent && <ActiveComponent {...componentProps[activeTab]} />}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}