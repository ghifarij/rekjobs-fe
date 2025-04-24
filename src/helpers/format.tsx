import { format } from "date-fns";

export const formatDate = (
  date: string | Date,
  formatString = "dd MMMM yyyy"
): string => {
  if (!date) {
    throw new Error("Invalid date provided.");
  }

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    throw new Error("Invalid date object.");
  }

  return format(dateObj, formatString);
};

export const formatCurrency = (
  value: number | string,
  locale = "id-ID",
  currency = "IDR"
): string => {
  // If the value is a string that can't be parsed into a number, return it as is
  if (typeof value === "string" && isNaN(parseFloat(value))) {
    return value;
  }

  const amount = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(amount)) {
    return "—";
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function formatDateTimeWIB(
  date: string | Date,
  formatStr = "dd MMMM yyyy, HH:mm 'WIB'"
): string {
  if (!date) {
    throw new Error("Invalid date provided.");
  }

  // parse into a JS Date
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) {
    throw new Error("Invalid date object.");
  }

  // compute UTC‐based timestamp
  const utcTimestamp = d.getTime() + d.getTimezoneOffset() * 60_000;
  // add 7 hours for WIB
  const wibTimestamp = utcTimestamp + 7 * 60 * 60_000;
  const wibDate = new Date(wibTimestamp);

  return format(wibDate, formatStr);
}
