import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Settings, BarChart } from "lucide-react";

export default function RealDashboard() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-50">Acme Admin Portal</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-50">1,248</div>
            <p className="text-xs text-zinc-400">+12 from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Reports</CardTitle>
            <FileText className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-50">42</div>
            <p className="text-xs text-zinc-400">Needs review by Friday</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Settings className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">99.9%</div>
            <p className="text-xs text-zinc-400">All systems operational</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <BarChart className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-50">$4.2M</div>
            <p className="text-xs text-zinc-400">+18% year over year</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1 mt-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Recent Internal Memos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-zinc-300 text-sm">
              <div className="p-4 rounded border border-zinc-800">
                <p className="font-semibold text-zinc-100">Q3 Financial Results Review</p>
                <p className="text-zinc-400 mt-1">Please review the Q3 financial results before the town hall meeting next Tuesday. All department heads are required to submit their feedback by EOD Friday.</p>
              </div>
              <div className="p-4 rounded border border-zinc-800">
                <p className="font-semibold text-zinc-100">Office Security Policy Update</p>
                <p className="text-zinc-400 mt-1">Reminder: Badges must be worn at all times in the building. Security will be conducting random checks this week.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}