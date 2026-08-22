import type { Category, CategoryInput } from "@/types/category";
import type { PaymentType, PaymentTypeInput } from "@/types/paymentType";
import type { AppSetting } from "@/types/settings";
import type {
  TransactionFilters,
  TransactionInput,
  TransactionRecord,
} from "@/types/transaction";
import type { AppUser, UserInput } from "@/types/user";
import {
  sampleCategories,
  samplePaymentTypes,
  sampleSettings,
  sampleTransactions,
  sampleUsers,
} from "@/utils/sampleData";
import {
  applyTransactionFilters,
  calculateRunningBalances,
  sortTransactionsForBalance,
} from "@/utils/balance";
import { nowBangkokIso } from "@/utils/date";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() ?? "";

type RequestPayload =
  | { action: "login"; data: { email: string; password: string } }
  | { action: "changePassword"; data: { currentPassword: string; newPassword: string; confirmPassword: string } }
  | { action: "registerUser"; data: UserInput }
  | { action: "createTransaction"; data: TransactionInput }
  | { action: "updateTransaction"; id: string; data: Partial<TransactionInput> }
  | { action: "deleteTransaction"; id: string }
  | { action: "createCategory"; data: CategoryInput }
  | { action: "updateCategory"; id: string; data: Partial<CategoryInput> }
  | { action: "deleteCategory"; id: string }
  | { action: "createPaymentType"; data: PaymentTypeInput }
  | { action: "updatePaymentType"; id: string; data: Partial<PaymentTypeInput> }
  | { action: "deletePaymentType"; id: string }
  | { action: "createUser"; data: UserInput }
  | { action: "updateUser"; id: string; data: Partial<UserInput> }
  | { action: "deleteUser"; id: string }
  | { action: "updateSetting"; key: string; value: string };

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
  errorCode?: string;
  meta?: {
    total?: number;
  };
}

class ApiError extends Error {
  errorCode?: string;

  constructor(message: string, errorCode?: string) {
    super(message);
    this.name = "ApiError";
    this.errorCode = errorCode;
  }
}

function isRemoteApiEnabled() {
  return API_BASE_URL.length > 0;
}

async function request<T>(action: string, params: Record<string, unknown> = {}): Promise<T> {
  if (!isRemoteApiEnabled()) {
    return mockGet<T>(action, params);
  }

  const url = new URL(API_BASE_URL);
  url.searchParams.set("action", action);
  const token = window.localStorage.getItem("fern-auth-token");
  if (token) url.searchParams.set("authToken", token);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url);
  return unwrapResponse<T>(response);
}

async function post<T>(payload: RequestPayload): Promise<T> {
  if (!isRemoteApiEnabled()) {
    return mockPost<T>(payload);
  }

  const token = window.localStorage.getItem("fern-auth-token");
  const requestPayload = token && payload.action !== "login"
    ? { ...payload, authToken: token }
    : payload;
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(requestPayload),
  });

  return unwrapResponse<T>(response);
}

async function unwrapResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new ApiError("ไม่สามารถเชื่อมต่อ API ได้ กรุณาลองใหม่อีกครั้ง");
  }

  const envelope = (await response.json()) as ApiEnvelope<T>;
  if (!envelope.success) {
    throw new ApiError(
      envelope.message || "เกิดข้อผิดพลาด กรุณาลองใหม่",
      envelope.errorCode,
    );
  }
  return envelope.data;
}

