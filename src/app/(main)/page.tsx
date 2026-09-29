import Link from "next/link";

export default function HomePage() {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-neutral-500">Dog Mind prototype</p>
        <h1 className="mt-2 text-4xl font-bold">강아지가 지금 원하는 게 뭘까?</h1>
        <p className="mt-4 max-w-2xl text-neutral-600">사진이나 30초 이하 영상을 올리면 현재 행동, 상황, 저장된 개별 특징과 견종 보조 정보를 함께 보고 가능한 감정과 욕구를 추정합니다.</p>
        <div className="mt-6 flex gap-3">
          <Link href="/analyze" className="rounded-2xl bg-black px-5 py-3 text-white">분석 시작</Link>
          <Link href="/dogs" className="rounded-2xl border px-5 py-3">강아지 등록</Link>
        </div>
      </div>
      <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">이 서비스는 강아지의 실제 생각을 읽거나 의료 진단을 하는 도구가 아닙니다. 관찰 가능한 행동과 상황을 바탕으로 가능한 해석을 제시합니다.</p>
    </section>
  );
}
