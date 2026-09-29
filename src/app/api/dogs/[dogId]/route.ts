import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

async function ownedDog(userId: string, id: string) { return prisma.dog.findFirst({ where: { id, userId }, include: { traits: true } }); }

export async function GET(_: Request, { params }: { params: Promise<{ dogId: string }> }) {
  const user = await getCurrentUser(); if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const { dogId } = await params; const dog = await ownedDog(user.id, dogId);
  if (!dog) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  return NextResponse.json(dog);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ dogId: string }> }) {
  const user = await getCurrentUser(); if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const { dogId } = await params; if (!(await ownedDog(user.id, dogId))) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  const body = await request.json();
  const dog = await prisma.dog.update({ where: { id: dogId }, data: {
    ...(typeof body.name === "string" ? { name: body.name.trim().slice(0,40) } : {}),
    ...(body.birthDate !== undefined ? { birthDate: body.birthDate ? new Date(body.birthDate) : null } : {}),
    ...(body.breedKey !== undefined ? { breedKey: body.breedKey || null } : {}),
    ...(body.personality !== undefined ? { personality: body.personality ? String(body.personality).slice(0,500) : null } : {}),
  }});
  return NextResponse.json(dog);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ dogId: string }> }) {
  const user = await getCurrentUser(); if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const { dogId } = await params; if (!(await ownedDog(user.id, dogId))) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  await prisma.dog.delete({ where: { id: dogId } }); return NextResponse.json({ ok: true });
}
