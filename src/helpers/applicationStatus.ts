// src/constants/applicationStatus.ts

/** Raw enum values coming from the back-end */
export type ApplicationStatusCode =
  | "PENDING"
  | "PROCESSING"
  | "ACCEPTED"
  | "REJECTED";

/** Human-readable labels (Indo/English) */
export const APPLICATION_STATUS_LABELS: Record<ApplicationStatusCode, string> =
  {
    PENDING: "MENUNGGU",
    PROCESSING: "DIPROSES",
    ACCEPTED: "DITERIMA",
    REJECTED: "DITOLAK",
  };

/** Helper to guard against missing keys */
export function getApplicationStatusLabel(code: string): string {
  return APPLICATION_STATUS_LABELS[code as ApplicationStatusCode] ?? code;
}
