const SheetRepository = {
  spreadsheet: function () {
    const id = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
    if (id) return SpreadsheetApp.openById(id);
    const active = SpreadsheetApp.getActiveSpreadsheet();
    if (!active) {
      throw appError("SPREADSHEET_NOT_CONFIGURED", "ยังไม่ได้ตั้งค่า Spreadsheet ID");
    }
    return active;
  },

  sheet: function (name) {
    const spreadsheet = this.spreadsheet();
    const sheet = spreadsheet.getSheetByName(name);
    if (!sheet) {
      throw appError("SHEET_NOT_FOUND", "ไม่พบชีต " + name);
    }
    return sheet;
  },

  read: function (name) {
    const sheet = this.sheet(name);
    const values = sheet.getDataRange().getValues();
    if (values.length <= 1) return [];
    const headers = values[0].map(String);
    return values.slice(1).filter(rowHasValue).map(function (row) {
      return headers.reduce(function (record, header, index) {
        record[header] = row[index];
        return record;
      }, {});
    });
  },

  write: function (name, records) {
    const sheet = this.sheet(name);
    const headers = getHeadersBySheetName(name);
    const rows = records.map(function (record) {
      return headers.map(function (header) {
        return record[header] === undefined ? "" : record[header];
      });
    });
    sheet.clearContents();
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    if (rows.length > 0) {
      sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
    }
    SpreadsheetApp.flush();
  },

  append: function (name, record) {
    const sheet = this.sheet(name);
    const headers = getHeadersBySheetName(name);
    const row = headers.map(function (header) {
      return record[header] === undefined ? "" : record[header];
    });
    sheet.appendRow(row);
    SpreadsheetApp.flush();
  },

  updateById: function (name, id, nextRecord) {
    const records = this.read(name);
    const index = records.findIndex(function (record) {
      return String(record.id) === String(id);
    });
    if (index === -1) {
      throw appError("RECORD_NOT_FOUND", "ไม่พบข้อมูลที่ต้องการ");
    }
    records[index] = nextRecord;
    this.write(name, records);
  },

  deleteById: function (name, id) {
    const records = this.read(name);
    const next = records.filter(function (record) {
      return String(record.id) !== String(id);
    });
    if (next.length === records.length) {
      throw appError("RECORD_NOT_FOUND", "ไม่พบข้อมูลที่ต้องการ");
    }
    this.write(name, next);
  },
};

function ensureSheets() {
  const spreadsheet = SheetRepository.spreadsheet();
  Object.keys(SHEET_NAMES).forEach(function (key) {
    const name = SHEET_NAMES[key];
    let sheet = spreadsheet.getSheetByName(name);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(name);
    }
    const headers = getHeadersBySheetName(name);
    const firstRow = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
    const hasHeader = firstRow.some(function (cell) {
      return String(cell || "").trim() !== "";
    });
    if (!hasHeader) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
    if (
      name === SHEET_NAMES.transactions &&
      firstRow.some(function (cell) { return String(cell) === "operationDate"; })
    ) {
      const legacyRecords = SheetRepository.read(name).map(function (record) {
        const operationDate = record.operationDate || "";
        return Object.assign({}, record, {
          operationDateStart: operationDate,
          operationDateEnd: operationDate,
        });
      });
      SheetRepository.write(name, legacyRecords);
    }
  });
}

