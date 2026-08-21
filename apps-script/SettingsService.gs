const SettingsService = {
  list: function () {
    requirePermission("settings:manage");
    return SheetRepository.read(SHEET_NAMES.settings).map(function (record) {
      return {
        key: String(record.key || ""),
        value: String(record.value || ""),
      };
    });
  },

  get: function (key, fallback) {
    const setting = SheetRepository.read(SHEET_NAMES.settings).find(function (record) {
      return String(record.key) === String(key);
    });
    return setting ? String(setting.value || "") : fallback;
  },

  startingBalance: function () {
    return Number(this.get("startingBalance", "0")) || 0;
  },

  update: function (key, value) {
    requirePermission("settings:manage");
    const normalizedKey = sanitizeText(key);
    if (!normalizedKey) throw appError("MISSING_SETTING_KEY", "ไม่พบ key การตั้งค่า");
    const settings = SheetRepository.read(SHEET_NAMES.settings).map(function (record) {
      return {
        key: String(record.key || ""),
        value: String(record.value || ""),
      };
    });
    const exists = settings.some(function (setting) {
      return setting.key === normalizedKey;
    });
    const next = exists
      ? settings.map(function (setting) {
          return setting.key === normalizedKey
            ? { key: normalizedKey, value: sanitizeText(value) }
            : setting;
        })
      : settings.concat([{ key: normalizedKey, value: sanitizeText(value) }]);
    SheetRepository.write(SHEET_NAMES.settings, next);
    return next.find(function (setting) {
      return setting.key === normalizedKey;
    });
  },
};
