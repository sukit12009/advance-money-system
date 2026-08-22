import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

export function ConfirmDeleteDialog({
  open,
  title,
  itemName,
  actionLabel = "ลบ",
  onClose,
  onConfirm,
}: {
  open: boolean;
  title: string;
  itemName: string;
  actionLabel?: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal open={open} title={title} onClose={onClose}>
      <p className="text-sm text-slate-700">ต้องการ{actionLabel} “{itemName}” ใช่หรือไม่?</p>
      <div className="mt-5 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onClose}>ยกเลิก</Button>
        <Button type="button" variant="danger" onClick={onConfirm}>ยืนยัน{actionLabel}</Button>
      </div>
    </Modal>
  );
}
