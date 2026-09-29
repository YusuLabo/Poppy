import Link from "next/link";

const actions = [
  {
    label: "새 분석",
    value: "사진 · 영상",
    href: "/analyze",
    badge: "Analyze",
    tone: "bg-blue-100 text-blue-700",
  },
  {
    label: "내 강아지",
    value: "프로필 관리",
    href: "/dogs",
    badge: "Profiles",
    tone: "bg-emerald-100 text-emerald-700",
  },
  {
    label: "분석 기록",
    value: "이전 결과",
    href: "/analyses",
    badge: "History",
    tone: "bg-violet-100 text-violet-700",
  },
  {
    label: "입력 범위",
    value: "최대 30초",
    href: "/analyze",
    badge: "Media",
    tone: "bg-amber-100 text-amber-700",
  },
];

const flow = [
  ["1", "미디어 업로드", "사진 또는 30초 이하 영상을 선택합니다."],
  ["2", "상황 입력", "현재 상황과 등록된 강아지 정보를 함께 사용합니다."],
  ["3", "행동 분석", "관찰 가능한 신호를 바탕으로 가능한 상태를 정리합니다."],
  ["4", "결과 확인", "감정, 욕구, 근거, 다른 해석과 행동 조언을 확인합니다."],
];

export default function HomePage() {
  return (
    <section className="space-y-6">
      <header className="rounded-xl bg-white px-6 py-7 shadow-sm md:px-8 md:py-8">
        <p className="text-sm font-semibold text-[#667eea]">POPPY DASHBOARD</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-800 md:text-4xl">
          강아지 행동 분석
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          사진과 짧은 영상에서 관찰 가능한 행동 신호를 확인하고, 현재 상황과 개별 특징을 함께 참고해 가능한 감정과 욕구를 정리합니다.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="rounded-xl bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-slate-400">{action.label}</p>
                <p className="mt-3 text-xl font-bold text-slate-800">{action.value}</p>
              </div>
              <span className={"rounded-full px-2.5 py-1 text-[11px] font-semibold " + action.tone}>
                {action.badge}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-800">분석 흐름</h2>
            <p className="mt-1 text-sm text-slate-500">Poppy가 결과를 만드는 기본 순서입니다.</p>
          </div>
          <Link
            href="/analyze"
            className="rounded-lg bg-[#6377e8] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5568d7]"
          >
            분석 시작
          </Link>
        </div>

        <div className="divide-y divide-slate-200">
          {flow.map(([step, title, description]) => (
            <div key={step} className="grid gap-3 px-6 py-5 md:grid-cols-[56px_180px_1fr] md:items-center">
              <span className="grid size-9 place-items-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                {step}
              </span>
              <p className="font-semibold text-slate-800">{title}</p>
              <p className="text-sm leading-6 text-slate-500">{description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-white/25 bg-white/95 px-5 py-4 text-sm leading-6 text-slate-600 shadow-sm">
        이 서비스는 강아지의 실제 생각을 읽거나 의료 진단을 하는 도구가 아닙니다. 관찰 가능한 행동과 상황을 바탕으로 가능한 해석을 제시합니다.
      </div>
    </section>
  );
}
