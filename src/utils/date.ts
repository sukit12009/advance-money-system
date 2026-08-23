export const TIMEZONE = "Asia/Bangkok";

const displayDateFormatter = new Intl.DateTimeFormat("th-TH", {
  timeZone: TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function formatDisplayDate(value: string) {
  if (!value) return "-";
  const parsed = new Date(`${value}T00:00:00+07:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return displayDateFormatter.format(parsed);
}

export function formatDateRangeInput(value: string) {
  if (!value) return value;
  if (isIsoDate(value)) return formatDisplayDate(value);
  const legacy = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!legacy) return value;
  return `${legacy[1]}/${legacy[2]}/${Number(legacy[3]) + 543}`;
}

export function todayIsoDate() {
  const now = new Date();
  const bangkok = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  return bangkok;
}

export function nowBangkokIso() {
  const now = new Date();
  const offsetMs = 7 * 60 * 60 * 1000;
  return new Date(now.getTime() + offsetMs).toISOString().replace("Z", "+07:00");
}

export function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}
