"use client";

import { useState, type FormEvent } from "react";
import { createTask, updateTask } from "@/lib/tasks";
import { dateInputToMillis, toDateInputValue } from "@/lib/format";
import type { NewTaskInput, Task, TaskPriority, UserProfile } from "@/lib/types";
import { PRIORITY_LABELS, STATUS_LABELS } from "@/lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
  users: UserProfile[];
  currentUserUid: string;
  currentUserEmail: string;
  editingTask?: Task | null;
}

const emptyForm = {
  title: "",
  description: "",
  assigneeUid: "",
  startDate: toDateInputValue(Date.now()),
  dueDate: toDateInputValue(Date.now()),
  priority: "medium" as TaskPriority,
};

export default function TaskFormModal({
  open,
  onClose,
  users,
  currentUserUid,
  currentUserEmail,
  editingTask,
}: Props) {
  const [form, setForm] = useState(() =>
    editingTask
      ? {
          title: editingTask.title,
          description: editingTask.description,
          assigneeUid: editingTask.assigneeUid,
          startDate: toDateInputValue(editingTask.startDate),
          dueDate: toDateInputValue(editingTask.dueDate),
          priority: editingTask.priority,
        }
      : emptyForm
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const assignee = users.find((u) => u.uid === form.assigneeUid);
    if (!assignee) {
      setError("Select an assignee.");
      return;
    }
    const startDate = dateInputToMillis(form.startDate);
    const dueDate = dateInputToMillis(form.dueDate);
    if (dueDate < startDate) {
      setError("Due date cannot be before start date.");
      return;
    }

    setSubmitting(true);
    try {
      if (editingTask) {
        const changes: Partial<NewTaskInput> = {
          title: form.title,
          description: form.description,
          assigneeEmail: assignee.email,
          assigneeUid: assignee.uid,
          startDate,
          dueDate,
          priority: form.priority,
        };
        await updateTask(editingTask.id, changes, currentUserEmail);
      } else {
        await createTask(
          {
            title: form.title,
            description: form.description,
            assigneeEmail: assignee.email,
            assigneeUid: assignee.uid,
            startDate,
            dueDate,
            priority: form.priority,
            status: "todo",
          },
          currentUserUid,
          currentUserEmail
        );
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save task");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white rounded-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-lg font-semibold">
          {editingTask ? "Edit task" : "New task"}
        </h2>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Title</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Assignee</label>
          <select
            required
            value={form.assigneeUid}
            onChange={(e) => setForm({ ...form, assigneeUid: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="" disabled>
              Select a user…
            </option>
            {users.map((u) => (
              <option key={u.uid} value={u.uid}>
                {u.displayName} ({u.email})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Start date</label>
            <input
              required
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Due date</label>
            <input
              required
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Priority</label>
          <select
            value={form.priority}
            onChange={(e) =>
              setForm({ ...form, priority: e.target.value as TaskPriority })
            }
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            {(Object.keys(PRIORITY_LABELS) as TaskPriority[]).map((p) => (
              <option key={p} value={p}>
                {PRIORITY_LABELS[p]}
              </option>
            ))}
          </select>
        </div>

        {editingTask && (
          <p className="text-xs text-gray-400">
            Status: {STATUS_LABELS[editingTask.status]} (change via Kanban board)
          </p>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-2 justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md border border-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 text-sm rounded-md bg-gray-900 text-white disabled:opacity-50"
          >
            {submitting ? "Saving…" : editingTask ? "Save changes" : "Create task"}
          </button>
        </div>
      </form>
    </div>
  );
}
