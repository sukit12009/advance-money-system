import { ArrowDownRight, ArrowUpRight, BarChart3, CheckCircle2, CircleDollarSign, Plus, Receipt, WalletCards, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingBlock } from "@/components/common/LoadingBlock";
import { PageHeader } from "@/components/common/PageHeader";
import { useTransactions } from "@/hooks/useTransactions";
import { formatCurrency } from "@/utils/currency";
import { summarizeTransactions } from "@/utils/balance";

export function DashboardPage() {
  const { data = [], isLoading, error } = useTransactions();
  const summary = summarizeTransactions(data);
  const expenses = data.filter((item) => item.type === "expense");
  const pending = data.filter((item) => !item.received);
  const categoryTotals = expenses.reduce<Record<string, number>>((totals, item) => {
    const key = item.categoryName ?? item.categoryId;
    totals[key] = (totals[key] ?? 0) + item.amount;
    return totals;
  }, {});
  const topCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topCategoryAmount = topCategories[0]?.[1] ?? 1;
  const incomeRate = summary.totalIncome + summary.totalExpense > 0
    ? Math.round((summary.totalIncome / (summary.totalIncome + summary.totalExpense)) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="ภาพรวมการเงินจากข้อมูลรายการทั้งหมด"
        actions={<Link className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-teal-800" to="/transactions"><Plus className="h-4 w-4" /> เพิ่มรายการ</Link>}
      />

      {isLoading ? <LoadingBlock /> : null}
      {error ? <EmptyState title="ไม่สามารถโหลดข้อมูลได้" description={error instanceof Error ? error.message : "กรุณาลองใหม่อีกครั้ง"} /> : null}

      {!isLoading && !error ? (
        <>
          <section className="grid gap-4 md:grid-cols-3">
            <InsightCard label="ยอดคงเหลือ" value={formatCurrency(summary.currentBalance)} icon={WalletCards} tone="teal" detail={summary.currentBalance >= 0 ? "สถานะยอดคงเหลือเป็นบวก" : "ควรตรวจสอบรายจ่าย"} />
            <InsightCard label="รายรับทั้งหมด" value={formatCurrency(summary.totalIncome)} icon={ArrowUpRight} tone="emerald" detail={`${incomeRate}% ของเงินหมุนเวียนทั้งหมด`} />
            <InsightCard label="รายจ่ายทั้งหมด" value={formatCurrency(summary.totalExpense)} icon={ArrowDownRight} tone="rose" detail={`${expenses.length.toLocaleString("th-TH")} รายการรายจ่าย`} />
          </section>

          <section className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
            <div className="rounded-lg border border-border bg-white p-4 shadow-sm">
              <div className="mb-5 flex items-start justify-between">
                <div><p className="text-sm text-muted-foreground">วิเคราะห์รายจ่าย</p><h3 className="mt-1 text-lg font-semibold text-slate-950">รายจ่ายตามหมวดหมู่</h3></div>
                <BarChart3 className="h-5 w-5 text-teal-700" />
              </div>
              {topCategories.length === 0 ? <p className="text-sm text-muted-foreground">ยังไม่มีข้อมูลรายจ่าย</p> : <div className="space-y-4">{topCategories.map(([name, amount]) => <div key={name}><div className="mb-1 flex justify-between text-sm"><span className="font-medium text-slate-700">{name}</span><span className="text-slate-500">{formatCurrency(amount)}</span></div><div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-teal-600" style={{ width: `${Math.max(8, (amount / topCategoryAmount) * 100)}%` }} /></div></div>)}</div>}
              <Link to="/transactions" className="mt-5 inline-flex text-sm font-medium text-teal-700 hover:text-teal-900">ดูรายละเอียดรายการทั้งหมด →</Link>
            </div>

            <div className="rounded-lg border border-border bg-white p-4 shadow-sm">
              <div className="mb-5 flex items-start justify-between"><div><p className="text-sm text-muted-foreground">สถานะการบันทึก</p><h3 className="mt-1 text-lg font-semibold text-slate-950">สิ่งที่ควรติดตาม</h3></div><CircleDollarSign className="h-5 w-5 text-amber-600" /></div>
              <div className="space-y-3">
                <StatusRow icon={Receipt} label="รายการทั้งหมด" value={`${summary.transactionCount.toLocaleString("th-TH")} รายการ`} />
                <StatusRow icon={CheckCircle2} label="รับเงินแล้ว" value={`${data.filter((item) => item.received).length.toLocaleString("th-TH")} รายการ`} tone="text-emerald-700" />
                <StatusRow icon={CircleDollarSign} label="รอติดตาม" value={`${pending.length.toLocaleString("th-TH")} รายการ`} tone={pending.length ? "text-amber-700" : "text-emerald-700"} />
              </div>
              <Link to="/transactions" className="mt-5 flex h-10 items-center justify-center rounded-lg border border-teal-200 text-sm font-medium text-teal-800 hover:bg-teal-50">ไปที่รายการธุรกรรม</Link>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}

function InsightCard({ label, value, detail, icon: Icon, tone }: { label: string; value: string; detail: string; icon: LucideIcon; tone: "teal" | "emerald" | "rose" }) {
  const styles = { teal: "bg-teal-50 text-teal-700", emerald: "bg-emerald-50 text-emerald-700", rose: "bg-rose-50 text-rose-700" };
  return <div className="rounded-lg border border-border bg-white p-4 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p></div><span className={`rounded-md p-2 ${styles[tone]}`}><Icon className="h-5 w-5" /></span></div><p className="mt-4 text-xs text-muted-foreground">{detail}</p></div>;
}

function StatusRow({ icon: Icon, label, value, tone = "text-slate-700" }: { icon: LucideIcon; label: string; value: string; tone?: string }) {
  return <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-3"><span className="flex items-center gap-2 text-sm text-slate-600"><Icon className={`h-4 w-4 ${tone}`} />{label}</span><span className="text-sm font-semibold text-slate-900">{value}</span></div>;
}
