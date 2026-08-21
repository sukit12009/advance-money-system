const CategoryService = {
  list: function (includeInactive) {
    const categories = SheetRepository.read(SHEET_NAMES.categories)
      .map(normalizeCategory)
      .sort(function (a, b) {
        return a.sortOrder - b.sortOrder || a.name.localeCompare(b.name);
      });
    return includeInactive ? categories : categories.filter(function (item) { return item.active; });
  },

  find: function (id) {
    return this.list(true).find(function (item) {
      return String(item.id) === String(id);
    });
  },

  create: function (data) {
    requirePermission("categories:manage");
    const input = validateCategoryInput(data);
    const categories = this.list(true);
    const record = Object.assign({ id: nextId("CAT", categories.length) }, input);
    SheetRepository.append(SHEET_NAMES.categories, record);
    return record;
  },

  update: function (id, data) {
    requirePermission("categories:manage");
    const existing = this.find(id);
    if (!existing) throw appError("CATEGORY_NOT_FOUND", "ไม่พบหมวดหมู่ที่ต้องการ");
    const input = validateCategoryInput(Object.assign({}, existing, data));
    const next = Object.assign({}, existing, input, { id: existing.id });
    SheetRepository.updateById(SHEET_NAMES.categories, id, next);
    return next;
  },

  remove: function (id) {
    requirePermission("categories:manage");
    const existing = this.find(id);
    if (!existing) throw appError("CATEGORY_NOT_FOUND", "ไม่พบหมวดหมู่ที่ต้องการ");
    const next = Object.assign({}, existing, { active: false });
    SheetRepository.updateById(SHEET_NAMES.categories, id, next);
    return { id: id };
  },
};

function normalizeCategory(record) {
  return {
    id: String(record.id || ""),
    name: String(record.name || ""),
    active: normalizeBoolean(record.active),
    sortOrder: Number(record.sortOrder || 0),
  };
}
