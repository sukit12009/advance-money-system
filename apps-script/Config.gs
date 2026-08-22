const SHEET_NAMES = {
  transactions: "transactions",
  categories: "categories",
  paymentTypes: "payment_types",
  users: "users",
  settings: "settings",
};

const SHEET_HEADERS = {
  transactions: [
    "id",
    "date",
    "type",
    "operationDateStart",
    "operationDateEnd",
    "description",
    "categoryId",
    "amount",
    "paymentTypeId",
    "received",
    "note",
    "createdAt",
    "updatedAt",
    "createdBy",
    "updatedBy",
  ],
  categories: ["id", "name", "active", "sortOrder"],
  paymentTypes: ["id", "name", "active", "sortOrder"],
  users: ["id", "email", "name", "role", "active", "createdAt"],
  settings: ["key", "value"],
};

const VALID_USER_ROLES = ["admin", "user"];
const DEFAULT_TIMEZONE = "Asia/Bangkok";

const ROLE_PERMISSIONS = {
  admin: [
    "transactions:view",
    "transactions:create",
    "transactions:update",
    "transactions:delete",
    "categories:manage",
    "paymentTypes:manage",
    "users:manage",
    "settings:manage",
  ],
  user: [
    "transactions:view",
    "transactions:create",
    "transactions:update",
  ],
};
