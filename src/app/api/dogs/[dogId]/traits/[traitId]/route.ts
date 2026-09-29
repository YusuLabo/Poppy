import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export async function DELETE(_: Request, { params }: { params: Promise<{ dogId: string; traitId: string }> }) {
  const user = await getCurrentUser(); if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const { dogId, traitId } = await params;
  const trait = await prisma.dogTrait.findFirst({ where: { id: traitId, dogId, dog: { userId: user.id } } });
  if (!trait) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  await prisma.dogTrait.delete({ where: { id: traitId } }); return NextResponse.json({ ok: true });
}
