export const runtime = "nodejs";

import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/http";
import { LoginSchema } from "@/lib/validators";
import { signUserToken, setAuthCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) return fail("Invalid input", 400, parsed.error.flatten());

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return fail("Invalid credentials", 401);

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return fail("Invalid credentials", 401);

  const token = await signUserToken({ userId: user.id, email: user.email });
  await setAuthCookie(token);

  return ok({ id: user.id, name: user.name, email: user.email });
}