export const api = {
  mode: isRemoteApiEnabled() ? "remote" : "demo",

  login(email: string, password: string) {
    return post<{ token: string; user: AppUser }>({ action: "login", data: { email, password } });
  },

  changePassword(currentPassword: string, newPassword: string, confirmPassword: string) {
    return post<null>({
      action: "changePassword",
      data: { currentPassword, newPassword, confirmPassword },
    });
  },

  registerUser(data: UserInput) {
    return post<AppUser>({ action: "registerUser", data });
  },

  getTransactions(filters: TransactionFilters = {}) {
    return request<TransactionRecord[]>("transactions", { ...filters });
  },

  getTransaction(id: string) {
    return request<TransactionRecord>("transaction", { id });
  },

  createTransaction(data: TransactionInput) {
    return post<TransactionRecord>({ action: "createTransaction", data });
  },

  updateTransaction(id: string, data: Partial<TransactionInput>) {
    return post<TransactionRecord>({ action: "updateTransaction", id, data });
  },

  deleteTransaction(id: string) {
    return post<{ id: string }>({ action: "deleteTransaction", id });
  },

  getCategories(includeInactive = false) {
    return request<Category[]>("categories", { includeInactive });
  },

  createCategory(data: CategoryInput) {
    return post<Category>({ action: "createCategory", data });
  },

  updateCategory(id: string, data: Partial<CategoryInput>) {
    return post<Category>({ action: "updateCategory", id, data });
  },

  deleteCategory(id: string) {
    return post<{ id: string }>({ action: "deleteCategory", id });
  },

  getPaymentTypes(includeInactive = false) {
    return request<PaymentType[]>("paymentTypes", { includeInactive });
  },

  createPaymentType(data: PaymentTypeInput) {
    return post<PaymentType>({ action: "createPaymentType", data });
  },

  updatePaymentType(id: string, data: Partial<PaymentTypeInput>) {
    return post<PaymentType>({ action: "updatePaymentType", id, data });
  },

  deletePaymentType(id: string) {
    return post<{ id: string }>({ action: "deletePaymentType", id });
  },

  getUsers() {
    return request<AppUser[]>("users");
  },

  getCurrentUser() {
    return request<AppUser>("currentUser");
  },

  createUser(data: UserInput) {
    return post<AppUser>({ action: "createUser", data });
  },

  updateUser(id: string, data: Partial<UserInput>) {
    return post<AppUser>({ action: "updateUser", id, data });
  },

  deleteUser(id: string) {
    return post<{ id: string }>({ action: "deleteUser", id });
  },

  getSettings() {
    return request<AppSetting[]>("settings");
  },

  updateSetting(key: string, value: string) {
    return post<AppSetting>({ action: "updateSetting", key, value });
  },
};

const storageKeys = {
  transactions: "fern-expense-transactions",
  categories: "fern-expense-categories",
  paymentTypes: "fern-expense-payment-types",
  users: "fern-expense-users",
  settings: "fern-expense-settings",
};

