import { Nav } from "@/components/Nav";
import { requireUser } from "@/lib/auth/require-user";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  await requireUser();

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-4 md:px-6 md:py-6">
      <Nav />
      <div className="mt-6">{children}</div>
    </main>
  );
}
