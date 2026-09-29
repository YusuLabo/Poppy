import Link from "next/link";

const features = [
  {
    icon: "👀",
    title: "행동 신호 관찰",
    text: "귀, 눈, 입, 꼬리, 자세와 움직임을 함께 살펴봐요.",
    tone: "from-orange-50 to-amber-50",
  },
  {
    icon: "🧠",
    title: "맥락까지 함께",
    text: "현재 상황과 저장된 개별 특징을 같이 반영해 해석해요.",
    tone: "from-violet-50 to-fuchsia-50",
  },
  {
    icon: "💡",
    title: "바로 할 수 있는 조언",
    text: "가능한 감정과 욕구뿐 아니라 보호자가 해볼 행동도 알려줘요.",
    tone: "from-emerald-50 to-cyan-50",
  },
];

export default function HomePage() {
  return (
    <section className="space-y-6">
      <div className="relative overflow-hidden rounded-[42px] border border-white/90 bg-white/75 p-7 shadow-[0_28px_80px_rgba(87,65,54,0.12)] backdrop-blur-xl md:p-11 lg:p-12">
        <div className="pointer-events-none absolute -right-24 -top-28 size-80 rounded-full bg-violet-200/45 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-36 -left-24 size-80 rounded-full bg-orange-200/55 blur-3xl" />

        <div className="relative grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/70 bg-orange-50/80 px-3.5 py-2 text-xs font-black tracking-wide text-orange-700">
              <span>✦</span>
              AI와 함께 보는 반려견 행동
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.12] tracking-[-0.04em] text-stone-900 sm:text-5xl lg:text-[3.65rem]">
              말은 못 해도,
              <br />
              <span className="bg-linear-to-r from-orange-500 via-rose-500 to-violet-600 bg-clip-text text-transparent">
                표정은 말하고 있어요.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-[15px] font-medium leading-7 text-stone-600 sm:text-base">
              사진이나 30초 이하 영상을 올려주세요. Poppy가 관찰 가능한 행동, 현재 상황,
              저장된 개별 특징을 함께 보고 가능한 감정과 욕구를 이해하기 쉽게 정리해드려요.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/analyze"
                className="group inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-orange-500 to-rose-500 px-5 py-3.5 text-sm font-black text-white shadow-[0_12px_28px_rgba(244,103,81,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(244,103,81,0.34)]"
              >
                분석 시작하기
                <span className="transition group-hover:translate-x-0.5">→</span>
              </Link>
              <Link
                href="/dogs"
                className="inline-flex items-center gap-2 rounded-2xl border border-stone-200 bg-white/80 px-5 py-3.5 text-sm font-black text-stone-700 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50"
              >
                🐶 내 강아지 등록
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-stone-400">
              <span>✓ 사진 · 짧은 영상</span>
              <span>✓ 개별 특징 반영</span>
              <span>✓ 쉬운 행동 조언</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="poppy-float relative rounded-[36px] border border-white bg-linear-to-br from-[#fff7ef] via-white to-[#f4efff] p-5 shadow-[0_28px_70px_rgba(87,65,54,0.16)]">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-black text-stone-500 shadow-sm">
                  TODAY&apos;S SIGNAL
                </span>
                <span className="text-sm text-stone-300">•••</span>
              </div>

              <div className="mt-7 flex items-center gap-4">
                <div className="grid size-20 shrink-0 place-items-center rounded-[28px] bg-linear-to-br from-orange-100 to-rose-100 text-5xl shadow-inner">
                  🐕
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-400">강아지의 한마디</p>
                  <p className="mt-1 text-xl font-black tracking-tight text-stone-800">
                    “지금 같이 놀고 싶어요!”
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2">
                {[
                  ["감정", "신남", "bg-orange-50 text-orange-700"],
                  ["욕구", "놀이", "bg-violet-50 text-violet-700"],
                  ["확신", "높음", "bg-emerald-50 text-emerald-700"],
                ].map(([label, value, tone]) => (
                  <div key={label} className={"rounded-2xl p-3.5 " + tone}>
                    <p className="text-[10px] font-bold opacity-60">{label}</p>
                    <p className="mt-1 text-sm font-black">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-stone-100 bg-white/80 p-4">
                <p className="text-xs font-black text-stone-500">관찰 포인트</p>
                <p className="mt-2 text-sm font-medium leading-6 text-stone-600">
                  몸이 앞쪽으로 기울어 있고 꼬리 움직임이 활발해요. 현재 상황에서는 긍정적인
                  흥분 신호로 볼 가능성이 있어요.
                </p>
              </div>
            </div>

            <div className="absolute -bottom-3 -left-4 rounded-2xl bg-stone-900 px-4 py-3 text-xs font-bold text-white shadow-xl">
              관찰 → 해석 → 행동 팁 ✨
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.title}
            className={"rounded-[28px] border border-white/80 bg-linear-to-br " + feature.tone + " p-5 shadow-[0_14px_40px_rgba(86,63,52,0.07)]"}
          >
            <div className="grid size-11 place-items-center rounded-2xl bg-white text-xl shadow-sm">{feature.icon}</div>
            <h2 className="mt-4 text-base font-black text-stone-800">{feature.title}</h2>
            <p className="mt-2 text-sm font-medium leading-6 text-stone-500">{feature.text}</p>
          </article>
        ))}
      </div>

      <div className="flex gap-3 rounded-[26px] border border-amber-200/70 bg-amber-50/85 p-4 text-sm leading-6 text-amber-950 shadow-sm">
        <span className="text-lg">☀️</span>
        <p>
          Poppy는 강아지의 실제 생각을 읽거나 의료 진단을 하는 도구가 아닙니다.
          관찰 가능한 행동과 상황을 바탕으로 <strong>가능한 해석</strong>을 제시합니다.
        </p>
      </div>
    </section>
  );
}
