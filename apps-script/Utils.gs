function jsonSuccess(data, message, meta) {
  const output = {
    success: true,
    data: data,
    message: message || "Success",
  };
  if (meta) output.meta = meta;
  return ContentService.createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

function jsonError(error) {
  const code = error && error.errorCode ? error.errorCode : "INTERNAL_ERROR";
  const message =
    error && error.publicMessage
      ? error.publicMessage
      : "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";
  return ContentService.createTextOutput(
    JSON.stringify({
      success: false,
      data: null,
      message: message,
      errorCode: code,
    }),
  ).setMimeType(ContentService.MimeType.JSON);
}

function appError(errorCode, publicMessage) {
  const error = new Error(publicMessage);
  error.errorCode = errorCode;
  error.publicMessage = publicMessage;
  return error;
}

function parseRequestBody(e) {
  const contents = e.postData && e.postData.contents ? e.postData.contents : "{}";
  try {
    return JSON.parse(contents);
  } catch (error) {
    throw appError("INVALID_JSON", "รูปแบบข้อมูลไม่ถูกต้อง");
  }
}

function parseBoolean(value) {
  if (value === true || value === "true" || value === "TRUE") return true;
  if (value === false || value === "false" || value === "FALSE") return false;
  return false;
}

function normalizeBoolean(value) {
  return parseBoolean(value);
}

function sanitizeText(value) {
  const text = String(value || "").trim();
  if (/^[=+\-@]/.test(text)) {
    return "'" + text;
  }
  return text;
}

function parseAmount(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw appError("INVALID_AMOUNT", "จำนวนเงินต้องมากกว่า 0");
  }
  return amount;
}

function isIsoDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || ""));
}

function nowIso() {
  return Utilities.formatDate(
    new Date(),
    DEFAULT_TIMEZONE,
    "yyyy-MM-dd'T'HH:mm:ssXXX",
  );
}

function compareTransactions(a, b) {
  const dateCompare = String(a.date).localeCompare(String(b.date));
  if (dateCompare !== 0) return dateCompare;
  const createdCompare = String(a.createdAt).localeCompare(String(b.createdAt));
  if (createdCompare !== 0) return createdCompare;
  return String(a.id).localeCompare(String(b.id));
}

function nextId(prefix, existingCount) {
  return prefix + String(existingCount + 1).padStart(3, "0");
}

function generateTransactionId(date) {
  const prefix = "TX-" + String(date).replace(/-/g, "");
  const existing = SheetRepository.read(SHEET_NAMES.transactions)
    .filter(function (item) {
      return String(item.id || "").indexOf(prefix) === 0;
    })
    .length;
  return prefix + "-" + String(existing + 1).padStart(4, "0");
}

function keyById(items) {
  return items.reduce(function (acc, item) {
    acc[item.id] = item;
    return acc;
  }, {});
}

function formatDate(value) {
  if (value instanceof Date) {
    return Utilities.formatDate(value, DEFAULT_TIMEZONE, "yyyy-MM-dd");
  }
  return String(value || "");
}

function formatDateTime(value) {
  if (value instanceof Date) {
    return Utilities.formatDate(value, DEFAULT_TIMEZONE, "yyyy-MM-dd'T'HH:mm:ssXXX");
  }
  return String(value || "");
}
