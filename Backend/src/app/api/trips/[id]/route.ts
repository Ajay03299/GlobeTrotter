import { NextRequest, NextResponse } from 'next/server';
import { getTripById } from '@/db/trips';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { ok: false, error: { message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    const { id } = await params;
    const trip = await getTripById({ tripId: id });

    if (!trip) {
      return NextResponse.json(
        { ok: false, error: { message: 'Trip not found' } },
        { status: 404 }
      );
    }

    // Check if user owns this trip
    if (trip.userId !== user.userId) {
      return NextResponse.json(
        { ok: false, error: { message: 'Forbidden' } },
        { status: 403 }
      );
    }

    return NextResponse.json({ ok: true, data: trip });
  } catch (error: any) {
    console.error('Get trip error:', error);
    return NextResponse.json(
      { ok: false, error: { message: error.message || 'Failed to fetch trip' } },
      { status: 500 }
    );
  }
}
