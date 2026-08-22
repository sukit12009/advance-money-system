import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Edit, Plus, Power, Save, Trash2 } from "lucide-react";
import { LoadingBlock } from "@/components/common/LoadingBlock";
import { ConfirmDeleteDialog } from "@/components/common/ConfirmDeleteDialog";
import { PageHeader } from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/FormControls";
import {
  usePaymentTypeMutations,
  usePaymentTypes,
} from "@/hooks/usePaymentTypes";
import type { PaymentType, PaymentTypeInput } from "@/types/paymentType";
import { useCurrentUser } from "@/hooks/useAdminData";

const emptyPaymentType: PaymentTypeInput = {
  name: "",
  active: true,
  sortOrder: 1,
};

export function PaymentTypesPage() {
  const { data = [], isLoading } = usePaymentTypes(true);
  const mutations = usePaymentTypeMutations();
  const [editing, setEditing] = useState<PaymentType | null>(null);
  const [form, setForm] = useState<PaymentTypeInput>(emptyPaymentType);
  const [deleting, setDeleting] = useState<PaymentType | null>(null);
  const [deleteMode, setDeleteMode] = useState<"disable" | "delete">("disable");
  const { data: currentUser } = useCurrentUser();
  const isAdmin = currentUser?.role === "admin";

  useEffect(() => {
    if (!editing) return;
    setForm({
      name: editing.name,
      active: editing.active,
      sortOrder: editing.sortOrder,
    });
  }, [editing]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (editing) {
      await mutations.updatePaymentType.mutateAsync({ id: editing.id, data: form });
    } else {
      await mutations.createPaymentType.mutateAsync(form);
    }
    setEditing(null);
    setForm(emptyPaymentType);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="ประเภทเอกสาร"
        description="จัดการประเภทเอกสารหรือวิธีจ่ายเงินที่ใช้ในฟอร์มรายการ"
      />

      <section className="rounded-lg border border-border bg-white p-4 shadow-sm">
        <form className="grid gap-3 md:grid-cols-[1fr_130px_130px_auto]" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="paymentName">ชื่อประเภทเอกสาร</Label>
            <Input
              id="paymentName"
              value={form.name}
              required
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="paymentSort">ลำดับ</Label>
            <Input
              id="paymentSort"
              type="number"
              value={form.sortOrder}
              onChange={(event) =>
                setForm({ ...form, sortOrder: Number(event.target.value) })
              }
            />
          </div>
          <label className="flex items-end gap-2 pb-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(event) => setForm({ ...form, active: event.target.checked })}
            />
            ใช้งาน
          </label>
          <div className="flex items-end gap-2">
            <Button
              type="submit"
            >
              {editing ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {editing ? "บันทึก" : "เพิ่ม"}
            </Button>
            {editing ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setEditing(null);
                  setForm(emptyPaymentType);
                }}
              >
                ยกเลิก
              </Button>
            ) : null}
          </div>
        </form>
      </section>

      {isLoading ? <LoadingBlock /> : null}

      <section className="overflow-x-auto rounded-lg border border-border bg-white shadow-sm">
        <table className="min-w-[620px] w-full border-collapse text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">ชื่อ</th>
              <th className="px-4 py-3 font-medium">สถานะ</th>
              <th className="px-4 py-3 text-right font-medium">ลำดับ</th>
              <th className="px-4 py-3 text-right font-medium">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {data.map((paymentType) => (
              <tr key={paymentType.id} className="border-t border-border">
                <td className="px-4 py-3 text-muted-foreground">{paymentType.id}</td>
                <td className="px-4 py-3 font-medium text-slate-900">{paymentType.name}</td>
                <td className="px-4 py-3">
                  <Badge tone={paymentType.active ? "success" : "warning"}>
                    {paymentType.active ? "ใช้งาน" : "ปิดใช้งาน"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">{paymentType.sortOrder}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="แก้ไข"
                      onClick={() => setEditing(paymentType)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {isAdmin ? <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="ปิดใช้งาน"
                      onClick={() => { setDeleteMode("disable"); setDeleting(paymentType); }}
                    >
                      <Power className="h-4 w-4 text-amber-700" />
                    </Button> : null}
                    {isAdmin ? <Button type="button" variant="ghost" size="icon" aria-label="ลบ" onClick={() => { setDeleteMode("delete"); setDeleting(paymentType); }}>
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button> : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <ConfirmDeleteDialog
        open={Boolean(deleting)}
        title={deleteMode === "delete" ? "ลบประเภทเอกสาร" : "ปิดใช้งานประเภทเอกสาร"}
        itemName={deleting?.name ?? ""}
        actionLabel={deleteMode === "delete" ? "ลบ" : "ปิดใช้งาน"}
        onClose={() => setDeleting(null)}
        onConfirm={async () => {
          if (!deleting) return;
          if (deleteMode === "delete") await mutations.deletePaymentType.mutateAsync(deleting.id);
          else await mutations.disablePaymentType.mutateAsync(deleting.id);
          setDeleting(null);
        }}
      />
    </div>
  );
}
