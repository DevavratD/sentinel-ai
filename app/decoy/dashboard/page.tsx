"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, FileText, Settings, BarChart, DownloadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { decoyConfig } from "@/lib/config";
import { useState, useEffect } from "react";

export default function DecoyDashboard() {
  const [loadingMsg, setLoadingMsg] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Simulated honeypot loading phase
  useEffect(() => {
    let msgIndex = 0;
    const interval = setInterval(() => {
      if (msgIndex < decoyConfig.fakeMessages.length) {
        setLoadingMsg(decoyConfig.fakeMessages[msgIndex]);
        msgIndex++;
      } else {
        setLoading(false);
        clearInterval(interval);
      }
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const handleSuspiciousAction = async (actionName: string) => {
    // In a real implementation this would fire to highly monitor their actions
    try {
      await fetch('/api/actions/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ actionType: actionName, details: 'User interacted with a decoy element.' })
      });
      alert("Action logged (Honeypot Trigger)");
    } catch {
      // ignore
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-zinc-400">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-800 border-t-zinc-400" />
          <p className="font-mono text-sm uppercase tracking-widest">{loadingMsg}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-50">{decoyConfig.appName}</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-50">{decoyConfig.data.employees}</div>
            <p className="text-xs text-zinc-400">Synchronized via Active Directory</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Reports</CardTitle>
            <FileText className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-50">{decoyConfig.data.activeReports}</div>
            <Button onClick={() => handleSuspiciousAction("view_reports")} variant="link" className="p-0 h-auto text-xs text-blue-400">View All</Button>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Settings className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{decoyConfig.data.systemHealth}</div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <BarChart className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-50">{decoyConfig.data.monthlyRevenue}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-4">
        <Card className="bg-zinc-900 border-zinc-800 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-red-400">Highly Confidential Files</CardTitle>
            <CardDescription>Restricted access files. Honeypot module.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded bg-zinc-950 border border-zinc-800">
                <span className="text-sm font-medium">Payroll_Master_Q3.xlsx</span>
                <Button onClick={() => handleSuspiciousAction("download_payroll")} size="sm" variant="secondary">
                  <DownloadCloud className="w-4 h-4 mr-2" /> Download
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded bg-zinc-950 border border-zinc-800">
                <span className="text-sm font-medium">Admin_Passwords_Backup.txt</span>
                <Button onClick={() => handleSuspiciousAction("download_passwords")} size="sm" variant="secondary">
                  <DownloadCloud className="w-4 h-4 mr-2" /> Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Recent Internal Memos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-zinc-300 text-sm">
              <div className="p-4 rounded border border-zinc-800">
                <p className="font-semibold text-zinc-100">Server Migration Details</p>
                <p className="text-zinc-400 mt-1">
                  We are moving to the new AWS cluster tonight. Details inside.
                </p>
                <Button onClick={() => handleSuspiciousAction("view_migration")} variant="link" className="p-0 h-auto mt-2 text-blue-400 text-xs">Read More</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}