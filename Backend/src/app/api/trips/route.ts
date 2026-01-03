import { NextResponse } from 'next/server';
import { createTrip, getUserTrips } from '@/db/trips';

export async function POST(request: Request) {
  try {
    const json = await request.json();
    // TODO: Get userId from session
    const userId = "user_2rG5..." // Mock or extract from auth
    
    // For now we might need to inject userId if not present, but schema requires it.
    // In a real app we'd get it from the session.
    // Assuming the client might pass it or we use a hardcoded dev user for now as auth isn't fully set up in the context provided
    const payload = { ...json, userId: json.userId || 'dev-user-1' };
    
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'dev-user-1';
    
    const trips = await getUserTrips(userId);
    
    return NextResponse.json({ ok: true, data: trips });
  } catch (error) {
    return NextResponse.json({ ok: false, error: { message: 'Failed to fetch trips' } }, { status: 500 });
  }
}

