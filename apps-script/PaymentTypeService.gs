const PaymentTypeService = {
  list: function (includeInactive) {
    const paymentTypes = SheetRepository.read(SHEET_NAMES.paymentTypes)
      .map(normalizePaymentType)
      .sort(function (a, b) {
        return a.sortOrder - b.sortOrder || a.name.localeCompare(b.name);
      });
    return includeInactive ? paymentTypes : paymentTypes.filter(function (item) { return item.active; });
  },

  find: function (id) {
    return this.list(true).find(function (item) {
      return String(item.id) === String(id);
    });
  },

  create: function (data) {
    requirePermission("paymentTypes:manage");
    const input = validatePaymentTypeInput(data);
    const paymentTypes = this.list(true);
    const record = Object.assign({ id: nextId("PAY", paymentTypes.length) }, input);
    SheetRepository.append(SHEET_NAMES.paymentTypes, record);
    return record;
  },

  update: function (id, data) {
    requirePermission("paymentTypes:manage");
    const existing = this.find(id);
    if (!existing) {
      throw appError("PAYMENT_TYPE_NOT_FOUND", "ไม่พบประเภทเอกสารที่ต้องการ");
    }
    const input = validatePaymentTypeInput(Object.assign({}, existing, data));
    const next = Object.assign({}, existing, input, { id: existing.id });
    SheetRepository.updateById(SHEET_NAMES.paymentTypes, id, next);
    return next;
  },

  remove: function (id) {
    requirePermission("paymentTypes:manage");
    const existing = this.find(id);
    if (!existing) {
      throw appError("PAYMENT_TYPE_NOT_FOUND", "ไม่พบประเภทเอกสารที่ต้องการ");
    }
    const next = Object.assign({}, existing, { active: false });
    SheetRepository.updateById(SHEET_NAMES.paymentTypes, id, next);
    return { id: id };
  },

  destroy: function (id) {
    requirePermission("paymentTypes:manage");
    SheetRepository.deleteById(SHEET_NAMES.paymentTypes, id);
    return { id: id };
  },
};

function normalizePaymentType(record) {
  return {
    id: String(record.id || ""),
    name: String(record.name || ""),
    active: normalizeBoolean(record.active),
    sortOrder: Number(record.sortOrder || 0),
  };
}
