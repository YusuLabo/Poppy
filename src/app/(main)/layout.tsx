import { Nav } from "@/components/Nav";
import { requireUser } from "@/lib/auth/require-user";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  await requireUser();
  return (
    <main className="mx-auto min-h-screen max-w-5xl p-4 md:p-8">
      <Nav />
      <div className="mt-6">{children}</div>
    </main>
  );
}
