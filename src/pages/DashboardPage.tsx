import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingBlock } from "@/components/common/LoadingBlock";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { Badge } from "@/components/ui/Badge";
import { useTransactions } from "@/hooks/useTransactions";
import { TRANSACTION_TYPE_LABEL } from "@/types/transaction";
import { summarizeTransactions } from "@/utils/balance";
import { formatCurrency } from "@/utils/currency";
import { formatDisplayDate } from "@/utils/date";

export function DashboardPage() {
  const { data = [], isLoading, error } = useTransactions();
  const summary = summarizeTransactions(data);
  const recent = [...data].slice(-6).reverse();

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">ภาพรวมจากข้อมูลรายการจริง</p>
          <h2 className="text-2xl font-semibold text-slate-950">Dashboard</h2>
        </div>
        <Link
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-teal-800"
          to="/transactions"
        >
          <Plus className="h-4 w-4" />
          เพิ่มรายการ
        </Link>
      </div>

      {isLoading ? <LoadingBlock /> : null}

      {error ? (
        <EmptyState
          title="ไม่สามารถโหลดข้อมูลได้"
          description={error instanceof Error ? error.message : "กรุณาลองใหม่อีกครั้ง"}
        />
      ) : null}

      {!isLoading && !error ? (
        <>
          <SummaryCards summary={summary} />
          <section className="rounded-lg border border-border bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <h3 className="font-semibold text-slate-950">รายการล่าสุด</h3>
                <p className="text-sm text-muted-foreground">
                  แสดงรายการล่าสุดจาก running balance ที่คำนวณแล้ว
                </p>
              </div>
              <Link className="text-sm font-medium text-teal-700" to="/transactions">
                ดูทั้งหมด
              </Link>
            </div>

            {recent.length === 0 ? (
              <div className="p-4">
                <EmptyState title="ยังไม่มีรายการ" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-[760px] w-full border-collapse text-sm">
                  <thead className="bg-slate-50 text-left text-slate-600">
                    <tr>
                      <th className="px-4 py-3 font-medium">วันที่</th>
                      <th className="px-4 py-3 font-medium">ประเภท</th>
                      <th className="px-4 py-3 font-medium">รายการ</th>
                      <th className="px-4 py-3 text-right font-medium">จำนวนเงิน</th>
                      <th className="px-4 py-3 text-right font-medium">คงเหลือ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((transaction) => (
                      <tr key={transaction.id} className="border-t border-border">
                        <td className="px-4 py-3">
                          {formatDisplayDate(transaction.date)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            tone={
                              transaction.type === "income" ? "income" : "expense"
                            }
                          >
                            {TRANSACTION_TYPE_LABEL[transaction.type]}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900">
                            {transaction.description}
                          </div>
                          <div className="text-muted-foreground">
                            {transaction.categoryName ?? transaction.categoryId}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-medium">
                          {formatCurrency(transaction.amount)}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-teal-800">
                          {formatCurrency(transaction.balance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      ) : null}
    </div>
  );
}
