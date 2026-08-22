import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import {
  Banknote,
  FileSpreadsheet,
  FolderTree,
  LogOut,
  LayoutDashboard,
  ReceiptText,
  Settings,
  Users,
} from "lucide-react";
import { api } from "@/services/api";
import { useCurrentUser } from "@/hooks/useAdminData";
import { LoginPage } from "@/pages/LoginPage";
import { cn } from "@/utils/cn";

const navigation = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "รายการทั้งหมด", icon: FileSpreadsheet },
  { to: "/categories", label: "หมวดหมู่", icon: FolderTree },
  { to: "/payment-types", label: "ประเภทเอกสาร", icon: ReceiptText },
  { to: "/users", label: "ผู้ใช้งาน", icon: Users },
  { to: "/settings", label: "ตั้งค่า", icon: Settings },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const { data: currentUser, isLoading, error } = useCurrentUser();
  if (isLoading) return null;
  if (error || !currentUser) {
    return <LoginPage message={error instanceof Error ? error.message : undefined} />;
  }
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="border-b border-border bg-white lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3 px-5 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-teal-700 text-white">
            <Banknote className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Expense Manager</p>
            <h1 className="text-base font-semibold text-slate-950">
              ระบบรายรับรายจ่าย
            </h1>
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-3 pb-4 lg:block lg:space-y-1 lg:overflow-visible">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex shrink-0 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100",
                  isActive && "bg-teal-50 text-teal-800",
                )
              }
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="hidden px-5 pb-5 lg:block">
          <div className="rounded-lg border border-border bg-slate-50 p-3 text-sm text-muted-foreground">
            โหมดข้อมูล:{" "}
            <span className="font-medium text-slate-800">
              {api.mode === "remote" ? "Google Apps Script" : "Demo local"}
            </span>
          </div>
        </div>
      </aside>

      <main className="min-w-0 px-4 pb-5 pt-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-end gap-2 border-b border-border bg-white px-4 shadow-sm sm:gap-3 sm:px-6 lg:left-[260px] lg:px-8">
            <div className="min-w-0 text-right">
              <p className="text-sm font-medium text-slate-900">{currentUser.name}</p>
              <p className="max-w-[180px] truncate text-xs text-muted-foreground sm:max-w-none">{currentUser.email}</p>
              <p className="text-xs text-teal-700">สิทธิ์: {currentUser.role}</p>
            </div>
            <button
              type="button"
              className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              onClick={() => {
                window.localStorage.removeItem("fern-auth-token");
                window.location.reload();
              }}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </header>
          {children}
        </div>
      </main>
    </div>
  );
}
