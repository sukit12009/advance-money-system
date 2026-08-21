import { describe, expect, it } from "vitest";
import { calculateRunningBalances } from "@/utils/balance";
import type { TransactionInput, TransactionRecord } from "@/types/transaction";

function createCrudHarness(initial: TransactionRecord[] = []) {
  let records = calculateRunningBalances(initial);

  return {
    create(input: TransactionInput) {
      const id = `TX-${input.date.replaceAll("-", "")}-${String(records.length + 1).padStart(4, "0")}`;
      const now = "2026-08-21T10:00:00+07:00";
      const record: TransactionRecord = {
        ...input,
        id,
        createdAt: now,
        updatedAt: now,
        createdBy: "test@example.com",
        updatedBy: "test@example.com",
        balance: 0,
      };
      records = calculateRunningBalances([...records, record]);
      return records.find((item) => item.id === id)!;
    },

    get(id: string) {
      return records.find((item) => item.id === id) ?? null;
    },

    update(id: string, data: Partial<TransactionInput>) {
      records = calculateRunningBalances(
        records.map((item) =>
          item.id === id ? { ...item, ...data, id, updatedAt: "2026-08-21T11:00:00+07:00" } : item,
        ),
      );
      return this.get(id);
    },

    delete(id: string) {
      records = calculateRunningBalances(records.filter((item) => item.id !== id));
      return { id };
    },

    list() {
      return records;
    },
  };
}

const input: TransactionInput = {
  date: "2026-08-21",
  type: "expense",
  operationDate: "21/08/2026",
  description: "ค่าเดินทาง",
  categoryId: "CAT003",
  amount: 500,
  paymentTypeId: "PAY001",
  received: false,
  note: "",
};

describe("transaction CRUD", () => {
  it("creates, gets, updates, and deletes a transaction", () => {
    const store = createCrudHarness();

    const created = store.create(input);
    expect(created.id).toBe("TX-20260821-0001");
    expect(created.balance).toBe(-500);

    const fetched = store.get(created.id);
    expect(fetched?.description).toBe("ค่าเดินทาง");

    const updated = store.update(created.id, {
      amount: 600,
      description: "ค่าเดินทางเพิ่มเติม",
    });
    expect(updated?.amount).toBe(600);
    expect(updated?.balance).toBe(-600);

    store.delete(created.id);
    expect(store.get(created.id)).toBeNull();
    expect(store.list()).toHaveLength(0);
  });
});
