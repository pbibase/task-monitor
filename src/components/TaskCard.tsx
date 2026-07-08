"use client";

import clsx from "clsx";
import { formatDate } from "@/lib/format";
import type { Task } from "@/lib/types";
import { PRIORITY_LABELS } from "@/lib/types";

const PRIORITY_COLORS: Record<Task["priority"], string> = {
  low: "bg-blue-50 text-blue-600",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-red-50 text-red-600",
};

export default function TaskCard({
  task,
  onClick,
}: {
  task: Task;
  onClick: () => void;
}) {
  // eslint-disable-next-line react-hooks/purity -- client-only post-auth view, no SSR/hydration involved
  const overdue = task.dueDate < Date.now() && task.status !== "completed";

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white border border-gray-200 rounded-md p-3 hover:border-gray-400 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium text-sm">{task.title}</p>
        <span
          className={clsx(
            "text-xs px-2 py-0.5 rounded-full whitespace-nowrap",
            PRIORITY_COLORS[task.priority]
          )}
        >
          {PRIORITY_LABELS[task.priority]}
        </span>
      </div>
      <p className="text-xs text-gray-400 mt-1">{task.assigneeEmail}</p>
      <p
        className={clsx(
          "text-xs mt-1",
          overdue ? "text-red-600 font-medium" : "text-gray-400"
        )}
      >
        Due {formatDate(task.dueDate)}
        {overdue ? " (overdue)" : ""}
      </p>
    </button>
  );
}
