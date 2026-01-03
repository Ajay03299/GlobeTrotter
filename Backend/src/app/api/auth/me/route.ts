export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/http";
import { requireUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { error, user } = await requireUser(req);
  if (error) return error;

  const me = await prisma.user.findUnique({
    where: { id: user!.userId },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  if (!me) return fail("User not found", 404);
  return ok(me);
}
