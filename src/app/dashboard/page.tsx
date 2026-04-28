import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import DashboardContent from "@/components/DashboardContent";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen">
      <Navbar userName={session.user.name} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardContent />
      </main>
    </div>
  );
}
