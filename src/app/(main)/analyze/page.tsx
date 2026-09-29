import { AnalyzeForm } from "@/components/AnalyzeForm";

export default function AnalyzePage() {
  return (
    <section className="space-y-5">
      <header className="rounded-xl bg-white px-6 py-6 shadow-sm md:px-8">
        <h1 className="text-2xl font-bold text-slate-800 md:text-3xl">강아지 분석</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          등록된 강아지는 저장된 개별 특징을 함께 참고합니다. 등록되지 않은 강아지는 견종을 추정하지 않습니다.
        </p>
      </header>
      <AnalyzeForm />
    </section>
  );
}
