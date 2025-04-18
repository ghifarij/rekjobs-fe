import { format } from "date-fns";

export const formatDate = (
  date: string | Date,
  formatString = "MMMM dd, yyyy"
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
