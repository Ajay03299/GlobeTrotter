import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE_NAME = process.env.COOKIE_NAME ?? "gt_session";

export async function POST(req: NextRequest) {
  try {
    const jar = await cookies();
    jar.delete(COOKIE_NAME);
    
    return NextResponse.json({ ok: true, message: "Logged out successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: { message: error.message || "Logout failed" } },
      { status: 500 }
    );
  }
}
