import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { fail } from "./http";

const COOKIE_NAME = process.env.COOKIE_NAME ?? "gt_session";

function secretKey() {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET missing");
  return new TextEncoder().encode(s);
}

export async function signUserToken(payload: { userId: string; email: string }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey());
}

export async function setAuthCookie(token: string) {
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getUserFromRequest(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secretKey());
    const userId = payload.userId as string | undefined;
    const email = payload.email as string | undefined;
    if (!userId || !email) return null;
    return { userId, email };
  } catch {
    return null;
  }
}

export async function requireUser(req: NextRequest) {
  const u = await getUserFromRequest(req);
  if (!u) return { error: fail("Unauthorized", 401) as any, user: null };
  return { error: null, user: u };
}
