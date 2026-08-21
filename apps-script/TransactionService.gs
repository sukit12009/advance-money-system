const TransactionService = {
  list: function (filters) {
    requirePermission("transactions:view");
    const transactions = SheetRepository.read(SHEET_NAMES.transactions)
      .map(normalizeTransaction)
      .sort(compareTransactions);
    const withBalances = attachBalances(transactions);
    return filterTransactions(withBalances, filters || {});
  },

  get: function (id) {
    requirePermission("transactions:view");
    const transaction = this.list({}).find(function (item) {
      return String(item.id) === String(id);
    });
    if (!transaction) {
      throw appError("TRANSACTION_NOT_FOUND", "ไม่พบรายการที่ต้องการ");
    }
    return transaction;
  },

  create: function (data) {
    const user = requirePermission("transactions:create");
    const input = validateTransactionInput(data);
    const createdAt = nowIso();
    const record = Object.assign({}, input, {
      id: generateTransactionId(input.date),
      createdAt: createdAt,
      updatedAt: createdAt,
      createdBy: user.email,
      updatedBy: user.email,
    });
    SheetRepository.append(SHEET_NAMES.transactions, record);
    return this.get(record.id);
  },

  update: function (id, data) {
    const user = requirePermission("transactions:update");
    const records = SheetRepository.read(SHEET_NAMES.transactions).map(normalizeTransaction);
    const existing = records.find(function (item) {
      return String(item.id) === String(id);
    });
    if (!existing) {
      throw appError("TRANSACTION_NOT_FOUND", "ไม่พบรายการที่ต้องการ");
    }
    const merged = Object.assign({}, existing, data, { id: existing.id });
    const input = validateTransactionInput(merged);
    const nextRecord = Object.assign({}, existing, input, {
      updatedAt: nowIso(),
      updatedBy: user.email,
    });
    SheetRepository.updateById(SHEET_NAMES.transactions, id, nextRecord);
    return this.get(id);
  },

  remove: function (id) {
    requirePermission("transactions:delete");
    SheetRepository.deleteById(SHEET_NAMES.transactions, id);
    return { id: id };
  },
};

function normalizeTransaction(record) {
  return {
    id: String(record.id || ""),
    date: String(record.date || ""),
    type: String(record.type || ""),
    operationDate: String(record.operationDate || ""),
    description: String(record.description || ""),
    categoryId: String(record.categoryId || ""),
    amount: Number(record.amount || 0),
    paymentTypeId: String(record.paymentTypeId || ""),
    received: normalizeBoolean(record.received),
    note: String(record.note || ""),
    createdAt: String(record.createdAt || ""),
    updatedAt: String(record.updatedAt || ""),
    createdBy: String(record.createdBy || ""),
    updatedBy: String(record.updatedBy || ""),
  };
}

function attachBalances(transactions) {
  const categories = keyById(CategoryService.list(true));
  const paymentTypes = keyById(PaymentTypeService.list(true));
  let balance = SettingsService.startingBalance();

  return transactions.sort(compareTransactions).map(function (transaction) {
    balance =
      transaction.type === "income"
        ? balance + transaction.amount
        : balance - transaction.amount;
    return Object.assign({}, transaction, {
      balance: balance,
      categoryName: categories[transaction.categoryId]
        ? categories[transaction.categoryId].name
        : "",
      paymentTypeName: paymentTypes[transaction.paymentTypeId]
        ? paymentTypes[transaction.paymentTypeId].name
        : "",
    });
  });
}

function filterTransactions(transactions, filters) {
  const search = String(filters.search || "").trim().toLowerCase();
  const type = String(filters.type || "");
  const categoryId = String(filters.categoryId || "");
  const paymentTypeId = String(filters.paymentTypeId || "");
  const received = String(filters.received || "");
  const dateFrom = String(filters.dateFrom || "");
  const dateTo = String(filters.dateTo || "");

  return transactions.filter(function (transaction) {
    const matchesSearch =
      !search ||
      [
        transaction.description,
        transaction.note,
        transaction.categoryName,
        transaction.paymentTypeName,
      ].some(function (value) {
        return String(value || "").toLowerCase().indexOf(search) !== -1;
      });
    const matchesType = !type || type === "all" || transaction.type === type;
    const matchesCategory = !categoryId || transaction.categoryId === categoryId;
    const matchesPayment = !paymentTypeId || transaction.paymentTypeId === paymentTypeId;
    const matchesReceived =
      !received ||
      received === "all" ||
      (received === "received" && transaction.received) ||
      (received === "pending" && !transaction.received);
    const matchesDateFrom = !dateFrom || transaction.date >= dateFrom;
    const matchesDateTo = !dateTo || transaction.date <= dateTo;

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
