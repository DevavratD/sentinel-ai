import { NextRequest, NextResponse } from 'next/server';
import { logSession } from '@/lib/db';
import { calculateSessionRisk } from '@/lib/suspicion-engine';

// In-memory retry tracker (IP -> retry count) for MVP purposes.
// In production, use Redis or a DB.
const ipRetryTracker = new Map<string, number>();

// CVE context for auth-related vulnerabilities
const CVE_CONTEXT = [
  { id: "CVE-2024-3094", severity: 9.8, description: "Critical authentication backdoor in OpenSSH-related libraries." },
  { id: "CVE-2023-44487", severity: 7.5, description: "HTTP/2 Rapid Reset Attack enabling DDoS via auth endpoint exhaustion." },
  { id: "CVE-2024-21762", severity: 9.6, description: "Out-of-bounds write in SSL VPN authentication allowing unauthenticated RCE." },
];

function getRiskReasons(riskScore: number, retryCount: number, isSuspiciousName: boolean): string[] {
  const reasons: string[] = [];
  if (riskScore >= 70) reasons.push(`${CVE_CONTEXT[0].id} — ${CVE_CONTEXT[0].description}`);
  else if (riskScore >= 50) reasons.push(`${CVE_CONTEXT[2].id} — ${CVE_CONTEXT[2].description}`);

  if (retryCount > 1) reasons.push("Multiple failed authentications detected");
  if (isSuspiciousName) reasons.push("High-risk target identifier used");
  if (reasons.length === 0) reasons.push("Standard authentication profile");

  return reasons;
}

function generateAiExplanation(username: string, riskScore: number, riskLevel: string, routedToDecoy: boolean, retryCount: number): string {
  const suspiciousKeywords = ['admin', 'root', 'test', 'Demo_suspicious'];
  const isSuspiciousName = suspiciousKeywords.some(k => username.toLowerCase().includes(k));

  const parts: string[] = [];
  parts.push(`Session risk assessed as **${riskLevel}** (score: ${riskScore}/100).`);

  if (retryCount > 1) {
    parts.push(`Detected **${retryCount} repeated login attempts** from this source IP, indicative of brute force behavior.`);
  }

  if (isSuspiciousName) {
    parts.push(`The username "${username}" matches a known high-value target pattern (MITRE ATT&CK T1078 — Valid Accounts).`);
  }

  if (riskScore >= 70) {
    parts.push(`Composite risk exceeds threshold. This session exhibits characteristics consistent with credential stuffing or targeted admin account enumeration.`);
  } else if (riskScore >= 50) {
    parts.push(`Risk score indicates a moderate-to-high threat. Session anomalies suggest possible compromised credentials or reconnaissance.`);
  } else {
    parts.push(`Session patterns are within normal parameters. No significant threat indicators detected.`);
  }

  if (routedToDecoy) {
    parts.push(`SentinelAI routed this session to the isolated environment to analyze intent and assess risk context.`);
  } else {
    parts.push(`Session was authenticated normally and allowed access to the standard application.`);
  }

  return parts.join(' ');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, simulatedIp } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    const ip = simulatedIp || request.headers.get('x-forwarded-for') || '192.168.1.100';
    // const userAgent = request.headers.get('user-agent') || 'Unknown';

    // Track retries
    const currentRetries = ipRetryTracker.get(ip) || 0;
    const retryCount = currentRetries + 1;
    ipRetryTracker.set(ip, retryCount);

    const { riskScore, riskLevel } = calculateSessionRisk({ username, password, ip, retryCount });

    const routedToDecoy = riskScore >= 50;
    const route = routedToDecoy ? '/decoy/dashboard' : '/real/dashboard';

    // new context mapping
    const suspiciousKeywords = ['admin', 'root', 'test', 'Demo_suspicious'];
    const isSuspiciousName = suspiciousKeywords.some(k => username.toLowerCase().includes(k));
    const reasons = getRiskReasons(riskScore, retryCount, isSuspiciousName);
    const observedIntent = generateAiExplanation(username, riskScore, riskLevel, routedToDecoy, retryCount);

    const session = await logSession({
      username,
      password,
      route: routedToDecoy ? "decoy" : "real",
      sessionRisk: riskScore,
      intentScore: 0,
      finalRisk: riskScore,
      riskLevel: riskLevel as "Low" | "Medium" | "High",
      reasons,
      observedIntent,
    });

    return NextResponse.json({
      success: true,
      route,
      sessionId: session.sessionId,
      riskScore,
      riskLevel,
    });
  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
