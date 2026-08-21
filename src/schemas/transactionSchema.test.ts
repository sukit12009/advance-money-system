import { describe, expect, it } from "vitest";
import {
  transactionSchema,
  validateTransactionBusinessRules,
} from "./transactionSchema";
import { sampleCategories, samplePaymentTypes } from "@/utils/sampleData";

const validInput = {
  date: "2026-08-21",
  type: "expense",
  operationDate: "21/08/2026",
  description: "ค่าเดินทาง",
  categoryId: "CAT003",
  amount: 500,
  paymentTypeId: "PAY001",
  received: false,
  note: "",
} as const;

describe("transaction validation", () => {
  it.each([
    ["missing date", { ...validInput, date: "" }],
    ["missing type", { ...validInput, type: "" }],
    ["missing description", { ...validInput, description: "" }],
    ["missing category", { ...validInput, categoryId: "" }],
    ["amount = 0", { ...validInput, amount: 0 }],
    ["negative amount", { ...validInput, amount: -1 }],
    ["invalid transaction type", { ...validInput, type: "transfer" }],
  ])("rejects %s", (_caseName, input) => {
    expect(transactionSchema.safeParse(input).success).toBe(false);
  });

  it("rejects invalid category", () => {
    const result = validateTransactionBusinessRules(
      { ...validInput, categoryId: "CAT999" },
      sampleCategories,
      samplePaymentTypes,
    );
    expect(result.valid).toBe(false);
  });

  it("rejects invalid payment type", () => {
    const result = validateTransactionBusinessRules(
      { ...validInput, paymentTypeId: "PAY999" },
      sampleCategories,
      samplePaymentTypes,
    );
    expect(result.valid).toBe(false);
  });

});
