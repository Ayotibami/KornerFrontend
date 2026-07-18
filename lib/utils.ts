import { format, formatDistanceToNow } from "date-fns";

// Converts a date to a relative string. Example: "3 days ago".
export function formatDate(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

// Converts a date to a full readable string. Example: "Jun 7, 2026".
export function formatFullDate(date: string | Date): string {
  return format(new Date(date), "MMM d, yyyy");
}

// Converts a date to a full readable string with time. Example: "Jun 7, 2026 at 3:00 PM".
export function formatFullDateTime(date: string | Date): string {
  return format(new Date(date), "MMM d, yyyy 'at' h:mm a");
}

// Converts a date to a long readable string with time. Example: "January 4, 2026, 3:45 PM".
export function formatLongDateTime(date: string | Date): string {
  return format(new Date(date), "MMMM d, yyyy, h:mm a");
}

// Capitalizes just the first character of a string.
// Used to normalize story status values from the API
// (e.g. "draft" → "Draft", "published" → "Published").
export function capitalize(s: string): string {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}
