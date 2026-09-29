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
  LOW: "bg-slate-100 text-slate-600",
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
    <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
      <form onSubmit={submit} className="h-fit rounded-xl bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-bold text-slate-800">분석 입력</h2>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            대상, 상황, 미디어를 입력하세요.
          </p>
        </div>

        <div className="space-y-4 p-5">
          <Field label="분석 대상" hint="등록된 강아지를 선택하면 개별 특징을 함께 참고합니다.">
            <select
              name="dogId"
              value={selectedDogId}
              onChange={(e) => setSelectedDogId(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm"
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
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm"
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
              rows={4}
              placeholder="상황을 짧게 설명해주세요."
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm leading-6"
            />
          </Field>

          <Field label="사진 또는 영상" hint="영상은 최대 30초까지 사용할 수 있습니다.">
            <input
              required
              name="media"
              type="file"
              accept="image/*,video/*"
              className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-xs text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-[#6377e8] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white"
            />
          </Field>

          {error && (
            <p className="rounded-lg bg-red-50 px-3.5 py-3 text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          <button
            disabled={loading}
            className="w-full rounded-lg bg-[#6377e8] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#5568d7] disabled:opacity-50"
          >
            {loading ? "분석 중..." : "분석하기"}
          </button>
        </div>
      </form>

      {!result ? (
        <div className="min-h-[460px] rounded-xl bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-base font-bold text-slate-800">분석 결과</h2>
            <p className="mt-1 text-xs text-slate-500">결과가 이 영역에 표시됩니다.</p>
          </div>
          <div className="flex min-h-[380px] items-center justify-center p-8 text-center">
            <div>
              <div className="mx-auto grid size-12 place-items-center rounded-lg bg-slate-100 text-lg font-bold text-slate-400">
                AI
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-700">아직 분석 결과가 없습니다.</p>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                왼쪽에서 입력을 완료한 뒤 분석을 시작하세요.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <article className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 px-5 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Dog speech</p>
              <h2 className="mt-1 text-xl font-bold text-slate-800">“{result.dogSpeech}”</h2>
            </div>
            <span className={"rounded-full px-3 py-1 text-xs font-semibold " + confidenceTone[result.confidence]}>
              확신 {confidenceLabel[result.confidence]}
            </span>
          </div>

          <div className="grid gap-4 border-b border-slate-200 p-5 sm:grid-cols-2">
            <Stat label="감정" value={result.state.emotion} />
            <Stat label="욕구" value={result.state.desire} />
          </div>

          <div className="divide-y divide-slate-200">
            <ResultSection title="해석">
              <p className="text-sm leading-7 text-slate-600">{result.interpretation}</p>
            </ResultSection>

            <ResultSection title="판단 근거">
              <div className="space-y-3">
                {result.observations.map((observation, index) => (
                  <div key={index} className="rounded-lg border border-slate-200 p-4">
                    <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                      {observation.source}
                    </span>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{observation.evidence}</p>
                  </div>
                ))}
              </div>
            </ResultSection>

            {result.alternatives.length > 0 && (
              <ResultSection title="다른 가능한 해석">
                <div className="space-y-3">
                  {result.alternatives.map((alternative, index) => (
                    <div key={index} className="rounded-lg bg-violet-50 p-4">
                      <p className="text-sm font-semibold text-violet-800">{alternative.interpretation}</p>
                      <p className="mt-1 text-sm leading-6 text-violet-700/80">{alternative.reason}</p>
                    </div>
                  ))}
                </div>
              </ResultSection>
            )}

            <ResultSection title="보호자가 해볼 수 있는 것">
              <p className="text-sm leading-7 text-slate-600">{result.advice}</p>
            </ResultSection>

            {result.aiSuggestedTraits.length > 0 && selectedDogId && (
              <ResultSection title="저장할 수 있는 특징">
                <div className="space-y-2">
                  {result.aiSuggestedTraits.map((trait, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 p-3.5"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-700">{trait.trait}</p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">{trait.reason}</p>
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
                        className="shrink-0 rounded-md bg-[#6377e8] px-3 py-2 text-xs font-semibold text-white disabled:bg-slate-300"
                      >
                        {savedTraits.includes(trait.trait) ? "저장됨" : "저장"}
                      </button>
                    </div>
                  ))}
                </div>
              </ResultSection>
            )}

            {result.limitations.length > 0 && (
              <ResultSection title="주의사항">
                <p className="rounded-lg bg-amber-50 px-3.5 py-3 text-sm leading-6 text-amber-800">
                  {result.limitations.join(" · ")}
                </p>
              </ResultSection>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 px-5 py-4">
            <p className="text-xs font-medium text-slate-500">이 해석이 실제 모습과 비슷했나요?</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => feedback("MATCH")}
                className="rounded-md bg-emerald-500 px-3 py-2 text-xs font-semibold text-white"
              >
                맞는 것 같아요
              </button>
              <button
                type="button"
                onClick={() => feedback("NOT_MATCH")}
                className="rounded-md bg-slate-500 px-3 py-2 text-xs font-semibold text-white"
              >
                아닌 것 같아요
              </button>
            </div>
          </div>
        </article>
      )}
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
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
        {optional && <span className="ml-1 font-normal text-slate-400">(선택)</span>}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs leading-5 text-slate-400">{hint}</p>}
    </div>
  );
}

function ResultSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="p-5">
      <h3 className="mb-3 text-sm font-bold text-slate-800">{title}</h3>
      {children}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <p className="text-xs font-semibold text-slate-400">{label}</p>
      <p className="mt-2 text-lg font-bold text-slate-800">{value}</p>
    </div>
  );
}
