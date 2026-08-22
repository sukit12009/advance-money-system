function routeGet(e) {
  const params = e.parameter || {};
  REQUEST_AUTH_TOKEN = params.authToken || "";
  const action = params.action || "";

  if (action === "transactions") {
    return jsonSuccess(TransactionService.list(params), "Success");
  }

  if (action === "transaction") {
    return jsonSuccess(TransactionService.get(params.id), "Success");
  }

  if (action === "categories") {
    requirePermission("transactions:view");
    return jsonSuccess(CategoryService.list(parseBoolean(params.includeInactive)), "Success");
  }

  if (action === "paymentTypes") {
    requirePermission("transactions:view");
    return jsonSuccess(PaymentTypeService.list(parseBoolean(params.includeInactive)), "Success");
  }

  if (action === "users") {
    return jsonSuccess(UserService.list(), "Success");
  }

  if (action === "currentUser") {
    return jsonSuccess(getCurrentUser(), "Success");
  }

  throw appError("ACTION_NOT_FOUND", "ไม่พบ API action ที่ต้องการ");
}

function routePost(e) {
  const body = parseRequestBody(e);
  REQUEST_AUTH_TOKEN = body.authToken || "";
  const action = body.action || "";

  if (action === "registerUser") {
    return jsonSuccess(UserService.register(body.data || {}), "สร้างผู้ใช้สำเร็จ");
  }

  if (action === "login") {
    const data = body.data || {};
    const users = SheetRepository.read(SHEET_NAMES.users).map(normalizeUser);
    const rawUsers = SheetRepository.read(SHEET_NAMES.users);
    const index = users.findIndex(function (user) { return user.email === String(data.email || "").trim().toLowerCase(); });
    const raw = index >= 0 ? rawUsers[index] : null;
    if (!raw || !normalizeBoolean(raw.active) || raw.passwordHash !== hashPassword(data.password || "")) {
      throw appError("INVALID_LOGIN", "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    }
    const token = Utilities.getUuid();
    CacheService.getScriptCache().put("auth:" + token, users[index].email, 21600);
    return jsonSuccess({ token: token, user: users[index] }, "เข้าสู่ระบบสำเร็จ");
  }

  if (action === "changePassword") {
    const user = getCurrentUser();
    const data = body.data || {};
    if (String(data.newPassword || "").length < 8 || data.newPassword !== data.confirmPassword) {
      throw appError("INVALID_PASSWORD", "รหัสผ่านใหม่ไม่ถูกต้องหรือไม่ตรงกัน");
    }
    const records = SheetRepository.read(SHEET_NAMES.users);
    const record = records.find(function (item) { return String(item.email).toLowerCase() === user.email; });
    if (!record || record.passwordHash !== hashPassword(data.currentPassword || "")) {
      throw appError("INVALID_PASSWORD", "รหัสผ่านเดิมไม่ถูกต้อง");
    }
    record.passwordHash = hashPassword(data.newPassword);
    SheetRepository.updateById(SHEET_NAMES.users, record.id, record);
    return jsonSuccess(null, "เปลี่ยนรหัสผ่านสำเร็จ");
  }

  if (action === "createTransaction") {
    return jsonSuccess(TransactionService.create(body.data || {}), "บันทึกรายการสำเร็จ");
  }

  if (action === "updateTransaction") {
    return jsonSuccess(
      TransactionService.update(body.id, body.data || {}),
      "แก้ไขรายการสำเร็จ",
    );
  }

  if (action === "deleteTransaction") {
    return jsonSuccess(TransactionService.remove(body.id), "ลบรายการสำเร็จ");
  }

  if (action === "createCategory") {
    return jsonSuccess(CategoryService.create(body.data || {}), "เพิ่มหมวดหมู่สำเร็จ");
  }

  if (action === "updateCategory") {
    return jsonSuccess(CategoryService.update(body.id, body.data || {}), "แก้ไขหมวดหมู่สำเร็จ");
  }

  if (action === "deleteCategory") {
    return jsonSuccess(CategoryService.remove(body.id), "ปิดใช้งานหมวดหมู่แล้ว");
  }

  if (action === "createPaymentType") {
    return jsonSuccess(PaymentTypeService.create(body.data || {}), "เพิ่มประเภทเอกสารสำเร็จ");
  }

  if (action === "updatePaymentType") {
    return jsonSuccess(
      PaymentTypeService.update(body.id, body.data || {}),
      "แก้ไขประเภทเอกสารสำเร็จ",
    );
  }

  if (action === "deletePaymentType") {
    return jsonSuccess(PaymentTypeService.remove(body.id), "ปิดใช้งานประเภทเอกสารแล้ว");
  }

  if (action === "createUser") {
    return jsonSuccess(UserService.create(body.data || {}), "เพิ่มผู้ใช้งานสำเร็จ");
  }

  if (action === "updateUser") {
    return jsonSuccess(UserService.update(body.id, body.data || {}), "แก้ไขผู้ใช้งานสำเร็จ");
  }

  if (action === "deleteUser") {
    return jsonSuccess(UserService.remove(body.id), "ปิดใช้งานผู้ใช้งานแล้ว");
  }

  throw appError("ACTION_NOT_FOUND", "ไม่พบ API action ที่ต้องการ");
}
