export type TransactionType = "income" | "expense";

export type ReceivedFilter = "all" | "received" | "pending";

export interface TransactionInput {
  date: string;
  type: TransactionType;
  operationDateStart?: string;
  operationDateEnd?: string;
  operationDate?: string;
  description: string;
  categoryId: string;
  amount: number;
  paymentTypeId: string;
  received: boolean;
  note: string;
}

export interface TransactionRecord extends TransactionInput {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  balance: number;
  categoryName?: string;
  paymentTypeName?: string;
}

export interface TransactionFilters {
  search?: string;
  type?: TransactionType | "all";
  categoryId?: string;
  paymentTypeId?: string;
  received?: ReceivedFilter;
  dateFrom?: string;
  dateTo?: string;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  currentBalance: number;
  transactionCount: number;
}

export const TRANSACTION_TYPE_LABEL: Record<TransactionType, string> = {
  income: "รายรับ",
  expense: "รายจ่าย",
};

export const TRANSACTION_TYPES: Array<{
  value: TransactionType;
  label: string;
}> = [
  { value: "income", label: TRANSACTION_TYPE_LABEL.income },
  { value: "expense", label: TRANSACTION_TYPE_LABEL.expense },
];
