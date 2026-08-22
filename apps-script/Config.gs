const SHEET_NAMES = {
  transactions: "transactions",
  categories: "categories",
  paymentTypes: "payment_types",
  users: "users",
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
  users: ["id", "email", "name", "role", "active", "passwordHash", "createdAt"],
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
  ],
  user: [
    "transactions:view",
    "transactions:create",
    "transactions:update",
  ],
};
