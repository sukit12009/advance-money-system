import type { TransactionRecord } from "@/types/transaction";
import { formatDisplayDate } from "@/utils/date";

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function operationDate(transaction: TransactionRecord) {
  const start = transaction.operationDateStart ?? transaction.operationDate ?? "";
  const end = transaction.operationDateEnd ?? start;
  return start === end
    ? formatDisplayDate(start)
    : `${formatDisplayDate(start)} - ${formatDisplayDate(end)}`;
}

export function exportTransactionsToExcel(transactions: TransactionRecord[]) {
  const headers = ["วันที่โอน", "Type", "วันที่ดำเนินการ", "รายการ", "หมวด", "จำนวนเงิน", "ยอดเงินคงเหลือ", "ประเภท", "ได้รับเงินแล้ว", "หมายเหตุ"];
  const rows = transactions.map((transaction) => [
    formatDisplayDate(transaction.date),
    transaction.type === "income" ? "รายรับ" : "รายจ่าย",
    operationDate(transaction),
    transaction.description,
    transaction.categoryName ?? transaction.categoryId,
    transaction.amount.toFixed(2),
    transaction.balance.toFixed(2),
    transaction.paymentTypeName ?? transaction.paymentTypeId,
    transaction.received ? "✓" : "",
    transaction.note,
  ]);
  const tableRows = [headers, ...rows].map((row, rowIndex) =>
    `<tr>${row.map((cell, cellIndex) => `<td class="${rowIndex === 0 ? "header" : cellIndex === 1 ? "type" : ""}">${escapeHtml(cell)}</td>`).join("")}</tr>`,
  ).join("");
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>table{border-collapse:collapse;font-family:Arial,sans-serif;font-size:11pt}td{border:1px solid #b7c9d6;padding:6px 9px;white-space:nowrap}.header{background:#168bd0;color:#fff;font-weight:bold;text-align:center}.type{font-weight:bold}</style></head><body><table>${tableRows}</table></body></html>`;
  const url = URL.createObjectURL(new Blob(["\ufeff", html], { type: "application/vnd.ms-excel" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `transactions-${new Date().toISOString().slice(0, 10)}.xls`;
  link.click();
  URL.revokeObjectURL(url);
}
