const UserService = {
  list: function () {
    requirePermission("users:manage");
    return SheetRepository.read(SHEET_NAMES.users).map(normalizeUser);
  },

  find: function (id) {
    return SheetRepository.read(SHEET_NAMES.users).map(normalizeUser).find(function (item) {
      return String(item.id) === String(id);
    });
  },

  create: function (data) {
    requirePermission("users:manage");
    const input = validateUserInput(data);
    const users = SheetRepository.read(SHEET_NAMES.users).map(normalizeUser);
    const exists = users.some(function (user) {
      return user.email === input.email;
    });
    if (exists) throw appError("USER_EXISTS", "มีผู้ใช้งานอีเมลนี้แล้ว");
    const record = Object.assign({ id: nextId("USR", users.length), createdAt: nowIso() }, input, {
      passwordHash: hashPassword(input.password),
    });
    delete record.password;
    SheetRepository.append(SHEET_NAMES.users, record);
    return normalizeUser(record);
  },

  register: function (data) {
    const users = SheetRepository.read(SHEET_NAMES.users).map(normalizeUser);
    const input = validateUserInput(Object.assign({}, data, { role: users.length === 0 ? "admin" : "user" }));
    if (users.some(function (user) { return user.email === input.email; })) {
      throw appError("USER_EXISTS", "มีผู้ใช้อีเมลนี้แล้ว");
    }
    const record = Object.assign({ id: nextId("USR", users.length), createdAt: nowIso() }, input, {
      passwordHash: hashPassword(input.password),
    });
    delete record.password;
    SheetRepository.append(SHEET_NAMES.users, record);
    return normalizeUser(record);
  },

  update: function (id, data) {
    requirePermission("users:manage");
    const rawExisting = SheetRepository.read(SHEET_NAMES.users).find(function (item) {
      return String(item.id) === String(id);
    });
    const existing = rawExisting ? normalizeUser(rawExisting) : null;
    if (!existing) throw appError("USER_NOT_FOUND", "ไม่พบผู้ใช้งานที่ต้องการ");
    const input = validateUserInput(Object.assign({}, existing, data));
    const next = Object.assign({}, rawExisting, existing, input, {
      id: existing.id,
      createdAt: existing.createdAt,
      passwordHash: rawExisting.passwordHash || "",
    });
    if (data.password) next.passwordHash = hashPassword(data.password);
    delete next.password;
    SheetRepository.updateById(SHEET_NAMES.users, id, next);
    return normalizeUser(next);
  },

  remove: function (id) {
    requirePermission("users:manage");
    const existing = SheetRepository.read(SHEET_NAMES.users).find(function (item) {
      return String(item.id) === String(id);
    });
    if (!existing) throw appError("USER_NOT_FOUND", "ไม่พบผู้ใช้งานที่ต้องการ");
    const next = Object.assign({}, existing, { active: false });
    SheetRepository.updateById(SHEET_NAMES.users, id, next);
    return { id: id };
  },
};
