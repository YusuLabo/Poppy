import Link from "next/link";

const links = [
  { href: "/", label: "홈" },
  { href: "/analyze", label: "분석" },
  { href: "/dogs", label: "내 강아지" },
  { href: "/analyses", label: "기록" },
];

export function Nav() {
  return (
    <nav className="flex flex-wrap items-center gap-4 rounded-xl bg-white px-5 py-4 shadow-sm md:px-6">
      <Link href="/" className="mr-2 flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-lg bg-[#667eea] text-sm font-bold text-white">
          P
        </span>
        <div>
          <p className="text-base font-bold leading-none text-slate-800">Poppy</p>
          <p className="mt-1 text-[11px] font-medium text-slate-400">Dog behavior analysis</p>
        </div>
      </Link>

      <div className="order-3 flex w-full gap-1 overflow-x-auto md:order-none md:w-auto md:flex-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <form action="/api/auth/logout" method="post" className="ml-auto">
        <button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
          로그아웃
        </button>
      </form>
    </nav>
  );
}
