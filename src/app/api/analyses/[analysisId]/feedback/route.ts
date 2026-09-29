import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: Request, { params }: { params: Promise<{ analysisId: string }> }) {
  const user = await getCurrentUser(); if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const { analysisId } = await params; const body = await request.json();
  const feedback = body.feedback === "MATCH" ? "MATCH" : body.feedback === "NOT_MATCH" ? "NOT_MATCH" : null;
  if (!feedback) return NextResponse.json({ error: "INVALID_FEEDBACK" }, { status: 400 });
  const item = await prisma.analysis.findFirst({ where: { id: analysisId, userId: user.id } });
  if (!item) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  await prisma.analysis.update({ where: { id: analysisId }, data: { feedback } });
  return NextResponse.json({ ok: true });
}
