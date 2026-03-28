"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users, FileText, Settings, BarChart2, DownloadCloud, Lock,
  Bell, ChevronRight, Database, Terminal, Shield, LogOut, AlertCircle
} from "lucide-react";

const LOADING_MESSAGES = [
  "Authenticating credentials...",
  "Verifying security tokens...",
  "Establishing secure session...",
  "Loading employee records...",
  "Fetching payroll reports...",
  "Syncing Active Directory...",
  "Initializing admin modules...",
];

const FAKE_EMPLOYEES = [
  { id: "EMP-001", name: "Robert Hughes", role: "CTO", dept: "Executive", clearance: "Top Secret", lastAccess: "Mar 28, 09:14" },
  { id: "EMP-002", name: "Diana Marsh", role: "VP Finance", dept: "Finance", clearance: "Confidential", lastAccess: "Mar 28, 08:55" },
  { id: "EMP-003", name: "Carlos Vega", role: "Head of IT", dept: "Technology", clearance: "Secret", lastAccess: "Mar 27, 17:30" },
  { id: "EMP-004", name: "Nina Petrov", role: "Data Analyst", dept: "Analytics", clearance: "Restricted", lastAccess: "Mar 26, 10:12" },
  { id: "EMP-005", name: "Tom Saunders", role: "HR Manager", dept: "Human Resources", clearance: "Restricted", lastAccess: "Mar 25, 14:07" },
];

const FAKE_FILES = [
  { name: "Payroll_Master_Q1_2025.xlsx", size: "4.2 MB", action: "download_payroll_q1" },
  { name: "Admin_Credentials_Backup.txt", size: "12 KB", action: "download_credentials" },
  { name: "AWS_Root_Keys_Export.csv", size: "8 KB", action: "download_aws_keys" },
  { name: "Customer_PII_Database.zip", size: "128 MB", action: "download_pii_db" },
];

const FAKE_LOGS = [
  "2025-03-28 09:14:02 — Admin session opened from 10.0.0.1",
  "2025-03-28 09:01:44 — Payroll batch processed: $2.1M disbursed",
  "2025-03-27 23:55:10 — Database backup completed: 14.7 GB",
  "2025-03-27 18:30:00 — SSL certificate auto-renewed",
  "2025-03-27 15:12:44 — New employee record created: [REDACTED]",
];

const TABS = ["Overview", "Employees", "Confidential Files", "System Logs", "Settings"];

