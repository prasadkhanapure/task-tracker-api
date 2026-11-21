import type { Task } from "../../../types/task";

export const priorities: {
  value: Task["priority"];
  color: string;
}[] = [
  { value: "high", color: "text-red-500" },
  { value: "medium", color: "text-amber-500" },
  { value: "low", color: "text-blue-500" },
  { value: "none", color: "text-slate-500" },
];

export const toDateTimeLocal = (iso: string | null): string => {
  if (!iso) return "";

  const date = new Date(iso);

  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 16);
};

export const priorityStyles: Record<Task["priority"], string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-blue-100 text-blue-700",
  none: "bg-slate-100 text-slate-500",
};

export const formatDueDate = (dueAt: string | null): string | null => {
  if (!dueAt) return null;

  const date = new Date(dueAt);

  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export const getCurrentLocalDateTime = (): string => {
  return toDateTimeLocal(new Date().toISOString());
};