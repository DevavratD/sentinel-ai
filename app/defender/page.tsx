import { getRecentSessions, getActionsForSession } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, Fingerprint, Activity, Clock } from "lucide-react";

// Server component polling could be done, but for MVP we render statically/revalidated.
export const revalidate = 0; // Disable cache for live feed feel

export default async function DefenderDashboard() {
  const sessions = await getRecentSessions();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Defender Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="px-3 py-1 font-mono text-xs">
            LIVE MONITORING
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Login Attempts</CardTitle>
            <Activity className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessions.length}</div>
          </CardContent>
        </Card>
        <Card className="glass-panel border-red-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-500">Threats Neutralized</CardTitle>
            <ShieldAlert className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {sessions.filter(s => s.routedToDecoy).length}
            </div>
            <p className="text-xs text-red-400/80">Routed to Decoy App</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1 mt-4">
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Recent Authentication Telemetry</CardTitle>
            <CardDescription>
              Real-time feed of authentication attempts analyzed by SentinelAI.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sessions.length === 0 ? (
                <div className="text-center text-zinc-500 py-4 font-mono text-sm">
                  [ No telemetry data captured yet ]
                </div>
              ) : (
                sessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/50 p-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`mt-1 p-2 rounded-full ${session.routedToDecoy ? 'bg-red-900/30' : 'bg-green-900/30'}`}>
                        {session.routedToDecoy ? (
                          <ShieldAlert className="h-4 w-4 text-red-500" />
                        ) : (
                          <Fingerprint className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-none mb-1">
                          {session.username}{" "}
                          <span className="text-zinc-500 text-xs font-mono ml-2">
                            {session.ip}
                          </span>
                        </p>
                        <p className="text-xs text-zinc-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(session.timestamp).toLocaleString()}
                        </p>
                        {session.routedToDecoy && (
                           <p className="text-xs text-red-400 mt-2">
                             Risk Score: {session.riskScore}/100 - Triggered Active Deception
                           </p>
                        )}
                      </div>
                    </div>
                    <div>
                      {session.routedToDecoy ? (
                        <Badge variant="destructive">Suspicious (Decoy)</Badge>
                      ) : (
                        <Badge variant="success">Legitimate (Real)</Badge>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
