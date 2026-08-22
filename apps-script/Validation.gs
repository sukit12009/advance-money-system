function validateTransactionInput(input) {
  const type = String(input.type || "");
  if (!isIsoDate(input.date)) {
    throw appError("INVALID_DATE", "กรุณาระบุวันที่รูปแบบ YYYY-MM-DD");
  }
  if (!isIsoDate(input.operationDateStart) || !isIsoDate(input.operationDateEnd)) {
    throw appError("MISSING_OPERATION_DATE", "กรุณากรอกวันที่ดำเนินการ");
  }
  if (String(input.operationDateStart) > String(input.operationDateEnd)) {
    throw appError("INVALID_OPERATION_DATE_RANGE", "วันที่สิ้นสุดต้องไม่น้อยกว่าวันที่เริ่มต้น");
  }
  if (!sanitizeText(input.description)) {
    throw appError("MISSING_DESCRIPTION", "กรุณากรอกรายการ");
  }
  if (!sanitizeText(input.categoryId)) {
    throw appError("MISSING_CATEGORY", "กรุณาเลือกหมวดหมู่");
  }
  if (!sanitizeText(input.paymentTypeId)) {
    throw appError("MISSING_PAYMENT_TYPE", "กรุณาเลือกประเภทเอกสาร");
  }

  const category = CategoryService.find(input.categoryId);
  if (!category || !category.active) {
    throw appError("INVALID_CATEGORY", "หมวดหมู่ไม่ถูกต้องหรือถูกปิดใช้งาน");
  }

  const paymentType = PaymentTypeService.find(input.paymentTypeId);
  if (!paymentType || !paymentType.active) {
    throw appError("INVALID_PAYMENT_TYPE", "ประเภทเอกสารไม่ถูกต้องหรือถูกปิดใช้งาน");
  }

  return {
    date: String(input.date),
    type: type,
    operationDateStart: String(input.operationDateStart),
    operationDateEnd: String(input.operationDateEnd),
    description: sanitizeText(input.description),
    categoryId: sanitizeText(input.categoryId),
    amount: parseAmount(input.amount),
    paymentTypeId: sanitizeText(input.paymentTypeId),
    received: input.received === true || input.received === false ? input.received : normalizeBoolean(input.received),
    note: sanitizeText(input.note),
  };
}

function validateCategoryInput(input) {
  if (!sanitizeText(input.name)) {
    throw appError("MISSING_CATEGORY_NAME", "กรุณากรอกชื่อหมวดหมู่");
  }
  return {
    name: sanitizeText(input.name),
    active: input.active === true || input.active === false ? input.active : normalizeBoolean(input.active),
    sortOrder: Number(input.sortOrder || 0),
  };
}

function validatePaymentTypeInput(input) {
  if (!sanitizeText(input.name)) {
    throw appError("MISSING_PAYMENT_TYPE_NAME", "กรุณากรอกชื่อประเภทเอกสาร");
  }
  return {
    name: sanitizeText(input.name),
    active: input.active === true || input.active === false ? input.active : normalizeBoolean(input.active),
    sortOrder: Number(input.sortOrder || 0),
  };
}

function validateUserInput(input) {
  const email = String(input.email || "").trim().toLowerCase();
  const role = String(input.role || "user");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw appError("INVALID_EMAIL", "อีเมลไม่ถูกต้อง");
  }
  if (!sanitizeText(input.name)) {
    throw appError("MISSING_NAME", "กรุณากรอกชื่อผู้ใช้งาน");
  }
  if (input.password !== undefined && String(input.password || "").length < 8) {
    throw appError("INVALID_PASSWORD", "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
  }
  if (VALID_USER_ROLES.indexOf(role) === -1) {
    throw appError("INVALID_ROLE", "สิทธิ์ผู้ใช้งานไม่ถูกต้อง");
  }
  return {
    email: email,
    name: sanitizeText(input.name),
    role: role,
    active: input.active === true || input.active === false ? input.active : normalizeBoolean(input.active),
    password: String(input.password || ""),
  };
}
