import { AnalysisList } from "@/components/AnalysisList";

export default function AnalysesPage() {
  return (
    <section className="space-y-5">
      <header className="rounded-xl bg-white px-6 py-6 shadow-sm md:px-8">
        <h1 className="text-2xl font-bold text-slate-800 md:text-3xl">분석 기록</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          지금까지 저장된 분석 결과와 피드백을 확인합니다.
        </p>
      </header>
      <AnalysisList />
    </section>
  );
}
