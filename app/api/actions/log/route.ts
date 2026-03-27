import { NextResponse } from 'next/server';
import { logAction } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { actionType, details } = body;
    
    // In a real app we would use a true session cookie to map to sessionId
    await logAction({
      sessionId: "anonymous-decoy-session",
      actionType,
      details,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
