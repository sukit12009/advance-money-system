import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { FieldError, Input, Label, Select, Textarea } from "@/components/ui/FormControls";
import { Modal } from "@/components/ui/Modal";
import { transactionSchema, type TransactionFormValues } from "@/schemas/transactionSchema";
import type { Category } from "@/types/category";
import type { PaymentType } from "@/types/paymentType";
import type { TransactionRecord } from "@/types/transaction";
import { TRANSACTION_TYPES } from "@/types/transaction";
import { formatDateRangeInput, todayIsoDate } from "@/utils/date";

interface TransactionFormDialogProps {
  open: boolean;
  categories: Category[];
  paymentTypes: PaymentType[];
  initialTransaction?: TransactionRecord | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (values: TransactionFormValues) => Promise<void>;
}

const defaultValues: TransactionFormValues = {
  date: todayIsoDate(),
  type: "expense",
  operationDate: todayIsoDate(),
  operationDateStart: todayIsoDate(),
  operationDateEnd: todayIsoDate(),
  description: "",
  categoryId: "",
  amount: 0,
  paymentTypeId: "",
  received: false,
  note: "",
};

export function TransactionFormDialog({
  open,
  categories,
  paymentTypes,
  initialTransaction,
  saving,
  onClose,
  onSubmit,
}: TransactionFormDialogProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues,
  });

  const selectedType = watch("type");
  const selectedCategoryId = watch("categoryId");
  const operationDateStart = watch("operationDateStart");
  const operationDateEnd = watch("operationDateEnd");
  const [operationDatePickerOpen, setOperationDatePickerOpen] = useState(false);
  const availableCategories = categories.filter((category) => category.active);
  const availablePaymentTypes = paymentTypes.filter((paymentType) => paymentType.active);

  useEffect(() => {
    if (!open) return;
    if (initialTransaction) {
      reset({
        date: initialTransaction.date,
        type: initialTransaction.type,
        operationDate: todayIsoDate(),
        operationDateStart: initialTransaction.operationDateStart ?? initialTransaction.operationDate ?? "",
        operationDateEnd: initialTransaction.operationDateEnd ?? initialTransaction.operationDateStart ?? initialTransaction.operationDate ?? "",
        description: initialTransaction.description,
        categoryId: initialTransaction.categoryId,
        amount: initialTransaction.amount,
        paymentTypeId: initialTransaction.paymentTypeId,
        received: initialTransaction.received,
        note: initialTransaction.note,
      });
      return;
    }
    reset(defaultValues);
  }, [initialTransaction, open, reset]);

  useEffect(() => {
    if (
      selectedCategoryId &&
      !availableCategories.some((category) => category.id === selectedCategoryId)
    ) {
      setValue("categoryId", "");
    }
  }, [availableCategories, selectedCategoryId, setValue]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialTransaction ? "แก้ไขรายการ" : "เพิ่มรายการ"}
      description="ข้อมูลจะถูกส่งผ่าน API ไปยัง Google Apps Script เท่านั้น"
    >
      <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="transactionDate">วันที่</Label>
            <Input id="transactionDate" type="date" {...register("date")} />
            <FieldError message={errors.date?.message} />
          </div>

          <div>
            <Label htmlFor="transactionType">ประเภท</Label>
            <Select id="transactionType" {...register("type")}>
              {TRANSACTION_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
            <FieldError message={errors.type?.message} />
          </div>

          <div>
            <Label htmlFor="operationDate">วันที่ดำเนินการ</Label>
            <div className="relative">
              <Input
                id="operationDate"
                readOnly
                value={
                  operationDateStart && operationDateEnd
                    ? `${formatDateRangeInput(operationDateStart)} - ${formatDateRangeInput(operationDateEnd)}`
                    : "เลือกช่วงวันที่"
                }
                onClick={() => setOperationDatePickerOpen((open) => !open)}
                className="cursor-pointer"
              />
              {operationDatePickerOpen ? (
                <div className="absolute z-20 mt-2 grid w-full gap-3 rounded-md border border-border bg-white p-3 shadow-lg sm:grid-cols-2">
                  <div>
                    <Label htmlFor="operationDateStart">วันเริ่มต้น</Label>
                    <Input id="operationDateStart" type="date" {...register("operationDateStart")} />
                  </div>
                  <div>
                    <Label htmlFor="operationDateEnd">วันสิ้นสุด</Label>
                    <Input
                      id="operationDateEnd"
                      type="date"
                      min={operationDateStart}
                      {...register("operationDateEnd")}
                    />
                  </div>
                  <Button type="button" size="sm" className="sm:col-span-2" onClick={() => setOperationDatePickerOpen(false)}>
                    ตกลง
                  </Button>
                </div>
              ) : null}
            </div>
            <FieldError message={errors.operationDateStart?.message || errors.operationDateEnd?.message} />
            <FieldError message={errors.operationDate?.message} />
          </div>

          <div>
            <Label htmlFor="amount">จำนวนเงิน</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              {...register("amount", { valueAsNumber: true })}
            />
            <FieldError message={errors.amount?.message} />
          </div>
        </div>

        <div>
          <Label htmlFor="description">รายการ</Label>
          <Input
            id="description"
            placeholder="เช่น ค่าเดินทาง"
            {...register("description")}
          />
          <FieldError message={errors.description?.message} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="categoryId">หมวดหมู่</Label>
            <Select id="categoryId" {...register("categoryId")}>
              <option value="">เลือกหมวดหมู่</option>
              {availableCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
            <FieldError message={errors.categoryId?.message} />
          </div>

          <div>
            <Label htmlFor="paymentTypeId">ประเภทเอกสาร / การจ่าย</Label>
            <Select id="paymentTypeId" {...register("paymentTypeId")}>
              <option value="">เลือกประเภทเอกสาร</option>
              {availablePaymentTypes.map((paymentType) => (
                <option key={paymentType.id} value={paymentType.id}>
                  {paymentType.name}
                </option>
              ))}
            </Select>
            <FieldError message={errors.paymentTypeId?.message} />
          </div>
        </div>

        <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            className="h-4 w-4 rounded border-border text-teal-700"
            type="checkbox"
            {...register("received")}
          />
          ได้รับเงินแล้ว
        </label>

        <div>
          <Label htmlFor="note">หมายเหตุ</Label>
          <Textarea id="note" placeholder="รายละเอียดเพิ่มเติม" {...register("note")} />
          <FieldError message={errors.note?.message} />
        </div>

        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            ยกเลิก
          </Button>
          <Button type="submit">
            <Save className="h-4 w-4" />
            บันทึก
          </Button>
        </div>
      </form>
    </Modal>
  );
}
