import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type { TransactionRecord } from "@/types/transaction";
import { formatCurrency } from "@/utils/currency";

interface DeleteTransactionDialogProps {
  transaction?: TransactionRecord | null;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteTransactionDialog({
  transaction,
  deleting,
  onClose,
  onConfirm,
}: DeleteTransactionDialogProps) {
  return (
    <Modal
      open={Boolean(transaction)}
      onClose={onClose}
      title="ต้องการลบรายการนี้หรือไม่?"
      className="max-w-lg"
    >
      {transaction ? (
        <div className="space-y-4">
          <div className="rounded-lg bg-rose-50 p-4 text-sm text-rose-900">
            เมื่อลบแล้ว backend จะคำนวณ running balance ใหม่จากลำดับรายการทั้งหมด
          </div>
          <dl className="grid gap-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">รายการ</dt>
              <dd className="font-medium text-slate-900">{transaction.description}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">จำนวนเงิน</dt>
              <dd className="font-semibold text-slate-900">
                {formatCurrency(transaction.amount)}
              </dd>
            </div>
          </dl>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose} disabled={deleting}>
              ยกเลิก
            </Button>
            <Button type="button" variant="danger" onClick={onConfirm} disabled={deleting}>
              <Trash2 className="h-4 w-4" />
              {deleting ? "กำลังลบ..." : "ลบรายการ"}
            </Button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
