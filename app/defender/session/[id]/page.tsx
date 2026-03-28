import { getSessionById, Session } from "@/lib/db";
import { notFound } from "next/navigation";
import { ShieldCheck, ShieldAlert, BrainCircuit, Activity, Clock, ArrowLeft, Target, FileSearch } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import Groq from "groq-sdk";

export const revalidate = 0;

async function AiSummaryPanel({ session }: { session: Session }) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === "your_actual_api_key_here") {
    return (
      <div className="p-6 text-center text-amber-400 bg-zinc-900/50 rounded-xl border border-amber-500/20 m-6">
        <ShieldAlert className="h-6 w-6 mx-auto mb-2 opacity-50" />
        <p className="font-mono text-sm">GROQ_API_KEY NOT CONFIGURED</p>
        <p className="text-xs text-zinc-500 mt-1">Please add a valid API key to .env.local to activate the AI Analyst engine.</p>
      </div>
    );
  }

  const groq = new Groq({ apiKey });

  const prompt = `
    You are a cybersecurity analyst. Review this isolated session data:
    ${JSON.stringify(session, null, 2)}
    
    Output exactly 3 sections in JSON format:
    1. "whatHappened": A short summary of what occurred during the session.
    2. "intent": A short analyst-style interpretation of what the session behavior suggests.
    3. "actions": An array of strings representing practical next steps for the defender.
  `;

  let whatHappened = "Analysis failed.";
  let intent = "Analysis failed.";
  let actions = ["Manual investigation required"];

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-70b-8192',
      response_format: { type: 'json_object' }
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;
    if (responseContent) {
      const parsed = JSON.parse(responseContent);
      whatHappened = parsed.whatHappened || whatHappened;
      intent = parsed.intent || intent;
      actions = parsed.actions || actions;
    }
  } catch (error) {
    console.error("Groq Analysis Error:", error);
  }

  return (
    <div className="p-6 grid lg:grid-cols-3 gap-8">
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-blue-300 uppercase tracking-widest flex items-center gap-2">
          <Activity className="h-4 w-4" /> 1. What Happened
        </h3>
        <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/80 min-h-[120px]">
          {whatHappened}
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-blue-300 uppercase tracking-widest flex items-center gap-2">
          <Target className="h-4 w-4" /> 2. Likely Intent
        </h3>
        <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/80 min-h-[120px]">
          {intent}
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-blue-300 uppercase tracking-widest flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" /> 3. Recommended Actions
        </h3>
        <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/80 min-h-[120px]">
          <ul className="text-sm text-zinc-300 space-y-2 list-none">
            {actions.map((act: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span className="leading-snug">{act}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function LoadingAiPanel() {
  return (
    <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
      <div className="relative flex h-10 w-10">
        <div className="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-spin" />
        <div className="absolute inset-2 rounded-full border-2 border-blue-500/20" />
      </div>
      <div>
        <p className="text-sm font-semibold text-blue-400 uppercase tracking-widest">Synthesizing Context...</p>
        <p className="text-xs text-zinc-500 font-mono mt-1">Interrogating AI model on incident telemetry</p>
      </div>
    </div>
  );
}

export default async function SessionDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await getSessionById(resolvedParams.id);

  if (!session) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-blue-500/30">
      <header className="border-b border-zinc-800 bg-zinc-900/70 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/defender" className="p-2 -ml-2 rounded-lg hover:bg-zinc-800 text-zinc-400 transition">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="h-6 w-px bg-zinc-800" />
            <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
              <FileSearch className="h-5 w-5 text-blue-400" />
              Session Investigation
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-zinc-500">ID: {session.sessionId}</span>
            {session.route === "decoy" ? (
              <div className="flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs text-amber-400 font-medium tracking-wide">
                <ShieldAlert className="h-3.5 w-3.5" /> ISOLATED
              </div>
            ) : (
              <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-400 font-medium tracking-wide">
                <ShieldCheck className="h-3.5 w-3.5" /> STANDARD
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-6 py-8 space-y-8">
        
        {/* Core Profile */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-6 flex items-center gap-2">
              <Target className="h-4 w-4" /> Identity Profile
            </h2>
            <div className="grid grid-cols-2 gap-y-6">
              <div>
                <p className="text-xs text-zinc-500 mb-1">Target Account</p>
                <p className="font-mono text-lg font-bold">{session.username}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Detected Password</p>
                <p className="font-mono text-lg text-zinc-300">{session.maskedPassword}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Time of Interception</p>
                <p className="font-mono text-sm text-zinc-400 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> 
                  {new Date(session.timestamp).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Routing Fate</p>
                <p className={`font-mono text-sm font-bold ${session.route === 'decoy' ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {session.route.toUpperCase()} DEPLOYMENT
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">Intent Engine Score</h2>
              <p className="text-xs text-zinc-500 mb-6">Real-time isolation risk index.</p>
            </div>
            
            <div className="flex items-end justify-between">
              <div>
                <span className={`text-6xl font-bold font-mono tracking-tighter leading-none ${session.finalRisk >= 70 ? 'text-red-500' : session.finalRisk >= 40 ? 'text-amber-500' : 'text-emerald-500'}`}>
                  {session.finalRisk}
                </span>
                <span className="text-zinc-500 font-mono text-lg ml-1">/ 100</span>
              </div>
              <div className={`px-3 py-1 mb-2 rounded font-bold uppercase tracking-widest text-xs
                ${session.finalRisk >= 70 ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                  session.finalRisk >= 40 ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
                  'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}
              `}>
                {session.riskLevel}
              </div>
            </div>
          </div>
        </div>

        {/* AI Analyst Summary Panel */}
        <section className="relative rounded-2xl border border-blue-500/30 bg-blue-950/10 overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-indigo-600" />
          
          <div className="border-b border-blue-500/20 bg-blue-900/20 px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-blue-100 flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-blue-400" />
              AI Analyst Summary
            </h2>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-xs text-blue-300 font-medium tracking-wide uppercase">Generative Insights</span>
            </div>
          </div>

          <Suspense fallback={<LoadingAiPanel />}>
            <AiSummaryPanel session={session} />
          </Suspense>
        </section>

      </main>
    </div>
  );
}
