import { NextRequest, NextResponse } from 'next/server';
import { logAction } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, actionType, details } = body;

    await logAction({
      sessionId: sessionId || 'anonymous-decoy-session',
      actionType,
      details,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Action log error:', error);
    return NextResponse.json({ error: 'Failed to log action' }, { status: 500 });
  }
}
