"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

export function AuthForm({ mode, alternate }: { mode: "login" | "register"; alternate: ReactNode }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError(""); setLoading(true);
    const data = new FormData(e.currentTarget);
    const res = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username: data.get("username"), password: data.get("password") }),
    });
    const body = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) { setError(body.error ?? "요청에 실패했습니다."); return; }
    router.push("/"); router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 rounded-3xl bg-white p-7 shadow-sm">
        <div><p className="text-sm text-neutral-500">Dog Mind</p><h1 className="text-2xl font-bold">{mode === "login" ? "로그인" : "회원가입"}</h1></div>
        <input name="username" required minLength={3} maxLength={30} autoComplete="username" placeholder="아이디" className="w-full rounded-xl border p-3" />
        <input name="password" required minLength={8} maxLength={100} type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder="비밀번호" className="w-full rounded-xl border p-3" />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="w-full rounded-xl bg-black p-3 text-white disabled:opacity-50">{loading ? "처리 중..." : mode === "login" ? "로그인" : "가입하고 시작"}</button>
        <div className="text-center text-sm text-neutral-600">{alternate}</div>
      </form>
    </main>
  );
}
