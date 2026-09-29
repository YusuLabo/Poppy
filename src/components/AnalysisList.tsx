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
  MATCH: "👍 잘 맞았어요",
  NOT_MATCH: "🤔 달랐어요",
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
      <div className="flex min-h-[380px] flex-col items-center justify-center rounded-[32px] border border-white/90 bg-white/70 p-8 text-center shadow-[0_18px_55px_rgba(86,63,52,0.08)] backdrop-blur-xl">
        <div className="grid size-20 place-items-center rounded-[28px] bg-gradient-to-br from-emerald-100 to-cyan-100 text-4xl">
          📚
        </div>
        <h2 className="mt-5 text-xl font-black text-stone-800">아직 분석 기록이 없어요</h2>
        <p className="mt-2 max-w-sm text-sm font-medium leading-6 text-stone-400">
          첫 사진이나 영상을 분석하면 강아지의 상태와 한마디가 여기에 차곡차곡 쌓입니다.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {rows.map((row) => {
        const emotion = row.result?.state?.emotion ?? "분석 결과";
        const desire = row.result?.state?.desire;
        const feedback = row.feedback ? feedbackLabel[row.feedback] ?? row.feedback : "피드백 없음";

        return (
          <article
            key={row.id}
            className="group overflow-hidden rounded-[30px] border border-white/90 bg-white/80 shadow-[0_16px_48px_rgba(86,63,52,0.08)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-[0_20px_55px_rgba(86,63,52,0.12)]"
          >
            <div className="flex items-center justify-between gap-3 border-b border-stone-100 bg-gradient-to-r from-emerald-50/80 via-white to-violet-50/70 px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-2xl bg-white text-xl shadow-sm">🐶</span>
                <div>
                  <p className="text-sm font-black text-stone-800">{row.dog?.name ?? "등록되지 않은 강아지"}</p>
                  <p className="mt-0.5 text-[10px] font-bold text-stone-400">
                    {new Date(row.createdAt).toLocaleString("ko-KR")}
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-stone-400 shadow-sm">
                {feedback}
              </span>
            </div>

            <div className="p-5">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-black text-orange-700">
                  {emotion}
                </span>
                {desire && (
                  <span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-black text-violet-700">
                    {desire}
                  </span>
                )}
              </div>

              <blockquote className="mt-4 text-lg font-black leading-7 tracking-tight text-stone-800">
                {row.result?.dogSpeech ? "“" + row.result.dogSpeech + "”" : "분석 내용을 확인해보세요."}
              </blockquote>

              <div className="mt-5 flex items-center gap-2 text-xs font-black text-stone-300 transition group-hover:text-orange-500">
                <span>분석 기록</span>
                <span>→</span>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
