import { ArrowDownCircle, ArrowUpCircle, Calculator, Rows3 } from "lucide-react";
import type { TransactionSummary } from "@/types/transaction";
import { formatCurrency } from "@/utils/currency";

const cardClass = "rounded-lg border border-border bg-white p-4 shadow-sm";

export function SummaryCards({ summary }: { summary: TransactionSummary }) {
  const items = [
    {
      label: "รายรับทั้งหมด",
      value: formatCurrency(summary.totalIncome),
      icon: ArrowUpCircle,
      tone: "text-emerald-700",
    },
    {
      label: "รายจ่ายทั้งหมด",
      value: formatCurrency(summary.totalExpense),
      icon: ArrowDownCircle,
      tone: "text-rose-700",
    },
    {
      label: "ยอดคงเหลือ",
      value: formatCurrency(summary.currentBalance),
      icon: Calculator,
      tone: "text-teal-700",
    },
    {
      label: "จำนวนรายการ",
      value: summary.transactionCount.toLocaleString("th-TH"),
      icon: Rows3,
      tone: "text-sky-700",
    },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className={cardClass}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {item.value}
              </p>
            </div>
            <item.icon className={`h-8 w-8 ${item.tone}`} />
          </div>
        </div>
      ))}
    </div>
  );
}
