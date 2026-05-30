import { formatDistanceToNow } from "date-fns";

// Converts a date string or Date object to a human-readable relative string.
// Example: "3 days ago", "about 2 hours ago".
// Used on story cards to display when a story was created.
export function formatDate(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

// Capitalizes just the first character of a string.
// Used to normalize story status values from the API
// (e.g. "draft" → "Draft", "published" → "Published").
export function capitalize(s: string): string {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}
