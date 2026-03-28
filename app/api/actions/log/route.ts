import { NextRequest, NextResponse } from 'next/server';
import { logEvent } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, actionType, details } = body;

    const isNav = actionType === 'tab_navigation';

    await logEvent(sessionId || 'anonymous-decoy-session', {
      type: actionType,
      label: details,
      isNav,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Action log error:', error);
    return NextResponse.json({ error: 'Failed to log action' }, { status: 500 });
  }
}
