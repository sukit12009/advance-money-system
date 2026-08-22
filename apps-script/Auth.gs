function getCurrentUser() {
  const token = String(REQUEST_AUTH_TOKEN || "");
  const email = token
    ? String(CacheService.getScriptCache().get("auth:" + token) || "").toLowerCase()
    : "";
  if (!email) throw appError("UNAUTHORIZED", "กรุณาเข้าสู่ระบบ");
  const users = SheetRepository.read(SHEET_NAMES.users).map(normalizeUser);

  if (users.length === 0 && email) {
    return {
      id: "BOOTSTRAP",
      email: email,
      name: "Bootstrap admin",
      role: "admin",
      active: true,
    };
  }

  const user = users.find(function (item) {
    return String(item.email).toLowerCase() === email;
  });

  if (!user || !user.active) {
    throw appError("UNAUTHORIZED", "ไม่มีสิทธิ์ใช้งานระบบ");
  }

  return user;
}

var REQUEST_AUTH_TOKEN = "";

function hashPassword(password) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(password));
  return bytes.map(function (byte) {
    const value = byte < 0 ? byte + 256 : byte;
    return (value < 16 ? "0" : "") + value.toString(16);
  }).join("");
}

function requirePermission(permission) {
  const user = getCurrentUser();
  const permissions = ROLE_PERMISSIONS[user.role] || [];
  if (permissions.indexOf(permission) === -1) {
    throw appError("FORBIDDEN", "ไม่มีสิทธิ์ทำรายการนี้");
  }
  return user;
}

function normalizeUser(user) {
  return {
    id: String(user.id || ""),
    email: String(user.email || "").toLowerCase(),
    name: String(user.name || ""),
    role: String(user.role || "user"),
    active: normalizeBoolean(user.active),
    createdAt: String(user.createdAt || ""),
  };
}
