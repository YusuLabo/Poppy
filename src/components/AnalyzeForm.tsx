"use client";

import { useEffect, useState } from "react";

type Dog = { id: string; name: string };
type Result = {
  dogSpeech: string;
  state: { emotion: string; desire: string };
  confidence: "HIGH" | "MEDIUM" | "LOW";
  observations: Array<{ evidence: string; source: string }>;
  interpretation: string;
  alternatives: Array<{ interpretation: string; reason: string }>;
  advice: string;
  aiSuggestedTraits: Array<{ trait: string; reason: string }>;
  limitations: string[];
};

const confidenceLabel = { HIGH: "높음", MEDIUM: "보통", LOW: "낮음" };
const confidenceTone = {
  HIGH: "bg-emerald-100 text-emerald-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  LOW: "bg-stone-100 text-stone-600",
};

export function AnalyzeForm() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [selectedDogId, setSelectedDogId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [savedTraits, setSavedTraits] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/dogs")
      .then((response) => (response.ok ? response.json() : []))
      .then(setDogs);
  }, []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    const form = new FormData(e.currentTarget);
    const response = await fetch("/api/analyses", { method: "POST", body: form });
    const body = await response.json().catch(() => ({}));

    setLoading(false);

    if (!response.ok) {
      setError(body.error ?? "분석에 실패했습니다.");
      return;
    }

    setResult(body.result);
    setAnalysisId(body.id);
  }

  async function feedback(value: "MATCH" | "NOT_MATCH") {
    if (!analysisId) return;

    await fetch("/api/analyses/" + analysisId + "/feedback", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ feedback: value }),
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <form
        onSubmit={submit}
        className="h-fit space-y-5 rounded-[32px] border border-white/90 bg-white/80 p-5 shadow-[0_18px_55px_rgba(86,63,52,0.09)] backdrop-blur-xl lg:sticky lg:top-28"
      >
        <div className="flex items-start gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-orange-100 to-rose-100 text-xl">
            📷
          </div>
          <div>
            <h2 className="font-black text-stone-800">분석할 장면 알려주기</h2>
            <p className="mt-1 text-xs font-medium leading-5 text-stone-400">
              상황 정보가 있을수록 행동 신호를 더 맥락 있게 볼 수 있어요.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Field label="분석 대상" hint="등록된 강아지를 고르면 개별 특징도 참고해요.">
            <select
              name="dogId"
              value={selectedDogId}
              onChange={(e) => setSelectedDogId(e.target.value)}
              className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3.5 text-sm font-semibold shadow-sm"
            >
              <option value="">등록되지 않은 강아지</option>
              {dogs.map((dog) => (
                <option key={dog.id} value={dog.id}>
                  {dog.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="현재 상황">
            <select
              name="situationType"
              className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3.5 text-sm font-semibold shadow-sm"
            >
              <option value="">선택 안 함</option>
              <option>놀이 중</option>
              <option>산책 중</option>
              <option>식사 전</option>
              <option>휴식 중</option>
              <option>낯선 사람을 만남</option>
              <option>다른 강아지를 만남</option>
            </select>
          </Field>

          <Field label="상황 메모" optional>
            <textarea
              name="situationText"
              maxLength={500}
              rows={3}
              placeholder="예: 산책을 나가기 직전인데 현관 앞에서 계속 쳐다봐요."
              className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3.5 text-sm font-medium leading-6 shadow-sm"
            />
          </Field>

          <Field label="사진 또는 영상" hint="영상은 최대 30초까지 사용할 수 있어요.">
            <label className="group block cursor-pointer rounded-[24px] border-2 border-dashed border-orange-200 bg-orange-50/55 p-4 transition hover:border-orange-300 hover:bg-orange-50">
              <div className="mb-3 flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-2xl bg-white text-lg shadow-sm">＋</span>
                <div>
                  <p className="text-sm font-black text-stone-700">파일 선택</p>
                  <p className="text-[11px] font-semibold text-stone-400">사진 · 30초 이하 영상</p>
                </div>
              </div>
              <input
                required
                name="media"
                type="file"
                accept="image/*,video/*"
                className="block w-full text-xs font-semibold text-stone-500 file:mr-3 file:rounded-xl file:border-0 file:bg-white file:px-3 file:py-2 file:text-xs file:font-black file:text-orange-600 file:shadow-sm"
              />
            </label>
          </Field>
        </div>

        <button
          disabled={loading}
          className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 p-3.5 text-sm font-black text-white shadow-[0_12px_28px_rgba(244,103,81,0.28)] transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-50"
        >
          {loading ? "행동 신호 살펴보는 중..." : "✦ 분석하기"}
        </button>

        {error && (
          <p className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">
            {error}
          </p>
        )}
      </form>

      <div>
        {!result ? (
          <div className="relative min-h-[480px] overflow-hidden rounded-[32px] border border-white/90 bg-white/70 p-7 shadow-[0_18px_55px_rgba(86,63,52,0.08)] backdrop-blur-xl md:p-10">
            <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-violet-100 blur-3xl" />
            <div className="relative flex min-h-[400px] flex-col items-center justify-center text-center">
              <div className="grid size-20 place-items-center rounded-[28px] bg-gradient-to-br from-orange-100 via-rose-50 to-violet-100 text-4xl shadow-inner">
                🐶
              </div>
              <h2 className="mt-5 text-xl font-black tracking-tight text-stone-800">어떤 신호를 보내고 있을까요?</h2>
              <p className="mt-2 max-w-sm text-sm font-medium leading-6 text-stone-400">
                왼쪽에서 사진이나 영상을 선택하고 상황을 알려주세요. 분석 결과가 이곳에 보기 좋게 정리됩니다.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs font-bold text-stone-500">
                <span className="rounded-full bg-orange-50 px-3 py-2">감정</span>
                <span className="rounded-full bg-violet-50 px-3 py-2">욕구</span>
                <span className="rounded-full bg-emerald-50 px-3 py-2">관찰 근거</span>
                <span className="rounded-full bg-amber-50 px-3 py-2">행동 조언</span>
              </div>
            </div>
          </div>
        ) : (
          <article className="space-y-5 rounded-[32px] border border-white/90 bg-white/80 p-5 shadow-[0_18px_55px_rgba(86,63,52,0.09)] backdrop-blur-xl md:p-7">
            <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-orange-100 via-rose-50 to-violet-100 p-6">
              <div className="pointer-events-none absolute -right-10 -top-12 size-40 rounded-full bg-white/50 blur-2xl" />
              <div className="relative">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-600/70">Poppy says</p>
                <p className="mt-2 text-2xl font-black leading-tight tracking-[-0.03em] text-stone-900 md:text-3xl">
                  🐶 “{result.dogSpeech}”
                </p>
              </div>
            </section>

            <div className="grid gap-3 sm:grid-cols-3">
              <Stat icon="☀" label="감정" value={result.state.emotion} tone="bg-orange-50 text-orange-700" />
              <Stat icon="♡" label="욕구" value={result.state.desire} tone="bg-violet-50 text-violet-700" />
              <Stat
                icon="✓"
                label="확신"
                value={confidenceLabel[result.confidence]}
                tone={confidenceTone[result.confidence]}
              />
            </div>

            <ResultSection title="해석" icon="✦">
              <p className="text-sm font-medium leading-7 text-stone-600">{result.interpretation}</p>
            </ResultSection>

            <ResultSection title="판단 근거" icon="👀">
              <ul className="space-y-2.5">
                {result.observations.map((observation, index) => (
                  <li key={index} className="rounded-2xl border border-stone-100 bg-stone-50/65 p-4">
                    <span className="inline-flex rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-stone-400 shadow-sm">
                      {observation.source}
                    </span>
                    <p className="mt-2 text-sm font-semibold leading-6 text-stone-600">{observation.evidence}</p>
                  </li>
                ))}
              </ul>
            </ResultSection>

            {result.alternatives.length > 0 && (
              <ResultSection title="다른 가능한 해석" icon="↗">
                <div className="space-y-2">
                  {result.alternatives.map((alternative, index) => (
                    <div key={index} className="rounded-2xl bg-violet-50/65 p-4 text-sm">
                      <p className="font-black text-violet-800">{alternative.interpretation}</p>
                      <p className="mt-1 font-medium leading-6 text-violet-700/70">{alternative.reason}</p>
                    </div>
                  ))}
                </div>
              </ResultSection>
            )}

            <section className="rounded-[24px] bg-gradient-to-br from-emerald-50 to-cyan-50 p-5">
              <div className="flex gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-lg shadow-sm">💡</span>
                <div>
                  <h3 className="text-sm font-black text-emerald-900">보호자가 해볼 수 있는 것</h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-emerald-900/70">{result.advice}</p>
                </div>
              </div>
            </section>

            {result.aiSuggestedTraits.length > 0 && selectedDogId && (
              <section className="rounded-[24px] border border-violet-100 bg-violet-50/65 p-5">
                <h3 className="font-black text-violet-950">이 강아지의 특징으로 저장할까요?</h3>
                <p className="mt-1 text-xs font-medium text-violet-700/60">사용자가 확인한 특징만 프로필에 저장합니다.</p>

                {result.aiSuggestedTraits.map((trait, index) => (
                  <div key={index} className="mt-3 flex items-start justify-between gap-3 rounded-2xl bg-white/80 p-3.5">
                    <div>
                      <p className="text-sm font-black text-stone-700">{trait.trait}</p>
                      <p className="mt-1 text-xs font-medium leading-5 text-stone-400">{trait.reason}</p>
                    </div>
                    <button
                      disabled={savedTraits.includes(trait.trait)}
                      type="button"
                      onClick={async () => {
                        if (!analysisId) return;

                        const response = await fetch("/api/dogs/" + selectedDogId + "/traits", {
                          method: "POST",
                          headers: { "content-type": "application/json" },
                          body: JSON.stringify({
                            text: trait.trait,
                            source: "AI_CONFIRMED",
                            sourceAnalysisId: analysisId,
                          }),
                        });

                        if (response.ok) {
                          setSavedTraits((values) => [...values, trait.trait]);
                        }
                      }}
                      className="shrink-0 rounded-xl bg-violet-600 px-3 py-2 text-xs font-black text-white shadow-sm transition hover:bg-violet-700 disabled:bg-violet-200"
                    >
                      {savedTraits.includes(trait.trait) ? "저장됨" : "저장"}
                    </button>
                  </div>
                ))}
              </section>
            )}

            {result.limitations.length > 0 && (
              <div className="flex gap-3 rounded-2xl border border-amber-100 bg-amber-50/80 p-4">
                <span>☀️</span>
                <p className="text-xs font-semibold leading-5 text-amber-900">{result.limitations.join(" · ")}</p>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-4">
              <p className="text-xs font-bold text-stone-400">이 해석이 실제 모습과 비슷했나요?</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => feedback("MATCH")}
                  className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-black text-emerald-700 transition hover:bg-emerald-100"
                >
                  👍 맞는 것 같아요
                </button>
                <button
                  type="button"
                  onClick={() => feedback("NOT_MATCH")}
                  className="rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-black text-stone-500 transition hover:bg-stone-50"
                >
                  🤔 아닌 것 같아요
                </button>
              </div>
            </div>
          </article>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  optional,
  children,
}: {
  label: string;
  hint?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <label className="text-xs font-black text-stone-700">
          {label}
          {optional && <span className="ml-1 font-bold text-stone-300">선택</span>}
        </label>
      </div>
      {children}
      {hint && <p className="mt-1.5 text-[11px] font-medium leading-5 text-stone-400">{hint}</p>}
    </div>
  );
}

function ResultSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[24px] border border-stone-100 bg-white/70 p-5">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-black text-stone-800">
        <span className="grid size-7 place-items-center rounded-lg bg-stone-100 text-xs text-stone-500">{icon}</span>
        {title}
      </h3>
      {children}
    </section>
  );
}

function Stat({
  icon,
  label,
  value,
  tone,
}: {
  icon: string;
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className={"rounded-[22px] p-4 " + tone}>
      <div className="flex items-center gap-2">
        <span className="text-xs opacity-70">{icon}</span>
        <p className="text-[10px] font-black uppercase tracking-wider opacity-60">{label}</p>
      </div>
      <p className="mt-2 text-base font-black">{value}</p>
    </div>
  );
}
