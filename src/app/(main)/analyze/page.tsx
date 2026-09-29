import { AnalyzeForm } from "@/components/AnalyzeForm";

export default function AnalyzePage() {
  return (
    <section>
      <div className="mb-6">
        <span className="inline-flex rounded-full bg-orange-100 px-3 py-1.5 text-xs font-black text-orange-700">✦ AI ANALYSIS</span>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.035em] text-stone-900 md:text-4xl">강아지 행동 분석</h1>
        <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-stone-500">
          등록된 강아지를 선택하면 저장된 개별 특징이 함께 반영됩니다. 등록되지 않은 강아지는 견종을 추정하지 않습니다.
        </p>
      </div>
      <AnalyzeForm />
    </section>
  );
}
