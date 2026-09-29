import { Nav } from "@/components/Nav";
import { requireUser } from "@/lib/auth/require-user";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  await requireUser();

  return (
    <main className="relative mx-auto min-h-screen max-w-6xl px-4 pb-16 pt-4 md:px-8 md:pt-7">
      <Nav />
      <div className="mt-7 md:mt-9">{children}</div>
    </main>
  );
}