function readStorage<T>(key: string, fallback: T): T {
  const raw = window.localStorage.getItem(key);
  if (!raw) {
    writeStorage(key, fallback);
    return fallback;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    writeStorage(key, fallback);
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function enrichTransactions(transactions: TransactionRecord[]) {
  const categories = readStorage(storageKeys.categories, sampleCategories);
  const paymentTypes = readStorage(storageKeys.paymentTypes, samplePaymentTypes);
  return calculateRunningBalances(
    transactions.map((transaction) => ({
      ...transaction,
      categoryName:
        categories.find((category) => category.id === transaction.categoryId)?.name ??
        transaction.categoryName,
      paymentTypeName:
        paymentTypes.find((payment) => payment.id === transaction.paymentTypeId)?.name ??
        transaction.paymentTypeName,
    })),
  );
}

async function mockGet<T>(
  action: string,
  params: Record<string, unknown>,
) {
  await delay(160);

  if (action === "transactions") {
    const transactions = enrichTransactions(
      readStorage(storageKeys.transactions, sampleTransactions),
    );
    return applyTransactionFilters(transactions, params as TransactionFilters) as T;
  }

  if (action === "transaction") {
    const transactions = enrichTransactions(
      readStorage(storageKeys.transactions, sampleTransactions),
    );
    const transaction = transactions.find((item) => item.id === params.id);
    if (!transaction) throw new ApiError("ไม่พบรายการที่ต้องการ", "TRANSACTION_NOT_FOUND");
    return transaction as T;
  }

  if (action === "categories") {
    const categories = readStorage(storageKeys.categories, sampleCategories);
    return (
      params.includeInactive ? categories : categories.filter((item) => item.active)
    ) as T;
  }

  if (action === "paymentTypes") {
    const paymentTypes = readStorage(storageKeys.paymentTypes, samplePaymentTypes);
    return (
      params.includeInactive ? paymentTypes : paymentTypes.filter((item) => item.active)
    ) as T;
  }

  if (action === "users") {
    return readStorage(storageKeys.users, sampleUsers) as T;
  }

  if (action === "currentUser") {
    return readStorage(storageKeys.users, sampleUsers)[0] as T;
  }

  if (action === "settings") {
    return readStorage(storageKeys.settings, sampleSettings) as T;
  }

  throw new ApiError("ไม่พบ API action ที่ต้องการ", "ACTION_NOT_FOUND");
}

async function mockPost<T>(payload: RequestPayload) {
  await delay(220);

  if (payload.action === "login") {
    const users = readStorage(storageKeys.users, sampleUsers);
    const user = users.find((item) => item.email === payload.data.email);
    if (!user || payload.data.password.length < 8) {
      throw new ApiError("อีเมลหรือรหัสผ่านไม่ถูกต้อง", "INVALID_LOGIN");
    }
    return { token: "demo-token", user } as T;
  }

  if (payload.action === "registerUser") {
    const users = readStorage(storageKeys.users, sampleUsers);
    const created: AppUser = {
      id: nextId("USR", users.length + 1),
      email: payload.data.email,
      name: payload.data.name,
      role: users.length === 0 ? "admin" : "user",
      active: true,
      createdAt: nowBangkokIso(),
    };
    writeStorage(storageKeys.users, [...users, created]);
    return created as T;
  }

  if (payload.action === "changePassword") {
    if (payload.data.newPassword.length < 8 || payload.data.newPassword !== payload.data.confirmPassword) {
      throw new ApiError("รหัสผ่านใหม่ไม่ถูกต้องหรือไม่ตรงกัน", "INVALID_PASSWORD");
    }
    return null as T;
  }

  if (payload.action === "createTransaction") {
    const transactions = readStorage(storageKeys.transactions, sampleTransactions);
    const created: TransactionRecord = {
      ...payload.data,
      id: nextTransactionId(payload.data.date, transactions),
      createdAt: nowBangkokIso(),
      updatedAt: nowBangkokIso(),
      createdBy: "demo@example.com",
      updatedBy: "demo@example.com",
      balance: 0,
    };
    const next = enrichTransactions([...transactions, created]);
    writeStorage(storageKeys.transactions, next);
    return next.find((item) => item.id === created.id) as T;
  }

  if (payload.action === "updateTransaction") {
    const transactions = readStorage(storageKeys.transactions, sampleTransactions);
    const exists = transactions.some((item) => item.id === payload.id);
    if (!exists) throw new ApiError("ไม่พบรายการที่ต้องการ", "TRANSACTION_NOT_FOUND");
    const next = enrichTransactions(
      transactions.map((item) =>
        item.id === payload.id
          ? {
              ...item,
              ...payload.data,
              id: item.id,
              updatedAt: nowBangkokIso(),
              updatedBy: "demo@example.com",
            }
          : item,
      ),
    );
    writeStorage(storageKeys.transactions, next);
    return next.find((item) => item.id === payload.id) as T;
  }

  if (payload.action === "deleteTransaction") {
    const transactions = readStorage(storageKeys.transactions, sampleTransactions);
    writeStorage(
      storageKeys.transactions,
      enrichTransactions(transactions.filter((item) => item.id !== payload.id)),
    );
    return { id: payload.id } as T;
  }

  if (payload.action === "createCategory") {
    const categories = readStorage(storageKeys.categories, sampleCategories);
    const created: Category = {
      id: nextId("CAT", categories.length + 1),
      ...payload.data,
    };
    writeStorage(storageKeys.categories, [...categories, created]);
    return created as T;
  }

  if (payload.action === "updateCategory") {
    return updateCollectionItem<T, Category>(
      storageKeys.categories,
      sampleCategories,
      payload.id,
      payload.data,
    );
  }

  if (payload.action === "deleteCategory") {
    softDeleteCollectionItem(storageKeys.categories, sampleCategories, payload.id);
    return { id: payload.id } as T;
  }

  if (payload.action === "createPaymentType") {
    const paymentTypes = readStorage(storageKeys.paymentTypes, samplePaymentTypes);
    const created: PaymentType = {
      id: nextId("PAY", paymentTypes.length + 1),
      ...payload.data,
    };
    writeStorage(storageKeys.paymentTypes, [...paymentTypes, created]);
    return created as T;
  }

  if (payload.action === "updatePaymentType") {
    return updateCollectionItem<T, PaymentType>(
      storageKeys.paymentTypes,
      samplePaymentTypes,
      payload.id,
      payload.data,
    );
  }

  if (payload.action === "deletePaymentType") {
    softDeleteCollectionItem(storageKeys.paymentTypes, samplePaymentTypes, payload.id);
    return { id: payload.id } as T;
  }

  if (payload.action === "createUser") {
    const users = readStorage(storageKeys.users, sampleUsers);
    const created: AppUser = {
      id: nextId("USR", users.length + 1),
      createdAt: nowBangkokIso(),
      ...payload.data,
    };
    writeStorage(storageKeys.users, [...users, created]);
    return created as T;
  }

  if (payload.action === "updateUser") {
    return updateCollectionItem<T, AppUser>(
      storageKeys.users,
      sampleUsers,
      payload.id,
      payload.data,
    );
  }

  if (payload.action === "deleteUser") {
    softDeleteCollectionItem(storageKeys.users, sampleUsers, payload.id);
    return { id: payload.id } as T;
  }

  if (payload.action === "updateSetting") {
    const settings = readStorage(storageKeys.settings, sampleSettings);
    const next = settings.some((item) => item.key === payload.key)
      ? settings.map((item) =>
          item.key === payload.key ? { ...item, value: payload.value } : item,
        )
      : [...settings, { key: payload.key, value: payload.value }];
    writeStorage(storageKeys.settings, next);
    return next.find((item) => item.key === payload.key) as T;
  }

  throw new ApiError("ไม่พบ API action ที่ต้องการ", "ACTION_NOT_FOUND");
}

function updateCollectionItem<T, TItem extends { id: string }>(
  key: string,
  fallback: TItem[],
  id: string,
  data: Partial<TItem>,
) {
  const items = readStorage(key, fallback);
  const exists = items.some((item) => item.id === id);
  if (!exists) throw new ApiError("ไม่พบข้อมูลที่ต้องการ", "RECORD_NOT_FOUND");
  const next = items.map((item) => (item.id === id ? { ...item, ...data, id } : item));
  writeStorage(key, next);
  return next.find((item) => item.id === id) as T;
}

function softDeleteCollectionItem<TItem extends { id: string; active?: boolean }>(
  key: string,
  fallback: TItem[],
  id: string,
) {
  const items = readStorage(key, fallback);
  const next = items.map((item) =>
    item.id === id && "active" in item ? { ...item, active: false } : item,
  );
  writeStorage(key, next);
}

function nextTransactionId(date: string, transactions: TransactionRecord[]) {
  const prefix = `TX-${date.replaceAll("-", "")}`;
  const existing = transactions.filter((item) => item.id.startsWith(prefix)).length + 1;
  return `${prefix}-${String(existing).padStart(4, "0")}`;
}

function nextId(prefix: string, nextNumber: number) {
  return `${prefix}${String(nextNumber).padStart(3, "0")}`;
}

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export { ApiError, sortTransactionsForBalance };
