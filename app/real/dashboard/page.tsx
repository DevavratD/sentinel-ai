import { Users, FileText, Settings, BarChart2, Lock, Bell, LogOut, ChevronRight } from "lucide-react";

const EMPLOYEES = [
  { name: "Alexandra Chen", role: "VP Engineering", dept: "Technology", status: "Active", lastLogin: "2 min ago" },
  { name: "Marcus Rodriguez", role: "Security Analyst", dept: "InfoSec", status: "Active", lastLogin: "12 min ago" },
  { name: "Priya Nair", role: "Senior Developer", dept: "Technology", status: "Active", lastLogin: "1h ago" },
  { name: "James O'Brien", role: "CFO", dept: "Finance", status: "Active", lastLogin: "3h ago" },
  { name: "Sarah Mendes", role: "HR Director", dept: "Human Resources", status: "Away", lastLogin: "Yesterday" },
  { name: "Kevin Park", role: "SRE Engineer", dept: "Operations", status: "Active", lastLogin: "5 min ago" },
];

const REPORTS = [
  { title: "Q1 2025 Security Audit", category: "Security", status: "Pending Review", date: "Mar 25, 2025" },
  { title: "Employee Access Review", category: "Compliance", status: "In Progress", date: "Mar 22, 2025" },
  { title: "Infrastructure Cost Report", category: "Finance", status: "Approved", date: "Mar 18, 2025" },
  { title: "Incident Response Runbook Update", category: "Operations", status: "Draft", date: "Mar 14, 2025" },
];

const STATUS_COLORS: Record<string, string> = {
  Active: "text-emerald-400 bg-emerald-400/10",
  Away: "text-amber-400 bg-amber-400/10",
  "Pending Review": "text-amber-400 bg-amber-400/10",
  "In Progress": "text-blue-400 bg-blue-400/10",
  Approved: "text-emerald-400 bg-emerald-400/10",
  Draft: "text-zinc-400 bg-zinc-400/10",
};

export default function RealDashboard() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Top nav */}
      <header className="border-b border-zinc-800 bg-zinc-900/70 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 border border-blue-500/30">
              <Lock className="h-4 w-4 text-blue-400" />
            </div>
            <span className="font-bold text-zinc-100">Demo Corp</span>
            <span className="hidden text-xs text-zinc-500 sm:block">|</span>
            <span className="hidden text-xs text-zinc-500 sm:block">Admin Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-400">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Authenticated
            </div>
            <button className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition">
              <Bell className="h-4 w-4" />
            </button>
            <button className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-red-400 transition">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        {/* Page title */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
          <p className="mt-1 text-sm text-zinc-400">Welcome back. Here's what's happening across your organization.</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Total Employees", value: "1,248", delta: "+12 this month", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
            { label: "Active Reports", value: "42", delta: "8 need review", icon: FileText, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
            { label: "System Uptime", value: "99.9%", delta: "All systems operational", icon: Settings, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
            { label: "Monthly Revenue", value: "$4.21M", delta: "+18% YoY", icon: BarChart2, color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-xl border p-4 ${stat.bg}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-zinc-400">{stat.label}</p>
                  <p className={`mt-1 text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="mt-1 text-xs text-zinc-500">{stat.delta}</p>
                </div>
                <stat.icon className={`h-5 w-5 ${stat.color} opacity-70`} />
              </div>
            </div>
          ))}
        </div>

        {/* Employee table */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
          <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
            <h2 className="font-semibold text-zinc-100">Active Directory — User Accounts</h2>
            <button className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition">
              View all <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800/70 text-xs text-zinc-500 uppercase tracking-wider">
                  <th className="px-5 py-3 text-left">Name</th>
                  <th className="px-5 py-3 text-left">Role</th>
                  <th className="px-5 py-3 text-left">Department</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-left">Last Login</th>
                </tr>
              </thead>
              <tbody>
                {EMPLOYEES.map((emp, i) => (
                  <tr key={i} className="border-b border-zinc-800/40 hover:bg-zinc-800/30 transition">
                    <td className="px-5 py-3 font-medium text-zinc-100">{emp.name}</td>
                    <td className="px-5 py-3 text-zinc-400">{emp.role}</td>
                    <td className="px-5 py-3 text-zinc-400">{emp.dept}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[emp.status]}`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-zinc-500 text-xs font-mono">{emp.lastLogin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reports */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
          <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
            <h2 className="font-semibold text-zinc-100">Recent Reports</h2>
          </div>
          <div className="divide-y divide-zinc-800/60">
            {REPORTS.map((report, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-4 hover:bg-zinc-800/30 transition">
                <div>
                  <p className="text-sm font-medium text-zinc-100">{report.title}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{report.category} · {report.date}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[report.status]}`}>
                  {report.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}