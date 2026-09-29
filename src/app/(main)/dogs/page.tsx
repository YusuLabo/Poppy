import { DogManager } from "@/components/DogManager";

export default function DogsPage() {
  return (
    <section className="space-y-5">
      <header className="rounded-xl bg-white px-6 py-6 shadow-sm md:px-8">
        <h1 className="text-2xl font-bold text-slate-800 md:text-3xl">내 강아지</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          강아지의 기본 정보와 평소 특징을 관리합니다.
        </p>
      </header>
      <DogManager />
    </section>
  );
}
