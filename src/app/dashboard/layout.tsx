import { logoutAdmin } from "@/actions/auth";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-secondary/20">
      <header className="bg-background border-b border-border h-16 flex items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-8">
          <div className="font-medium tracking-tight text-lg">Admin Command Center</div>
          <nav className="hidden md:flex gap-6">
            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Appointments
            </Link>
            <Link href="/dashboard/schedule" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Schedule Management
            </Link>
          </nav>
        </div>
        <form action={logoutAdmin}>
          <button 
            type="submit"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign Out
          </button>
        </form>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}