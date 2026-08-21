import type {
  TransactionFilters,
  TransactionRecord,
  TransactionSummary,
} from "@/types/transaction";

export function sortTransactionsForBalance<T extends Pick<TransactionRecord, "date" | "createdAt" | "id">>(
  transactions: T[],
) {
  return [...transactions].sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) return dateCompare;
    const createdCompare = a.createdAt.localeCompare(b.createdAt);
    if (createdCompare !== 0) return createdCompare;
    return a.id.localeCompare(b.id);
  });
}

export function calculateNextBalance(
  previousBalance: number,
  type: TransactionRecord["type"],
  amount: number,
) {
  return type === "income" ? previousBalance + amount : previousBalance - amount;
}

export function calculateRunningBalances(
  transactions: TransactionRecord[],
  startingBalance = 0,
) {
  let balance = startingBalance;
  return sortTransactionsForBalance(transactions).map((transaction) => {
    balance = calculateNextBalance(balance, transaction.type, transaction.amount);
    return {
      ...transaction,
      balance,
    };
  });
}

export function summarizeTransactions(
  transactions: TransactionRecord[],
): TransactionSummary {
  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalExpense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const ordered = calculateRunningBalances(transactions);
  const currentBalance = ordered.at(-1)?.balance ?? 0;

  return {
    totalIncome,
    totalExpense,
    currentBalance,
    transactionCount: transactions.length,
  };
}

export function applyTransactionFilters(
  transactions: TransactionRecord[],
  filters: TransactionFilters,
) {
  const search = filters.search?.trim().toLowerCase();
  return transactions.filter((transaction) => {
    const matchesSearch =
      !search ||
      [
        transaction.description,
        transaction.note,
        transaction.categoryName,
        transaction.paymentTypeName,
      ]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(search));
    const matchesType =
      !filters.type || filters.type === "all" || transaction.type === filters.type;
    const matchesCategory =
      !filters.categoryId || transaction.categoryId === filters.categoryId;
    const matchesPayment =
      !filters.paymentTypeId || transaction.paymentTypeId === filters.paymentTypeId;
    const matchesReceived =
      !filters.received ||
      filters.received === "all" ||
      (filters.received === "received" && transaction.received) ||
      (filters.received === "pending" && !transaction.received);
    const matchesDateFrom = !filters.dateFrom || transaction.date >= filters.dateFrom;
    const matchesDateTo = !filters.dateTo || transaction.date <= filters.dateTo;

    return (
      matchesSearch &&
      matchesType &&
      matchesCategory &&
      matchesPayment &&
      matchesReceived &&
      matchesDateFrom &&
      matchesDateTo
    );
  });
}
