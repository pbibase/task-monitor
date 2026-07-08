"use client";

import { useState, type FormEvent } from "react";
import { addTaskComment, deleteTask, updateTaskStatus } from "@/lib/tasks";
import { formatDate } from "@/lib/format";
import type { Task, TaskStatus } from "@/lib/types";
import { PRIORITY_LABELS, STATUS_LABELS, TASK_STATUSES } from "@/lib/types";

interface Props {
  task: Task;
  onClose: () => void;
  onEdit: () => void;
  currentUserEmail: string;
  isManager: boolean;
}

export default function TaskDetailModal({
  task,
  onClose,
  onEdit,
  currentUserEmail,
  isManager,
}: Props) {
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleAddComment(e: FormEvent) {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      await addTaskComment(task.id, currentUserEmail, comment.trim());
      setComment("");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(status: TaskStatus) {
    await updateTaskStatus(task.id, status, currentUserEmail);
  }

  async function handleDelete() {
    if (!confirm("Delete this task?")) return;
    await deleteTask(task.id);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="w-full max-w-lg bg-white rounded-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-semibold">{task.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            ✕
          </button>
        </div>

        <p className="text-sm text-gray-600 whitespace-pre-wrap">
          {task.description || "No description."}
        </p>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-400">Assignee</span>
            <p>{task.assigneeEmail}</p>
          </div>
          <div>
            <span className="text-gray-400">Priority</span>
            <p>{PRIORITY_LABELS[task.priority]}</p>
          </div>
          <div>
            <span className="text-gray-400">Start date</span>
            <p>{formatDate(task.startDate)}</p>
          </div>
          <div>
            <span className="text-gray-400">Due date</span>
            <p>{formatDate(task.dueDate)}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Status</label>
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            {TASK_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Comments</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {task.comments.length === 0 && (
              <p className="text-sm text-gray-400">No comments yet.</p>
            )}
            {task.comments.map((c, i) => (
              <div key={i} className="text-sm bg-gray-50 rounded-md px-3 py-2">
                <span className="font-medium">{c.author}</span>{" "}
                <span className="text-gray-400 text-xs">
                  {formatDate(c.timestamp)}
                </span>
                <p>{c.text}</p>
              </div>
            ))}
          </div>
          <form onSubmit={handleAddComment} className="flex gap-2 mt-2">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment…"
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={submitting}
              className="px-3 py-2 text-sm rounded-md bg-gray-900 text-white disabled:opacity-50"
            >
              Post
            </button>
          </form>
        </div>

        <details className="text-sm">
          <summary className="cursor-pointer text-gray-400">History</summary>
          <ul className="mt-2 space-y-1">
            {task.history.map((h, i) => (
              <li key={i} className="text-xs text-gray-500">
                {formatDate(h.timestamp)} — {h.action}
              </li>
            ))}
          </ul>
        </details>

        <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
          {isManager && (
            <>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm rounded-md border border-red-300 text-red-600"
              >
                Delete
              </button>
              <button
                onClick={onEdit}
                className="px-4 py-2 text-sm rounded-md border border-gray-300"
              >
                Edit
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md bg-gray-900 text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
