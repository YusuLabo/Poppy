"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

export function AuthForm({ mode, alternate }: { mode: "login" | "register"; alternate: ReactNode }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const data = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/" + mode, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username: data.get("username"), password: data.get("password") }),
    });

    const body = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(body.error ?? "요청에 실패했습니다.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  const isLogin = mode === "login";

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-xl bg-white p-7 shadow-lg md:p-8">
        <div className="mb-7">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg bg-[#667eea] text-sm font-bold text-white">P</span>
            <div>
              <p className="text-lg font-bold text-slate-800">Poppy</p>
              <p className="text-xs text-slate-400">Dog behavior analysis</p>
            </div>
          </div>

          <h1 className="mt-7 text-2xl font-bold text-slate-800">
            {isLogin ? "로그인" : "회원가입"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {isLogin ? "계정에 로그인해 분석을 계속하세요." : "계정을 만들고 Poppy를 시작하세요."}
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">아이디</span>
            <input
              name="username"
              required
              minLength={3}
              maxLength={30}
              autoComplete="username"
              placeholder="아이디 입력"
              className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">비밀번호</span>
            <input
              name="password"
              required
              minLength={8}
              maxLength={100}
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              placeholder="비밀번호 입력"
              className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm"
            />
          </label>

          {error && (
            <p className="rounded-lg bg-red-50 px-3.5 py-3 text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          <button
            disabled={loading}
            className="w-full rounded-lg bg-[#6377e8] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#5568d7] disabled:opacity-50"
          >
            {loading ? "처리 중..." : isLogin ? "로그인" : "가입하고 시작"}
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-slate-500 [&_a]:font-semibold [&_a]:text-[#6377e8] [&_a]:hover:underline">
          {alternate}
        </div>
      </div>
    </main>
  );
}
