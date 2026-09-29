import { DogManager } from "@/components/DogManager";

export default function DogsPage() {
  return (
    <section>
      <div className="mb-6">
        <span className="inline-flex rounded-full bg-violet-100 px-3 py-1.5 text-xs font-black text-violet-700">♡ MY DOGS</span>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.035em] text-stone-900 md:text-4xl">내 강아지</h1>
        <p className="mt-2 text-sm font-medium text-stone-500">평소 특징을 조금씩 알려주면 다음 분석에서 더 풍부한 맥락으로 참고할 수 있어요.</p>
      </div>
      <DogManager />
    </section>
  );
}
