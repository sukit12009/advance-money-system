import { useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Edit, Eye, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { TransactionRecord } from "@/types/transaction";
import { TRANSACTION_TYPE_LABEL } from "@/types/transaction";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/currency";
import { formatDisplayDate } from "@/utils/date";

type SortKey = "date" | "amount" | "balance";
type SortDirection = "asc" | "desc";

interface TransactionTableProps {
  transactions: TransactionRecord[];
  loading?: boolean;
  onEdit: (transaction: TransactionRecord) => void;
  onView: (transaction: TransactionRecord) => void;
  onDelete: (transaction: TransactionRecord) => void;
}

const pageSize = 10;

export function TransactionTable({
  transactions,
  loading,
  onEdit,
  onView,
  onDelete,
}: TransactionTableProps) {
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const sorted = useMemo(() => {
    return [...transactions].sort((a, b) => {
      const modifier = sortDirection === "asc" ? 1 : -1;
      if (sortKey === "date") {
        return a.date.localeCompare(b.date) * modifier;
      }
      return (a[sortKey] - b[sortKey]) * modifier;
    });
  }, [sortDirection, sortKey, transactions]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const visibleRows = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDirection("asc");
  }

  if (!loading && transactions.length === 0) {
    return (
      <EmptyState
        title="ไม่พบรายการ"
        description="ลองปรับคำค้นหาหรือตัวกรอง หรือเพิ่มรายการใหม่"
      />
    );
  }

  return (
    <section className="rounded-lg border border-border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[1180px] w-full border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-slate-50 text-left text-slate-600">
            <tr>
              <SortableHeader label="วันที่" active={sortKey === "date"} onClick={() => toggleSort("date")} />
              <th className="px-3 py-3 font-medium">ประเภท</th>
              <th className="px-3 py-3 font-medium">วันที่ดำเนินการ</th>
              <th className="px-3 py-3 font-medium">รายการ</th>
              <th className="px-3 py-3 font-medium">หมวดหมู่</th>
              <SortableHeader label="จำนวนเงิน" align="right" active={sortKey === "amount"} onClick={() => toggleSort("amount")} />
              <SortableHeader label="คงเหลือ" align="right" active={sortKey === "balance"} onClick={() => toggleSort("balance")} />
              <th className="px-3 py-3 font-medium">ประเภทเอกสาร</th>
              <th className="px-3 py-3 text-center font-medium">รับเงิน</th>
              <th className="px-3 py-3 font-medium">หมายเหตุ</th>
              <th className="px-3 py-3 text-right font-medium">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <tr key={index} className="border-t border-border">
                    <td colSpan={11} className="px-3 py-3">
                      <div className="h-7 animate-pulse rounded bg-slate-100" />
                    </td>
                  </tr>
                ))
              : visibleRows.map((transaction) => (
                  <tr key={transaction.id} className="border-t border-border hover:bg-slate-50">
                    <td className="px-3 py-3">{formatDisplayDate(transaction.date)}</td>
                    <td className="px-3 py-3">
                      <Badge tone={transaction.type === "income" ? "income" : "expense"}>
                        {TRANSACTION_TYPE_LABEL[transaction.type]}
                      </Badge>
                    </td>
                    <td className="px-3 py-3">
                      {transaction.operationDateStart ?? transaction.operationDate ?? "-"}
                      {transaction.operationDateEnd && transaction.operationDateEnd !== transaction.operationDateStart
                        ? ` - ${transaction.operationDateEnd}`
                        : ""}
                    </td>
                    <td className="px-3 py-3">
                      <div className="font-medium text-slate-900">
                        {transaction.description}
                      </div>
                      <div className="text-xs text-muted-foreground">{transaction.id}</div>
                    </td>
                    <td className="px-3 py-3">{transaction.categoryName ?? transaction.categoryId}</td>
                    <td
                      className={cn(
                        "px-3 py-3 text-right font-semibold",
                        transaction.type === "income" ? "text-emerald-700" : "text-rose-700",
                      )}
                    >
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-3 py-3 text-right font-semibold text-teal-800">
                      {formatCurrency(transaction.balance)}
                    </td>
                    <td className="px-3 py-3">{transaction.paymentTypeName ?? transaction.paymentTypeId}</td>
                    <td className="px-3 py-3 text-center">
                      {transaction.received ? (
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                          <Check className="h-4 w-4" />
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="max-w-[180px] truncate px-3 py-3 text-muted-foreground">
                      {transaction.note || "-"}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex justify-end gap-1">
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          title="ดู"
                          aria-label="ดู"
                          onClick={() => onView(transaction)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          title="แก้ไข"
                          aria-label="แก้ไข"
                          onClick={() => onEdit(transaction)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          title="ลบ"
                          aria-label="ลบ"
                          onClick={() => onDelete(transaction)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          แสดง {visibleRows.length.toLocaleString("th-TH")} จาก{" "}
          {sorted.length.toLocaleString("th-TH")} รายการ
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={safePage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            ก่อนหน้า
          </Button>
          <span className="text-sm text-muted-foreground">
            หน้า {safePage.toLocaleString("th-TH")} / {pageCount.toLocaleString("th-TH")}
          </span>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
            disabled={safePage >= pageCount}
          >
            ถัดไป
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

function SortableHeader({
  label,
  active,
  align = "left",
  onClick,
}: {
  label: string;
  active: boolean;
  align?: "left" | "right";
  onClick: () => void;
}) {
  return (
    <th
      className={cn(
        "px-3 py-3 font-medium",
        align === "right" && "text-right",
      )}
    >
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-950",
          active && "text-teal-800",
        )}
        onClick={onClick}
      >
        {label}
      </button>
    </th>
  );
}
