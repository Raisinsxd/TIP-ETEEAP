"use client";

import { useEffect, useState, useMemo, FC, ReactNode } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  LineChart,
  Line,
} from "recharts";
import {
  Loader2,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  LogIn,
  ShieldUser, 
  GraduationCap,
  Calendar,
  BarChart3,
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- Type Definitions ---
interface Applicant {
  id: number;
  created_at: string;
  degree_applied_for: string | null;
  campus: string | null;
  status: string | null;
}
interface ProgramData {
  name: string;
  count: number;
}
interface StatusData {
  name: string;
  value: number;
  [key: string]: string | number; 
}
interface TimeSeriesData {
  date: string;
  count: number;
}

interface GlobalStatsData {
  // per-day series for the last 30 days
  dailyUserLogins: TimeSeriesData[];
  dailyAdminLogins: TimeSeriesData[];
  dailySubmissions: TimeSeriesData[];
  totalUserLogins: number;
  totalAdminLogins: number;
  totalSubmissions: number;
}

// --- Constants ---
const STATUS_COLORS = {
  Approved: "#10B981",
  Pending: "#F59E0B",
  Declined: "#EF4444",
};
const programMap: Record<string, string> = {
  "Bachelor of Science in Computer Science": "CS",
  "Bachelor of Science in Information Systems": "IS",
  "Bachelor of Science in Information Technology": "IT",
  "Bachelor of Science in Computer Engineering": "CpE",
  "Bachelor of Science in Industrial Engineering": "IE",
  "BS Business Administration Major in Logistics and Supply Chain Management":
    "BA-LSCM",
  "BS Business Administration Major in Financial Management": "BA-FM",
  "BS Business Administration Major in Human Resources Management": "BA-HRM",
  "BS Business Administration Major in Marketing Management": "BA-MM",
};

// --- Reusable Components ---
const ChartContainer: FC<{ title: string; icon: ReactNode; children: ReactNode }> = ({
  title,
  icon,
  children,
}) => (
  <div className="bg-card-texture border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
    <div className="flex items-center justify-between gap-3 mb-3">
      <div className="flex items-center gap-3">
        <div className="text-gray-600">{icon}</div>
        <h3 className="font-semibold text-md text-gray-800">{title}</h3>
      </div>
      <div className="text-sm text-gray-500">{/* placeholder for controls */}</div>
    </div>
    <div className="h-80">{children}</div>
  </div>
);

const StatCard: FC<{ title: string; value: string | number; icon: ReactNode }> = ({
  title,
  value,
  icon,
}) => (
  <div className="bg-card-texture border border-gray-200 rounded-xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-200 min-h-[88px]">
    <div className="flex-shrink-0">
      <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full shadow-inner">{icon}</div>
    </div>
    <div className="flex-1">
      <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
      <p className="text-2xl font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

// --- Main Dashboard Component ---
export default function DashboardHome() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allApplicants, setAllApplicants] = useState<Applicant[]>([]);
  const [userLogins, setUserLogins] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [adminLogins, setAdminLogins] = useState(0);
  const [chartCampus, setChartCampus] = useState<"Manila" | "Quezon City">(
    "Manila"
  );

  // State to track unique login IDs for users and admins
  const [uniqueUserIds, setUniqueUserIds] = useState<Set<string>>(new Set());
  const [uniqueAdminIds, setUniqueAdminIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    console.log("[DashboardHome] Mount: Initializing data fetch.");

    const fetchData = async () => {
      try {
        console.log("[DashboardHome] fetchData: Starting...");
        setLoading(true);
        setError(null);

        // Guard: ensure Supabase is configured
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          const msg = "Supabase configuration missing (NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY).";
          console.error("[DashboardHome] fetchData:", msg);
          setError(msg);
          setLoading(false);
          return;
        }

        // Fetch applications
        const { data: applications, error: applicationsError } = await supabase
          .from("applications")
          .select(
            "id, created_at, status, degree_applied_for, campus"
          );

        if (applicationsError) {
          // Supabase errors can be empty objects depending on the client or network layer.
          console.error("[DashboardHome] fetchData: Applications fetch error:", applicationsError);
          const appsMsg =
            (applicationsError && ((applicationsError as any).message || (applicationsError as any).error)) ||
            JSON.stringify(applicationsError) ||
            "Failed to fetch applications";
          setError(String(appsMsg));
          setLoading(false);
          return;
        }
        console.log(
          `[DashboardHome] fetchData: Fetched ${applications?.length || 0} applications.`
        );

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Fetch user login history
        const { data: userLoginsData, error: userLoginsError } = await supabase
          .from("user_login_history")
          .select("*");

        if (userLoginsError) {
          console.error("[DashboardHome] fetchData: User logins fetch error:", userLoginsError);
          const uMsg = (userLoginsError && ((userLoginsError as any).message || (userLoginsError as any).error)) || JSON.stringify(userLoginsError) || "Failed to fetch user logins";
          setError(String(uMsg));
          setLoading(false);
          return;
        }
        console.log(
          `[DashboardHome] fetchData: Fetched ${userLoginsData?.length || 0} user login records.`
        );

        // Compute total unique users (fallback to email if user_id not present)
        try {
          const uniqueUsers = new Set<string>();
          (userLoginsData || []).forEach((login: any) => {
            if (login.user_id) uniqueUsers.add(String(login.user_id));
            else if (login.email) uniqueUsers.add(String(login.email));
          });
          setTotalUsers(uniqueUsers.size);
          console.log(`[DashboardHome] fetchData: Computed total unique users: ${uniqueUsers.size}`);
        } catch (err) {
          console.warn('[DashboardHome] fetchData: Failed to compute total users', err);
        }

        // Fetch admin login history
        const { data: adminLoginsData, error: adminLoginsError } = await supabase
          .from("admin_login_history")
          .select("*");

        if (adminLoginsError) {
          console.error("[DashboardHome] fetchData: Admin logins fetch error:", adminLoginsError);
          const aMsg = (adminLoginsError && ((adminLoginsError as any).message || (adminLoginsError as any).error)) || JSON.stringify(adminLoginsError) || "Failed to fetch admin logins";
          setError(String(aMsg));
          setLoading(false);
          return;
        }
        console.log(
          `[DashboardHome] fetchData: Fetched ${adminLoginsData?.length || 0} admin login records.`
        );

        // Process and set data
        setAllApplicants(applications || []);

        const todayUserUniqueIds = new Set<string>();
        (userLoginsData || []).forEach((login: any) => {
          const loginDate = new Date(login.created_at);
          loginDate.setHours(0, 0, 0, 0);
          if (loginDate.getTime() === today.getTime() && login.user_id) {
            todayUserUniqueIds.add(login.user_id);
          }
        });
        console.log(
          `[DashboardHome] fetchData: Processed ${todayUserUniqueIds.size} unique user logins for today.`
        );
        setUniqueUserIds(todayUserUniqueIds);
        setUserLogins(todayUserUniqueIds.size);

        const todayAdminUniqueIds = new Set<string>();
        (adminLoginsData || []).forEach((login: any) => {
          const loginDate = new Date(login.created_at);
          loginDate.setHours(0, 0, 0, 0);
          if (loginDate.getTime() === today.getTime() && login.admin_id) {
            todayAdminUniqueIds.add(login.admin_id);
          }
        });
        console.log(
          `[DashboardHome] fetchData: Processed ${todayAdminUniqueIds.size} unique admin logins for today.`
        );
        setUniqueAdminIds(todayAdminUniqueIds);
        setAdminLogins(todayAdminUniqueIds.size);
      } catch (error) {
        console.error("[DashboardHome] fetchData: Unhandled error:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch dashboard data"
        );
      } finally {
        console.log("[DashboardHome] fetchData: Finished.");
        setLoading(false);
      }
    };

    fetchData();

    // removed real-time subscriptions — this effect now only fetches statistics once on mount

  }, []); // run once on mount

  // --- Global Stats (All Campuses) ---
  const applicationStats = useMemo(
    () => ({
      total: allApplicants.length,
      approved: allApplicants.filter((a) => a.status === "Approved").length,
      pending: allApplicants.filter((a) => a.status === "Pending").length,
      declined: allApplicants.filter((a) => a.status === "Declined").length,
    }),
    [allApplicants]
  );

  // --- Campus-Specific Data for Charts ---
  const chartApplicants = useMemo(
    () => allApplicants.filter((app) => app.campus === chartCampus),
    [allApplicants, chartCampus]
  );

  const programData = useMemo((): ProgramData[] => {
    const byDegree = chartApplicants.reduce((acc, app) => {
      const shortName =
        programMap[app.degree_applied_for || ""] ||
        app.degree_applied_for ||
        "N/A";
      acc[shortName] = (acc[shortName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(byDegree)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7);
  }, [chartApplicants]);

  const statusData = useMemo((): StatusData[] => {
    const approved = chartApplicants.filter(
      (a) => a.status === "Approved"
    ).length;
    const pending = chartApplicants.filter(
      (a) => a.status === "Pending"
    ).length;
    const declined = chartApplicants.filter(
      (a) => a.status === "Declined"
    ).length;
    return [
      { name: "Approved", value: approved },
      { name: "Pending", value: pending },
      { name: "Declined", value: declined },
    ];
  }, [chartApplicants]);

  const timeSeriesData = useMemo((): TimeSeriesData[] => {
    const byDate = chartApplicants.reduce((acc, app) => {
      const date = new Date(app.created_at).toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(byDate)
      .map(([date, count]) => ({ date, count }))
      .sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
  }, [chartApplicants]);

  // Global Statistics Over Time
  const [globalStats, setGlobalStats] = useState<GlobalStatsData>({
    dailyUserLogins: [],
    dailyAdminLogins: [],
    dailySubmissions: [],
    totalUserLogins: 0,
    totalAdminLogins: 0,
    totalSubmissions: 0,
  });

  // Fetch global stats
  useEffect(() => {
    const fetchGlobalStats = async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const isoDate = thirtyDaysAgo.toISOString();

      try {
        // Fetch both user and admin login histories plus submissions
        const [userLoginData, adminLoginData, submissionData] = await Promise.all([
          supabase
            .from('user_login_history')
            .select('created_at')
            .gte('created_at', isoDate),
          supabase
            .from('admin_login_history')
            .select('created_at, admin_id')
            .gte('created_at', isoDate),
          supabase
            .from('applications')
            .select('created_at')
            .gte('created_at', isoDate)
        ]);

        // Build per-day counts for both tables
        const userByDate = (userLoginData.data || []).reduce((acc: Record<string, number>, login: any) => {
          const date = new Date(login.created_at).toISOString().split('T')[0];
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});

        // Count per-day admin logins and collect unique admin IDs over the window
        const adminByDate = (adminLoginData.data || []).reduce((acc: Record<string, number>, login: any) => {
          const date = new Date(login.created_at).toISOString().split('T')[0];
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});

        const uniqueAdminIds30d = new Set<string>();
        (adminLoginData.data || []).forEach((login: any) => {
          if (login.admin_id) uniqueAdminIds30d.add(String(login.admin_id));
        });

        // Process submission data
        const submissionsByDate = (submissionData.data || []).reduce((acc: Record<string, number>, submission: any) => {
          const date = new Date(submission.created_at).toISOString().split('T')[0];
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});

        // Create daily stats arrays (last 30 days)
        const dailyDates = Array.from({ length: 30 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return date.toISOString().split('T')[0];
        }).reverse();

        const dailyUserLogins = dailyDates.map((date) => ({ date, count: userByDate[date] || 0 }));
        const dailyAdminLogins = dailyDates.map((date) => ({ date, count: adminByDate[date] || 0 }));
        const dailySubmissions = dailyDates.map((date) => ({ date, count: submissionsByDate[date] || 0 }));

        setGlobalStats({
          dailyUserLogins,
          dailyAdminLogins,
          dailySubmissions,
          totalUserLogins: Object.values(userByDate).reduce((a, b) => a + b, 0),
          // totalAdminLogins is now the count of unique admin IDs seen in the last 30 days
          totalAdminLogins: uniqueAdminIds30d.size,
          totalSubmissions: Object.values(submissionsByDate).reduce((a, b) => a + b, 0),
        });
      } catch (error) {
        console.error('Error fetching global stats:', error);
      }
    };

    fetchGlobalStats();
  }, []);

  // Merge the two per-day series into a single series suitable for charting
  const loginSeries = useMemo(() => {
    const users = globalStats.dailyUserLogins || [];
    const admins = globalStats.dailyAdminLogins || [];
    const merged: Array<{ date: string; user: number; admin: number }> = [];
    const length = Math.max(users.length, admins.length);
    for (let i = 0; i < length; i++) {
      const date = users[i]?.date || admins[i]?.date || '';
      merged.push({
        date,
        user: users[i]?.count || 0,
        admin: admins[i]?.count || 0,
      });
    }
    return merged;
  }, [globalStats.dailyUserLogins, globalStats.dailyAdminLogins]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 text-gray-600">
        <Loader2 className="animate-spin mr-3" />
        Loading Dashboard...
      </div>
    );
  }

  // Show error as a dismissible alert instead of full page error
  const dismissError = () => setError(null);

  const ErrorAlert = () => error ? (
    <div className="mb-4">
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg relative">
        <div className="flex items-center">
          <XCircle className="w-5 h-5 mr-2" />
          <div className="flex-1">
            <p className="font-medium">Error Loading Data</p>
            <p className="text-sm text-red-500">{error}</p>
          </div>
          <button 
            onClick={dismissError}
            className="text-red-400 hover:text-red-600"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* First Row - Application Stats */}
        <StatCard
          title="Total Applicants"
          value={applicationStats.total}
          icon={<Users className="text-yellow-500" size={20} />}
        />
        <StatCard
          title="Total Approved"
          value={applicationStats.approved}
          icon={<CheckCircle className="text-yellow-500" size={20} />}
        />
        <StatCard
          title="Total Pending"
          value={applicationStats.pending}
          icon={<Clock className="text-yellow-500" size={20} />}
        />
        <StatCard
          title="Total Declined"
          value={applicationStats.declined}
          icon={<XCircle className="text-yellow-500" size={20} />}
        />
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={<LogIn className="text-yellow-500" size={20} />}
        />
        <StatCard
          title="Admin Logins"
          value={globalStats.totalAdminLogins}
          icon={<ShieldUser className="text-yellow-500" size={20} />}
        />
      </div>

      {/* --- Campus Switch --- */}
      <div className="mb-6">
        <div className="inline-flex items-center bg-white border border-gray-200 rounded-full p-1 shadow-sm">
          <button
            onClick={() => setChartCampus("Manila")}
            className={`px-6 py-2 text-sm font-bold rounded-full transition-colors ${
              chartCampus === "Manila"
                ? "bg-yellow-400 text-white shadow-md"
                : "text-gray-600"
            }`}
          >
            Manila Campus
          </button>
          <button
            onClick={() => setChartCampus("Quezon City")}
            className={`px-6 py-2 text-sm font-bold rounded-full transition-colors ${
              chartCampus === "Quezon City"
                ? "bg-yellow-400 text-white shadow-md"
                : "text-gray-600"
            }`}
          >
            Quezon City Campus
          </button>
        </div>
      </div>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- Main Content --- */}
        <div className="lg:col-span-2 space-y-6">
          <ChartContainer
            title={`Application Volume - ${chartCampus}`}
            icon={<Calendar size={20} className="text-gray-500" />}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={timeSeriesData}
                margin={{ top: 5, right: 20, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="#FBBF24"
                      stopOpacity={0.6}
                    />
                    <stop
                      offset="95%"
                      stopColor="#FBBF24"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="date"
                  fontSize={12}
                  tick={{ fill: "#6B7280" }}
                  stroke="#D1D5DB"
                />
                <YAxis
                  fontSize={12}
                  tick={{ fill: "#6B7280" }}
                  stroke="#D1D5DB"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E5E7EB",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#F59E0B"
                  fill="url(#colorCount)"
                  name="Applications"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* --- Right Sidebar --- */}
        <aside className="lg:col-span-1 space-y-6">
          <ChartContainer
            title={`Applicant Status - ${chartCampus}`}
            icon={<BarChart3 size={20} className="text-gray-500" />}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  labelLine={false}
                  label={(props) => {
                    const percent = (props as any).percent || 0;
                    const name = (props as any).name || '';
                    return `${name}: ${(percent * 100).toFixed(0)}%`;
                  }}
                >
                  {statusData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={
                        STATUS_COLORS[
                          entry.name as keyof typeof STATUS_COLORS
                        ]
                      }
                      className="outline-none"
                    />
                  ))}
                </Pie>
                <Legend
                  iconType="circle"
                  formatter={(value) => (
                    <span className="text-gray-700">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>

            {/* Logins (30 days) chart removed as requested */}

          <ChartContainer
            title={`Top Programs - ${chartCampus}`}
            icon={<GraduationCap size={20} className="text-gray-500" />}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={programData}
                layout="vertical"
                margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  type="number"
                  tick={{ fill: "#6B7280" }}
                  fontSize={12}
                  stroke="#D1D5DB"
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={50}
                  tick={{ fill: "#6B7280" }}
                  fontSize={12}
                  stroke="#D1D5DB"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E5E7EB",
                  }}
                />
                <Bar dataKey="count" name="Applicants" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </aside>
      </main>
    </div>
  );
}
