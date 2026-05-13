import { formatDistanceToNow } from "date-fns";
// export function formatDate(date: string | Date) {
//   return new Intl.DateTimeFormat("en-NG", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   }).format(new Date(date));
// }

// export function formatDate(date: Date) {
//   const d = new Date(date);
//   return (
//     d.getHours() +
//     ":" +
//     d.getMinutes() +
//     " " +
//     d.getDate() +
//     "/" +
//     d.getMonth() +
//     "/" +
//     d.getFullYear()
//   );
// }
export function formatDate(date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}
