import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: Request, { params }: { params: Promise<{ dogId: string }> }) {
  const user = await getCurrentUser(); if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const { dogId } = await params; const dog = await prisma.dog.findFirst({ where: { id: dogId, userId: user.id } });
  if (!dog) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  const body = await request.json(); const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text || text.length > 200) return NextResponse.json({ error: "특징은 1~200자로 입력해주세요." }, { status: 400 });
  const trait = await prisma.dogTrait.create({ data: { dogId, text, source: body.source === "AI_CONFIRMED" ? "AI_CONFIRMED" : body.source === "PRESET" ? "PRESET" : "USER", sourceAnalysisId: body.sourceAnalysisId || null } });
  return NextResponse.json(trait, { status: 201 });
}
