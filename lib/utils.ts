import { format, formatDistanceToNow } from "date-fns";

// Converts a date to a relative string. Example: "3 days ago".
export function formatDate(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

// Converts a date to a full readable string. Example: "Jun 7, 2026".
export function formatFullDate(date: string | Date): string {
  return format(new Date(date), "MMM d, yyyy");
}

// Capitalizes just the first character of a string.
// Used to normalize story status values from the API
// (e.g. "draft" → "Draft", "published" → "Published").
export function capitalize(s: string): string {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}
