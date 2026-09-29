import { AnalyzeForm } from "@/components/AnalyzeForm";
export default function AnalyzePage() { return <section><h1 className="mb-2 text-3xl font-bold">강아지 분석</h1><p className="mb-5 text-neutral-600">등록된 강아지를 선택하면 저장된 개별 특징이 함께 반영됩니다. 등록되지 않은 강아지는 견종을 추정하지 않습니다.</p><AnalyzeForm /></section>; }
