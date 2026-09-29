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
    <main className="flex min-h-screen items-center justify-center p-4 md:p-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[40px] border border-white/90 bg-white/70 shadow-[0_30px_90px_rgba(86,63,52,0.14)] backdrop-blur-xl md:grid-cols-[0.95fr_1.05fr]">
        <section className="relative hidden overflow-hidden bg-gradient-to-br from-orange-400 via-rose-400 to-violet-500 p-10 text-white md:flex md:min-h-[590px] md:flex-col">
          <div className="absolute -right-24 -top-20 size-72 rounded-full bg-white/15 blur-2xl" />
          <div className="absolute -bottom-24 -left-20 size-72 rounded-full bg-yellow-200/20 blur-2xl" />

          <div className="relative flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl bg-white/20 text-2xl backdrop-blur">🐾</span>
            <div>
              <p className="text-xl font-black tracking-tight">Poppy</p>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/60">dog mind</p>
            </div>
          </div>

          <div className="relative my-auto">
            <p className="text-sm font-black text-white/70">오늘도 한 발 더 가까이</p>
            <h1 className="mt-3 text-4xl font-black leading-tight tracking-[-0.04em]">
              강아지의 작은 신호를
              <br />
              놓치지 않도록.
            </h1>
            <p className="mt-5 max-w-sm text-sm font-medium leading-7 text-white/80">
              사진과 짧은 영상 속 행동 신호를 함께 살펴보고, 지금 어떤 상태일지 이해하기 쉽게 정리해드려요.
            </p>
          </div>

          <div className="relative rounded-[26px] border border-white/20 bg-white/15 p-4 backdrop-blur">
            <p className="text-xs font-bold text-white/65">Poppy tip</p>
            <p className="mt-1 text-sm font-bold">정답보다 중요한 건, 강아지를 더 자세히 관찰하는 습관이에요. 🐶</p>
          </div>
        </section>

        <section className="flex items-center p-6 sm:p-10 lg:p-12">
          <form onSubmit={onSubmit} className="mx-auto w-full max-w-sm">
            <div className="mb-8 md:hidden">
              <div className="flex items-center gap-2">
                <span className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-orange-400 to-rose-500 text-xl text-white">🐾</span>
                <span className="font-black">Poppy</span>
              </div>
            </div>

            <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-500">
              {isLogin ? "welcome back" : "nice to meet you"}
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] text-stone-900">
              {isLogin ? "다시 만나서 반가워요" : "Poppy를 시작해볼까요?"}
            </h2>
            <p className="mt-2 text-sm font-medium leading-6 text-stone-500">
              {isLogin ? "로그인하고 내 강아지의 기록을 이어서 확인하세요." : "간단한 계정을 만들고 강아지의 행동을 기록해보세요."}
            </p>

            <div className="mt-7 space-y-4">
              <label className="block">
                <span className="mb-2 block text-xs font-black text-stone-600">아이디</span>
                <input
                  name="username"
                  required
                  minLength={3}
                  maxLength={30}
                  autoComplete="username"
                  placeholder="아이디를 입력하세요"
                  className="w-full rounded-2xl border border-stone-200 bg-white/90 px-4 py-3.5 text-sm shadow-sm"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-black text-stone-600">비밀번호</span>
                <input
                  name="password"
                  required
                  minLength={8}
                  maxLength={100}
                  type="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  placeholder="8자 이상 입력하세요"
                  className="w-full rounded-2xl border border-stone-200 bg-white/90 px-4 py-3.5 text-sm shadow-sm"
                />
              </label>
            </div>

            {error && (
              <p className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">
                {error}
              </p>
            )}

            <button
              disabled={loading}
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 p-3.5 text-sm font-black text-white shadow-[0_12px_28px_rgba(244,103,81,0.26)] transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-50"
            >
              {loading ? "처리 중..." : isLogin ? "로그인" : "가입하고 시작"}
            </button>

            <div className="mt-5 text-center text-sm font-bold text-stone-500 [&_a]:text-violet-600 [&_a]:underline-offset-4 [&_a]:hover:underline">
              {alternate}
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
