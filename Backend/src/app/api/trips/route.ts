import { NextRequest, NextResponse } from 'next/server';
import { createTrip, getUserTrips } from '@/db/trips';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { ok: false, error: { message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    const json = await request.json();
    const payload = { ...json, userId: user.userId };
    
    const trip = await createTrip(payload);
    return NextResponse.json({ ok: true, data: trip });
  } catch (error: any) {
    console.error('Create Trip Error:', error);
    return NextResponse.json(
      { ok: false, error: { message: error.message || 'Failed to create trip' } },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { ok: false, error: { message: 'Unauthorized' } },
        { status: 401 }
      );
    }
    
    const trips = await getUserTrips(user.userId);
    
    return NextResponse.json({ ok: true, data: trips });
  } catch (error) {
    return NextResponse.json({ ok: false, error: { message: 'Failed to fetch trips' } }, { status: 500 });
  }
}

