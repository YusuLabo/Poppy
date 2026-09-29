import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const dogs = await prisma.dog.findMany({ where: { userId: user.id }, include: { traits: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(dogs);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name || name.length > 40) return NextResponse.json({ error: "이름을 확인해주세요." }, { status: 400 });
  const dog = await prisma.dog.create({ data: {
    userId: user.id,
    name,
    birthDate: body.birthDate ? new Date(body.birthDate) : null,
    breedKey: body.breedKey || null,
    sex: ["MALE","FEMALE","UNKNOWN"].includes(body.sex) ? body.sex : "UNKNOWN",
    neutered: ["YES","NO","UNKNOWN"].includes(body.neutered) ? body.neutered : "UNKNOWN",
    personality: typeof body.personality === "string" ? body.personality.slice(0, 500) : null,
  }});
  return NextResponse.json(dog, { status: 201 });
}
