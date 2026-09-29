import Link from "next/link";

const links = [
  { href: "/", label: "홈", icon: "⌂" },
  { href: "/analyze", label: "분석", icon: "✦" },
  { href: "/dogs", label: "내 강아지", icon: "♡" },
  { href: "/analyses", label: "기록", icon: "◷" },
];

export function Nav() {
  return (
    <nav className="sticky top-4 z-30 flex flex-wrap items-center gap-2 rounded-[28px] border border-white/90 bg-white/75 p-2.5 shadow-[0_16px_50px_rgba(86,63,52,0.10)] backdrop-blur-xl">
      <Link href="/" className="flex items-center gap-2 rounded-2xl px-2 py-1.5 transition hover:bg-orange-50">
        <span className="grid size-10 place-items-center rounded-2xl bg-linear-to-br from-orange-400 to-rose-500 text-xl text-white shadow-[0_8px_20px_rgba(244,104,81,0.28)]">
          🐾
        </span>
        <span className="hidden sm:block">
          <span className="block text-sm font-black tracking-tight text-stone-800">Poppy</span>
          <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400">dog mind</span>
        </span>
      </Link>

      <div className="order-3 flex w-full items-center gap-1 overflow-x-auto pt-1 sm:order-none sm:w-auto sm:flex-1 sm:justify-center sm:pt-0">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex shrink-0 items-center gap-1.5 rounded-2xl px-3 py-2 text-sm font-bold text-stone-600 transition hover:bg-orange-50 hover:text-orange-600"
          >
            <span className="text-base text-stone-400">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </div>

      <form action="/api/auth/logout" method="post" className="ml-auto sm:ml-0">
        <button className="rounded-2xl border border-stone-200/80 bg-white/80 px-3 py-2 text-sm font-bold text-stone-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600">
          로그아웃
        </button>
      </form>
    </nav>
  );
}