function seedInitialData() {
  seedSheetIfEmpty(SHEET_NAMES.categories, [
    { id: "CAT001", name: "เงินโอนจาก รร.", active: true, sortOrder: 1 },
    { id: "CAT002", name: "ค่าเช่ารถ", active: true, sortOrder: 2 },
    { id: "CAT003", name: "ค่ายานพาหนะ", active: true, sortOrder: 3 },
    { id: "CAT004", name: "ค่าปรับปรุง", active: true, sortOrder: 4 },
    { id: "CAT005", name: "ค่าซ่อม", active: true, sortOrder: 5 },
    { id: "CAT006", name: "ยืมกิจกรรมโรงเรียน", active: true, sortOrder: 6 },
  ]);

  seedSheetIfEmpty(SHEET_NAMES.paymentTypes, [
    { id: "PAY001", name: "ฟอร์ม 2", active: true, sortOrder: 1 },
    { id: "PAY002", name: "ว.13", active: true, sortOrder: 2 },
    { id: "PAY003", name: "ยืม", active: true, sortOrder: 3 },
    { id: "PAY004", name: "เงินโอน", active: true, sortOrder: 4 },
  ]);

  const email = Session.getEffectiveUser().getEmail() || "admin@example.com";
  seedSheetIfEmpty(SHEET_NAMES.users, [
    {
      id: "USR001",
      email: email,
      name: "ผู้ดูแลระบบ",
      role: "admin",
      active: true,
      createdAt: nowIso(),
    },
  ]);

  seedSheetIfEmpty(SHEET_NAMES.settings, [
    { key: "startingBalance", value: "0" },
    { key: "currency", value: "THB" },
    { key: "timezone", value: "Asia/Bangkok" },
  ]);

  seedSheetIfEmpty(SHEET_NAMES.transactions, [
    transactionSeed("TX-20260717-0001", "2026-07-17", "income", "17/07/2026", "เงินเรียนซ่อม", "CAT001", 80000, "PAY004", true, "2026-07-17T09:00:00+07:00"),
    transactionSeed("TX-20260803-0001", "2026-08-03", "expense", "03/08/2026", "เขาใหญ่", "CAT002", 7500, "PAY001", true, "2026-08-03T08:00:00+07:00"),
    transactionSeed("TX-20260803-0002", "2026-08-03", "expense", "03/08/2026", "ชลบุรี", "CAT002", 6500, "PAY001", true, "2026-08-03T08:10:00+07:00"),
    transactionSeed("TX-20260803-0003", "2026-08-03", "expense", "03/08/2026", "ชลบุรี", "CAT002", 6500, "PAY001", true, "2026-08-03T08:20:00+07:00"),
    transactionSeed("TX-20260804-0001", "2026-08-04", "expense", "04/08/2026", "ศรราชกร ภคินี", "CAT003", 670, "PAY002", true, "2026-08-04T09:00:00+07:00"),
    transactionSeed("TX-20260804-0002", "2026-08-04", "expense", "04/08/2026", "สรรพร ภคินี", "CAT003", 110, "PAY002", true, "2026-08-04T09:10:00+07:00"),
    transactionSeed("TX-20260805-0001", "2026-08-05", "expense", "05/08/2026", "เทศบาลสีแดง ร้านค้าโรงเรียน", "CAT004", 76, "PAY001", true, "2026-08-05T08:30:00+07:00"),
    transactionSeed("TX-20260806-0001", "2026-08-06", "expense", "06/08/2026", "เมืองธานี / วัดไพร", "CAT002", 5300, "PAY001", true, "2026-08-06T08:00:00+07:00"),
    transactionSeed("TX-20260806-0002", "2026-08-06", "expense", "06/08/2026", "สนามกีฬาปทุมธานี", "CAT002", 3300, "PAY001", true, "2026-08-06T08:10:00+07:00"),
    transactionSeed("TX-20260806-0003", "2026-08-06", "expense", "06/08/2026", "ศรีราชา", "CAT002", 2500, "PAY001", true, "2026-08-06T08:20:00+07:00"),
    transactionSeed("TX-20260806-0004", "2026-08-06", "expense", "06/08/2026", "ปทุมธานี", "CAT002", 3300, "PAY001", true, "2026-08-06T08:30:00+07:00"),
    transactionSeed("TX-20260807-0001", "2026-08-07", "expense", "07/08/2026", "เครื่องปรับอากาศ ม.1", "CAT005", 1605, "PAY001", true, "2026-08-07T10:00:00+07:00"),
    transactionSeed("TX-20260810-0001", "2026-08-10", "expense", "10/08/2026", "แจ้งวัฒนะ", "CAT003", 725, "PAY002", true, "2026-08-10T09:00:00+07:00"),
    transactionSeed("TX-20260810-0002", "2026-08-10", "expense", "10/08/2026", "ดอกไม้ถวายพระ วันแม่", "CAT006", 200, "PAY003", true, "2026-08-10T09:10:00+07:00"),
  ]);
}

function seedSheetIfEmpty(name, records) {
  if (SheetRepository.read(name).length === 0) {
    SheetRepository.write(name, records);
  }
}

function transactionSeed(id, date, type, operationDate, description, categoryId, amount, paymentTypeId, received, createdAt) {
  return {
    id: id,
    date: date,
    type: type,
    operationDateStart: operationDate,
    operationDateEnd: operationDate,
    description: description,
    categoryId: categoryId,
    amount: amount,
    paymentTypeId: paymentTypeId,
    received: received,
    note: "",
    createdAt: createdAt,
    updatedAt: createdAt,
    createdBy: "seed",
    updatedBy: "seed",
  };
}

function getHeadersBySheetName(name) {
  if (name === SHEET_NAMES.transactions) return SHEET_HEADERS.transactions;
  if (name === SHEET_NAMES.categories) return SHEET_HEADERS.categories;
  if (name === SHEET_NAMES.paymentTypes) return SHEET_HEADERS.paymentTypes;
  if (name === SHEET_NAMES.users) return SHEET_HEADERS.users;
  if (name === SHEET_NAMES.settings) return SHEET_HEADERS.settings;
  throw appError("SHEET_NOT_FOUND", "ไม่พบชีต " + name);
}

function rowHasValue(row) {
  return row.some(function (cell) {
    return String(cell || "").trim() !== "";
  });
}
