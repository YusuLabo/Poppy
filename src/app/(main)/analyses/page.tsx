import { AnalysisList } from "@/components/AnalysisList";

export default function AnalysesPage() {
  return (
    <section>
      <div className="mb-6">
        <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-black text-emerald-700">◷ HISTORY</span>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.035em] text-stone-900 md:text-4xl">분석 기록</h1>
        <p className="mt-2 text-sm font-medium text-stone-500">지금까지 살펴본 강아지의 상태와 한마디를 시간순으로 모아봤어요.</p>
      </div>
      <AnalysisList />
    </section>
  );
}
