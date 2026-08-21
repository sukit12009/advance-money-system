import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import {
  Banknote,
  FileSpreadsheet,
  FolderTree,
  LayoutDashboard,
  ReceiptText,
  Settings,
  Users,
} from "lucide-react";
import { api } from "@/services/api";
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

      <main className="min-w-0 px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
