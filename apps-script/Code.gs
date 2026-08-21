function doGet(e) {
  try {
    return routeGet(e || {});
  } catch (error) {
    return jsonError(error);
  }
}

function doPost(e) {
  try {
    return routePost(e || {});
  } catch (error) {
    return jsonError(error);
  }
}

function setupSpreadsheet() {
  ensureSheets();
  seedInitialData();
  return "Spreadsheet schema and sample data are ready.";
}
