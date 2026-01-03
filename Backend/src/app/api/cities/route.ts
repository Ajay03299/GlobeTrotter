import { NextResponse } from 'next/server';
import { prisma } from '@/db/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    const cities = await prisma.city.findMany({
      where: query ? {
        OR: [
          { name: { contains: query } },
          { country: { contains: query } }
        ]
      } : undefined,
      orderBy: { popularity: 'desc' },
      take: 50
    });

    return NextResponse.json({ ok: true, data: cities });
  } catch (error) {
    return NextResponse.json({ ok: false, error: { message: 'Failed to fetch cities' } }, { status: 500 });
  }
}

