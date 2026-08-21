import { describe, expect, it } from "vitest";
import { calculateNextBalance, calculateRunningBalances } from "./balance";
import type { TransactionRecord } from "@/types/transaction";

function transaction(
  id: string,
  date: string,
  type: TransactionRecord["type"],
  amount: number,
  createdAt: string,
): TransactionRecord {
  return {
    id,
    date,
    type,
    operationDate: date,
    description: id,
    categoryId: type === "income" ? "CAT001" : "CAT002",
    amount,
    paymentTypeId: "PAY001",
    received: true,
    note: "",
    createdAt,
    updatedAt: createdAt,
    createdBy: "test@example.com",
    updatedBy: "test@example.com",
    balance: 0,
  };
}

describe("balance", () => {
  it("adds income and subtracts expense", () => {
    expect(calculateNextBalance(80000, "expense", 7500)).toBe(72500);
    expect(calculateNextBalance(72500, "expense", 6500)).toBe(66000);
    expect(calculateNextBalance(66000, "income", 10000)).toBe(76000);
  });

  it("sorts by date, createdAt, and id before calculating running balance", () => {
    const rows = calculateRunningBalances([
      transaction("TX-20260803-0002", "2026-08-03", "expense", 6500, "2026-08-03T08:10:00+07:00"),
      transaction("TX-20260717-0001", "2026-07-17", "income", 80000, "2026-07-17T09:00:00+07:00"),
      transaction("TX-20260803-0001", "2026-08-03", "expense", 7500, "2026-08-03T08:00:00+07:00"),
    ]);

    expect(rows.map((row) => row.id)).toEqual([
      "TX-20260717-0001",
      "TX-20260803-0001",
      "TX-20260803-0002",
    ]);
    expect(rows.map((row) => row.balance)).toEqual([80000, 72500, 66000]);
  });
});