export default function DecoyDashboard() {
  const router = useRouter();
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [loadingDone, setLoadingDone] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    setSessionId(sessionStorage.getItem("sentinel_session_id") || "anonymous-decoy-session");
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingMsgIdx((prev) => {
        if (prev >= LOADING_MESSAGES.length - 1) {
          clearInterval(timer);
          setTimeout(() => setLoadingDone(true), 600);
          return prev;
        }
        return prev + 1;
      });
    }, 700);
    return () => clearInterval(timer);
  }, []);

  const logAction = async (actionType: string, details: string) => {
    try {
      await fetch("/api/actions/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, actionType, details }),
      });
    } catch {
      // silent — attacker shouldn't see errors
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    logAction("tab_navigation", `Navigated to tab: ${tab}`);
  };

  const handleFileAction = (action: string, filename: string) => {
    logAction(action, `Attempted to download: ${filename}`);
    // Show a fake "loading" alert
    // In real honeypot may want to silently fingerprint instead
    setTimeout(() => alert(`Preparing download: ${filename}\n\n[Connection timed out — server busy]`), 400);
  };

  if (!loadingDone) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-6">
        <div className="flex flex-col items-center gap-5">
          <div className="relative h-14 w-14">
            <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-ping" />
            <div className="relative flex h-full w-full items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10">
              <Shield className="h-6 w-6 text-blue-400" />
            </div>
          </div>
          <div className="space-y-2 text-center">
            <p className="font-mono text-sm text-zinc-300 tracking-widest uppercase transition-all duration-300">
              {LOADING_MESSAGES[loadingMsgIdx]}
            </p>
            <div className="mx-auto h-0.5 w-48 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full bg-blue-500 transition-all duration-700 ease-out"
                style={{ width: `${((loadingMsgIdx + 1) / LOADING_MESSAGES.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
        <p className="text-xs text-zinc-600 font-mono">SENTINEL-DECOY-ENV v2.4.1</p>
      </div>
    );
  }

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
            <button onClick={() => logAction("bell_click", "Clicked notifications")} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 transition">
              <Bell className="h-4 w-4" />
            </button>
            <button onClick={() => { logAction("logout_attempt", "Clicked logout"); router.push("/decoy/login"); }} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-red-400 transition">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex gap-1 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition whitespace-nowrap ${activeTab === tab
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        {activeTab === "Overview" && (
          <>
            <div>
              <h1 className="text-2xl font-bold">Overview</h1>
              <p className="mt-1 text-sm text-zinc-400">All systems nominal. Administrator access granted.</p>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[
                { label: "Total Employees", value: "1,482", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
                { label: "Payroll Files", value: "87", icon: FileText, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
                { label: "System Status", value: "ONLINE", icon: Settings, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
                { label: "Monthly Spend", value: "$7.9M", icon: BarChart2, color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
              ].map((s) => (
                <div key={s.label} className={`rounded-xl border p-4 cursor-pointer hover:brightness-110 transition ${s.bg}`} onClick={() => logAction("stat_card_click", `Clicked ${s.label}`)}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-zinc-400">{s.label}</p>
                      <p className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value}</p>
                    </div>
                    <s.icon className={`h-5 w-5 ${s.color} opacity-70`} />
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-300">Attention Required</p>
                <p className="text-xs text-zinc-400 mt-1">3 confidential payroll exports are pending your approval. Visit the <button onClick={() => handleTabChange("Confidential Files")} className="text-amber-400 underline">Confidential Files</button> section to review.</p>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
              <div className="border-b border-zinc-800 px-5 py-4 flex items-center justify-between">
                <h2 className="font-semibold">Recent Activity Log</h2>
                <button onClick={() => handleTabChange("System Logs")} className="flex items-center gap-1 text-xs text-blue-400">View all <ChevronRight className="h-3 w-3" /></button>
              </div>
              <div className="divide-y divide-zinc-800/60 font-mono text-xs text-zinc-400">
                {FAKE_LOGS.slice(0, 3).map((l, i) => (
                  <div key={i} className="px-5 py-3 hover:bg-zinc-800/30">{l}</div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "Employees" && (
          <>
            <h1 className="text-2xl font-bold">Employee Directory</h1>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 text-xs text-zinc-500 uppercase tracking-wider">
                      <th className="px-5 py-3 text-left">ID</th>
                      <th className="px-5 py-3 text-left">Name</th>
                      <th className="px-5 py-3 text-left">Role</th>
                      <th className="px-5 py-3 text-left">Clearance</th>
                      <th className="px-5 py-3 text-left">Last Access</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FAKE_EMPLOYEES.map((emp) => (
                      <tr key={emp.id} className="border-b border-zinc-800/40 hover:bg-zinc-800/30 transition cursor-pointer" onClick={() => logAction("employee_view", `Viewed employee: ${emp.name} (${emp.id})`)}>
                        <td className="px-5 py-3 font-mono text-xs text-zinc-500">{emp.id}</td>
                        <td className="px-5 py-3 font-medium">{emp.name}</td>
                        <td className="px-5 py-3 text-zinc-400">{emp.role}</td>
                        <td className="px-5 py-3">
                          <span className={`rounded-full px-2 py-0.5 text-xs ${emp.clearance === "Top Secret" ? "bg-red-500/10 text-red-400" : emp.clearance === "Confidential" ? "bg-amber-500/10 text-amber-400" : "bg-zinc-700 text-zinc-400"}`}>{emp.clearance}</span>
                        </td>
                        <td className="px-5 py-3 text-xs text-zinc-500">{emp.lastAccess}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === "Confidential Files" && (
          <>
            <h1 className="text-2xl font-bold text-red-400">Confidential Files</h1>
            <p className="text-sm text-zinc-400">Restricted access. All downloads are logged and audited.</p>
            <div className="space-y-3">
              {FAKE_FILES.map((file, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800">
                      <Database className="h-4 w-4 text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-zinc-500">{file.size}</p>
                    </div>
                  </div>
                  <button onClick={() => handleFileAction(file.action, file.name)} className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-700 transition">
                    <DownloadCloud className="h-3.5 w-3.5" />
                    Download
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "System Logs" && (
          <>
            <h1 className="text-2xl font-bold">System Logs</h1>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-mono text-emerald-400">Demo-admin-log-viewer v3.1.0</span>
              </div>
              <div className="space-y-1.5 font-mono text-xs text-zinc-400">
                {FAKE_LOGS.map((l, i) => (
                  <div key={i} className="py-1 border-b border-zinc-900 hover:text-zinc-200 cursor-pointer" onClick={() => logAction("log_entry_view", `Viewed log: ${l.substring(0, 40)}`)}>{l}</div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "Settings" && (
          <>
            <h1 className="text-2xl font-bold">Settings</h1>
            <div className="space-y-4">
              {["Enable 2FA enforcement", "Auto-lock inactive sessions", "Allow API key generation", "Export user database"].map((setting, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/60 px-5 py-4" onClick={() => logAction("settings_interaction", `Interacted with setting: ${setting}`)}>
                  <p className="text-sm font-medium">{setting}</p>
                  <div className="h-6 w-11 rounded-full bg-zinc-700 cursor-pointer relative">
                    <div className="absolute top-1 left-1 h-4 w-4 rounded-full bg-zinc-400" />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}