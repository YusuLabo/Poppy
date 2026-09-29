import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  const { username, password } = await request.json();
  const user = typeof username === "string" ? await prisma.user.findUnique({ where: { username: username.trim() } }) : null;
  if (!user || typeof password !== "string" || !(await verifyPassword(user.passwordHash, password))) return NextResponse.json({ error: "아이디 또는 비밀번호가 맞지 않습니다." }, { status: 401 });
  await createSession(user.id);
  return NextResponse.json({ ok: true });
}
