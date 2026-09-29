import Link from "next/link";

export function Nav() {
  return (
    <nav className="flex flex-wrap gap-2 rounded-2xl bg-white p-3 shadow-sm">
      <Link className="rounded-xl px-3 py-2 hover:bg-neutral-100" href="/">홈</Link>
      <Link className="rounded-xl px-3 py-2 hover:bg-neutral-100" href="/analyze">분석</Link>
      <Link className="rounded-xl px-3 py-2 hover:bg-neutral-100" href="/dogs">내 강아지</Link>
      <Link className="rounded-xl px-3 py-2 hover:bg-neutral-100" href="/analyses">기록</Link>
      <form action="/api/auth/logout" method="post" className="ml-auto">
        <button className="rounded-xl px-3 py-2 hover:bg-neutral-100">로그아웃</button>
      </form>
    </nav>
  );
}
