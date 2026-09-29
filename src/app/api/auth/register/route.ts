import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  const { username, password } = await request.json();
  const clean = typeof username === "string" ? username.trim() : "";
  if (!/^[A-Za-z0-9_]{3,30}$/.test(clean)) return NextResponse.json({ error: "아이디는 영문/숫자/_ 3~30자로 입력해주세요." }, { status: 400 });
  if (typeof password !== "string" || password.length < 8 || password.length > 100) return NextResponse.json({ error: "비밀번호는 8~100자로 입력해주세요." }, { status: 400 });
  if (await prisma.user.findUnique({ where: { username: clean } })) return NextResponse.json({ error: "이미 사용 중인 아이디입니다." }, { status: 409 });
  const user = await prisma.user.create({ data: { username: clean, passwordHash: await hashPassword(password) } });
  await createSession(user.id);
  return NextResponse.json({ ok: true });
}
