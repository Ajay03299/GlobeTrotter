import { NextResponse } from 'next/server';
import { prisma } from '@/db/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cityId = searchParams.get('cityId');

    if (!cityId) {
      return NextResponse.json({ ok: false, error: { message: 'City ID required' } }, { status: 400 });
    }

    const activities = await prisma.activity.findMany({
      where: { cityId },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({ ok: true, data: activities });
  } catch (error) {
    return NextResponse.json({ ok: false, error: { message: 'Failed to fetch activities' } }, { status: 500 });
  }
}

