import { useState } from "react";
import { Download, Plus } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { DeleteTransactionDialog } from "@/components/transactions/DeleteTransactionDialog";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { TransactionFormDialog } from "@/components/transactions/TransactionFormDialog";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { Button } from "@/components/ui/Button";
import { useCategories } from "@/hooks/useCategories";
import { usePaymentTypes } from "@/hooks/usePaymentTypes";
import { useTransactionMutations, useTransactions } from "@/hooks/useTransactions";
import type { TransactionFilters as Filters, TransactionRecord } from "@/types/transaction";
import { summarizeTransactions } from "@/utils/balance";
import { exportTransactionsToExcel } from "@/utils/exportTransactions";

const emptyFilters: Filters = {
  search: "",
  type: "all",
  categoryId: "",
  paymentTypeId: "",
  received: "all",
  dateFrom: "",
  dateTo: "",
};

export function TransactionsPage() {
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [editing, setEditing] = useState<TransactionRecord | null>(null);
  const [deleting, setDeleting] = useState<TransactionRecord | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const transactionsQuery = useTransactions(filters);
  const categoriesQuery = useCategories();
  const paymentTypesQuery = usePaymentTypes();
  const mutations = useTransactionMutations();

  const transactions = transactionsQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];
  const paymentTypes = paymentTypesQuery.data ?? [];
  const isLoading =
    transactionsQuery.isLoading ||
    categoriesQuery.isLoading ||
    paymentTypesQuery.isLoading;

  const summary = summarizeTransactions(transactions);
  const saving =
    mutations.createTransaction.isPending || mutations.updateTransaction.isPending;

  async function handleSubmit(values: Parameters<typeof mutations.createTransaction.mutateAsync>[0]) {
    if (editing) {
      await mutations.updateTransaction.mutateAsync({ id: editing.id, data: values });
    } else {
      await mutations.createTransaction.mutateAsync(values);
    }
    setFormOpen(false);
    setEditing(null);
  }

  async function handleDelete() {
    if (!deleting) return;
    await mutations.deleteTransaction.mutateAsync(deleting.id);
    setDeleting(null);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">เพิ่ม แก้ไข ลบ ค้นหา และกรองรายการ</p>
          <h2 className="text-2xl font-semibold text-slate-950">รายการทั้งหมด</h2>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => exportTransactionsToExcel(transactions)}
          disabled={isLoading || transactions.length === 0}
        >
          <Download className="h-4 w-4" />
          Export Excel
        </Button>
        <Button
          type="button"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          เพิ่มรายการ
        </Button>
      </div>

      <SummaryCards summary={summary} />

      <TransactionFilters
        filters={filters}
        categories={categories}
        paymentTypes={paymentTypes}
        onChange={setFilters}
        onReset={() => setFilters(emptyFilters)}
      />

      {transactionsQuery.error ? (
        <EmptyState
          title="ไม่สามารถโหลดรายการได้"
          description={
            transactionsQuery.error instanceof Error
              ? transactionsQuery.error.message
              : "กรุณาลองใหม่อีกครั้ง"
          }
        />
      ) : (
        <TransactionTable
          transactions={transactions}
          loading={isLoading}
          onEdit={(transaction) => {
            setEditing(transaction);
            setFormOpen(true);
          }}
          onDelete={setDeleting}
        />
      )}

      <TransactionFormDialog
        open={formOpen}
        categories={categories}
        paymentTypes={paymentTypes}
        initialTransaction={editing}
        saving={saving}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
      />

      <DeleteTransactionDialog
        transaction={deleting}
        deleting={mutations.deleteTransaction.isPending}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
