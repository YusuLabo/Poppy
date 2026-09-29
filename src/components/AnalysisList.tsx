"use client";

import { useEffect, useState } from "react";

type Row = {
  id: string;
  createdAt: string;
  feedback: string | null;
  dog: { name: string } | null;
  result: {
    state?: { emotion?: string; desire?: string };
    dogSpeech?: string;
  };
};

const feedbackLabel: Record<string, string> = {
  MATCH: "맞음",
  NOT_MATCH: "다름",
};

const feedbackTone: Record<string, string> = {
  MATCH: "bg-emerald-100 text-emerald-700",
  NOT_MATCH: "bg-red-100 text-red-700",
};

export function AnalysisList() {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    fetch("/api/analyses")
      .then((response) => (response.ok ? response.json() : []))
      .then(setRows);
  }, []);

  if (rows.length === 0) {
    return (
      <div className="rounded-xl bg-white p-10 text-center shadow-sm">
        <p className="text-sm font-semibold text-slate-700">아직 분석 기록이 없습니다.</p>
        <p className="mt-1 text-sm text-slate-400">첫 분석을 완료하면 이곳에 기록이 표시됩니다.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
        <div>
          <h2 className="text-base font-bold text-slate-800">분석 이력</h2>
          <p className="mt-1 text-xs text-slate-500">최근 분석 결과와 사용자 피드백입니다.</p>
        </div>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          총 {rows.length}건
        </span>
      </div>

      <div className="hidden grid-cols-[1.1fr_1fr_1fr_0.9fr_1.2fr] gap-4 bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 md:grid">
        <span>강아지</span>
        <span>감정</span>
        <span>욕구</span>
        <span>피드백</span>
        <span>분석 시각</span>
      </div>

      <div className="divide-y divide-slate-200">
        {rows.map((row) => {
          const emotion = row.result?.state?.emotion ?? "분석 결과";
          const desire = row.result?.state?.desire ?? "-";
          const feedback = row.feedback ? feedbackLabel[row.feedback] ?? row.feedback : "없음";
          const tone = row.feedback ? feedbackTone[row.feedback] ?? "bg-slate-100 text-slate-600" : "bg-slate-100 text-slate-600";

          return (
            <article key={row.id} className="px-5 py-4">
              <div className="grid gap-3 md:grid-cols-[1.1fr_1fr_1fr_0.9fr_1.2fr] md:items-center md:gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {row.dog?.name ?? "등록되지 않은 강아지"}
                  </p>
                  {row.result?.dogSpeech && (
                    <p className="mt-1 line-clamp-1 text-xs text-slate-400">“{row.result.dogSpeech}”</p>
                  )}
                </div>

                <div>
                  <span className="md:hidden text-[11px] font-semibold text-slate-400">감정 · </span>
                  <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                    {emotion}
                  </span>
                </div>

                <div>
                  <span className="md:hidden text-[11px] font-semibold text-slate-400">욕구 · </span>
                  <span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-700">
                    {desire}
                  </span>
                </div>

                <div>
                  <span className="md:hidden text-[11px] font-semibold text-slate-400">피드백 · </span>
                  <span className={"rounded-full px-2.5 py-1 text-xs font-semibold " + tone}>
                    {feedback}
                  </span>
                </div>

                <p className="text-xs text-slate-500">
                  {new Date(row.createdAt).toLocaleString("ko-KR")}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
