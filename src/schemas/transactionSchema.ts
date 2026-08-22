import type { Category } from "@/types/category";
import type { PaymentType } from "@/types/paymentType";
import type { TransactionInput } from "@/types/transaction";
import { isIsoDate } from "@/utils/date";
import { z } from "zod";

const moneyValue = z.coerce
  .number({
    invalid_type_error: "จำนวนเงินต้องเป็นตัวเลข",
    required_error: "กรุณากรอกจำนวนเงิน",
  })
  .positive("จำนวนเงินต้องมากกว่า 0");

export const transactionSchema = z.object({
  date: z
    .string()
    .min(1, "กรุณาเลือกวันที่")
    .refine(isIsoDate, "รูปแบบวันที่ไม่ถูกต้อง"),
  type: z.enum(["income", "expense"], {
    required_error: "กรุณาเลือกประเภท",
    invalid_type_error: "ประเภทไม่ถูกต้อง",
  }),
  operationDateStart: z.string().optional(),
  operationDateEnd: z.string().optional(),
  operationDate: z.string().optional(),
  description: z.string().trim().min(1, "กรุณากรอกรายการ"),
  categoryId: z.string().trim().min(1, "กรุณาเลือกหมวดหมู่"),
  amount: moneyValue,
  paymentTypeId: z.string().trim().min(1, "กรุณาเลือกประเภทเอกสาร"),
  received: z.boolean(),
  note: z.string().trim().max(500, "หมายเหตุยาวเกินไป").default(""),
}).refine(
  (value) =>
    !value.operationDateStart ||
    !value.operationDateEnd ||
    (isIsoDate(value.operationDateStart) &&
      isIsoDate(value.operationDateEnd) &&
      value.operationDateStart <= value.operationDateEnd),
  { message: "วันที่สิ้นสุดต้องไม่น้อยกว่าวันที่เริ่มต้น", path: ["operationDateEnd"] },
);

export type TransactionFormValues = z.infer<typeof transactionSchema>;

export function validateTransactionBusinessRules(
  input: TransactionInput,
  categories: Category[],
  paymentTypes: PaymentType[],
) {
  const category = categories.find((item) => item.id === input.categoryId);
  if (!category) {
    return { valid: false, message: "ไม่พบหมวดหมู่ที่เลือก" };
  }

  if (!category.active) {
    return { valid: false, message: "หมวดหมู่นี้ถูกปิดใช้งานแล้ว" };
  }

  const paymentType = paymentTypes.find((item) => item.id === input.paymentTypeId);
  if (!paymentType) {
    return { valid: false, message: "ไม่พบประเภทเอกสารที่เลือก" };
  }

  if (!paymentType.active) {
    return { valid: false, message: "ประเภทเอกสารนี้ถูกปิดใช้งานแล้ว" };
  }

  return { valid: true, message: "" };
}
