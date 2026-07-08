import { format } from "date-fns";

export function formatDate(millis: number): string {
  return format(millis, "MMM d, yyyy");
}

export function toDateInputValue(millis: number): string {
  return format(millis, "yyyy-MM-dd");
}

export function dateInputToMillis(value: string): number {
  return new Date(`${value}T00:00:00`).getTime();
}
