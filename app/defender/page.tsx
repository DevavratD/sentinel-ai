import { getRecentSessions } from "@/lib/db";
import { ShieldAlert, Fingerprint, Activity, Clock, Terminal, AlertTriangle, Key, Cpu, Info, Search, ArrowRight } from "lucide-react";
import Link from "next/link";

export const revalidate = 0; // Disable cache for live feed feel

export default async function DefenderDashboard() {
  const sessions = await getRecentSessions();
  const totalEvents = sessions.reduce((acc, s) => acc + (s.events?.length || 0), 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-900/70 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 border border-blue-500/30">
              <ShieldAlert className="h-4 w-4 text-blue-400" />
            </div>
            <h1 className="text-xl font-bold text-zinc-100 tracking-tight">SentinelAI <span className="text-zinc-500 font-normal">| Defender console</span></h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs text-red-400 font-mono tracking-wider">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              LIVE TELEMETRY
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-6 py-8 space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-zinc-400" />
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Total Scanned</p>
            </div>
            <p className="text-3xl font-bold">{sessions.length}</p>
          </div>
          <div className="rounded-xl border border-amber-900/50 bg-amber-950/20 p-5">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="h-4 w-4 text-amber-500" />
              <p className="text-xs font-medium text-amber-500 uppercase tracking-wider">Isolated Sessions</p>
            </div>
            <p className="text-3xl font-bold text-amber-500">{sessions.filter(s => s.route === 'decoy').length}</p>
          </div>
          <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="h-4 w-4 text-red-400" />
              <p className="text-xs font-medium text-red-400 uppercase tracking-wider">Suspicious Events Logged</p>
            </div>
            <p className="text-3xl font-bold text-red-400">{totalEvents}</p>
          </div>
          <div className="rounded-xl border border-emerald-900/50 bg-emerald-950/20 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Fingerprint className="h-4 w-4 text-emerald-400" />
              <p className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Legit Authorized</p>
            </div>
            <p className="text-3xl font-bold text-emerald-400">{sessions.filter(s => s.route === 'real').length}</p>
          </div>
        </div>

        {/* Sessions Feed */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Cpu className="h-5 w-5 text-blue-400" /> Isolated Sessions Feed
          </h2>

          {sessions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-800 p-12 text-center text-zinc-500 font-mono text-sm">
              [ WAITING FOR TELEMETRY DATA ]
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => {
                const sessionEvents = session.events || [];
                const isHighRisk = session.finalRisk >= 70;
                const isMediumRisk = session.finalRisk >= 40 && session.finalRisk < 70;

                return (
                  <div key={session.sessionId} className={`rounded-xl border bg-zinc-900/60 overflow-hidden transition-all hover:border-zinc-700
                    ${session.route === 'decoy' ? 'border-amber-900/30' : 'border-emerald-900/30'}
                  `}>
                    <div className="p-5 flex flex-col lg:flex-row gap-6">
                      
                      {/* Left Column: Core Identity & Context (approx 30%) */}
                      <div className="lg:w-1/3 space-y-4 border-b lg:border-b-0 lg:border-r border-zinc-800 pb-4 lg:pb-0 lg:pr-6">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            {session.route === 'decoy' ? (
                              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                <ShieldAlert className="h-5 w-5 text-amber-500" />
                              </div>
                            ) : (
                              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                <Fingerprint className="h-5 w-5 text-emerald-500" />
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-zinc-100 font-mono text-lg">{session.username}</p>
                              <p className="text-xs text-zinc-400 flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {new Date(session.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <Link href={`/defender/session/${session.sessionId}`} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 hover:underline px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 transition-all font-medium">
                            Investigate <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between border-b border-zinc-800/50 pb-1">
                            <span className="text-zinc-500">Captured Password</span>
                            <span className="font-mono text-zinc-300">{session.maskedPassword}</span>
                          </div>
                          <div className="flex justify-between pb-1">
                            <span className="text-zinc-500">Routing</span>
                            {session.route === 'decoy' ? (
                              <span className="text-amber-400 font-medium tracking-wide">ISOLATED DECOY</span>
                            ) : (
                              <span className="text-emerald-400 font-medium tracking-wide">STANDARD APP</span>
                            )}
                          </div>
                        </div>

                        {session.pagesVisited && session.pagesVisited.length > 0 && (
                          <div className="mt-2 text-xs">
                            <p className="text-zinc-500 uppercase tracking-wider mb-2">Reconnaissance Path</p>
                            <div className="flex flex-wrap gap-1">
                              {session.pagesVisited.map((page, i) => (
                                <span key={i} className="bg-zinc-800/80 text-zinc-300 px-2 py-0.5 rounded text-[10px] font-mono border border-zinc-700">
                                  {page}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Middle Column: Engine Scoring (approx 35%) */}
                      <div className="lg:w-1/3 space-y-4 border-b lg:border-b-0 lg:border-r border-zinc-800 pb-4 lg:pb-0 lg:pr-6">
                        <div>
                          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                            Intent Analysis Engine
                          </p>
                          <div className="flex items-center gap-4 bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/50">
                            <div className="text-center flex-1">
                              <p className="text-[10px] text-zinc-500 font-mono">BASE RISK</p>
                              <p className="text-xl font-bold text-zinc-300">{session.sessionRisk}</p>
                            </div>
                            <div className="text-zinc-600 font-bold">+</div>
                            <div className="text-center flex-1">
                              <p className="text-[10px] text-zinc-500 font-mono">INTENT</p>
                              <p className="text-xl font-bold text-blue-400">{session.intentScore}</p>
                            </div>
                            <div className="text-zinc-600 font-bold">=</div>
                            <div className="text-center flex-1">
                              <p className="text-[10px] text-zinc-500 font-mono">FINAL</p>
                              <p className={`text-2xl font-bold ${isHighRisk ? 'text-red-500' : isMediumRisk ? 'text-amber-500' : 'text-emerald-500'}`}>
                                {session.finalRisk}
                              </p>
                            </div>
                          </div>
                        </div>

                        {session.observedIntent && (
                          <div className="mt-4 rounded border border-zinc-800 bg-zinc-950/50 p-3">
                            <div className="flex items-start gap-2">
                              <Info className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-zinc-300 leading-relaxed">{session.observedIntent}</p>
                            </div>
                          </div>
                        )}

                        {session.reasons && session.reasons.length > 0 && (
                          <div className="mt-2 rounded border border-purple-500/20 bg-purple-500/5 p-2">
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-xs font-semibold text-purple-400">Risk Context</p>
                                <ul className="text-xs text-purple-300 mt-0.5 list-disc pl-3">
                                  {session.reasons.map((r, i) => <li key={i}>{r}</li>)}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Column: Events (approx 35%) */}
                      <div className="lg:w-1/3 flex flex-col">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Observed Intent Telemetry</p>
                        
                        {session.route === 'real' ? (
                          <div className="flex-1 rounded border border-dashed border-emerald-900/30 bg-emerald-950/10 p-4 flex items-center justify-center text-center">
                            <p className="text-xs text-emerald-500 font-mono">Session routed to standard application.<br/>No isolation telemetry available.</p>
                          </div>
                        ) : sessionEvents.length === 0 ? (
                          <div className="flex-1 rounded border border-dashed border-zinc-800 bg-zinc-950/30 p-4 flex items-center justify-center text-center">
                            <p className="text-xs text-zinc-500 font-mono">Awaiting suspicious activity inside the isolated environment...</p>
                          </div>
                        ) : (
                          <div className="flex-1 max-h-[220px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                            {sessionEvents.map((event, i) => (
                              <div key={i} className="relative pl-4 border-l-2 border-red-500/30 pb-3 last:pb-0">
                                <div className="absolute w-2 h-2 rounded-full bg-red-500 -left-[5px] top-1.5 ring-2 ring-zinc-900" />
                                <div className="rounded bg-zinc-950/80 border border-zinc-800 p-2 text-xs">
                                  <div className="flex justify-between items-start mb-1 text-zinc-500 font-mono text-[10px]">
                                    <span className="uppercase text-red-500">{event.type}</span>
                                    <span>{new Date(event.timestamp).toLocaleTimeString()}</span>
                                  </div>
                                  <p className="text-zinc-300">{event.label}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
