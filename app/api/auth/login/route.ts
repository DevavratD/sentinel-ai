import { NextResponse } from 'next/server';
import { logSession } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, simulatedIp } = body;
    
    // SentinelAI Core Engine - Suspicion Score Calculation
    let riskScore = 10; // Baseline
    
    // Threat Intelligence Check
    if (username.toLowerCase().includes('hacker') || username.toLowerCase().includes('test')) {
      riskScore += 60;
    }
    
    // Password complexity fail anomaly
    if (password === 'admin' || password === '123456') {
      riskScore += 30;
    }

    // IP Anomaly (Simulated)
    if (simulatedIp && simulatedIp.startsWith('104.28.')) {
      riskScore += 40;
    }

    // Determine Deception Route
    const routedToDecoy = riskScore >= 50;

    // Log the event to Defender Dashboard DB
    await logSession({
      username,
      ip: simulatedIp || "192.168.1.100", // fallback
      userAgent: request.headers.get("user-agent") || "Unknown",
      riskScore,
      routedToDecoy,
    });

    if (routedToDecoy) {
      return NextResponse.json({ 
        success: true, 
        route: '/decoy/dashboard',
        message: 'Suspicious activity detected. Routing to adaptive deception environment.'
      });
    }

    return NextResponse.json({ 
      success: true, 
      route: '/real/dashboard',
      message: 'Authentication successful.'
    });

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
