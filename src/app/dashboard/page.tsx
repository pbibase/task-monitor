"use client";

import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import TaskCard from "@/components/TaskCard";
import TaskFormModal from "@/components/TaskFormModal";
import TaskDetailModal from "@/components/TaskDetailModal";
import { useAuth } from "@/context/AuthContext";
import { listUsers } from "@/lib/users";
import { subscribeToAssigneeTasks, subscribeToManagerTasks } from "@/lib/tasks";
import type { Task, TaskPriority, TaskStatus, UserProfile } from "@/lib/types";
import { PRIORITY_LABELS, STATUS_LABELS, TASK_STATUSES } from "@/lib/types";

type SortKey = "dueDate" | "priority" | "status";

const PRIORITY_ORDER: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 };

function DashboardContent() {
  const { profile, user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("dueDate");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const isManager = profile?.role === "manager";

  useEffect(() => {
    if (!user || !profile) return;
    const unsub = isManager
      ? subscribeToManagerTasks(user.uid, setTasks)
      : subscribeToAssigneeTasks(user.uid, setTasks);
    return unsub;
  }, [user, profile, isManager]);

  useEffect(() => {
    if (isManager) {
      listUsers().then(setUsers);
    }
  }, [isManager]);

  const visibleTasks = useMemo(() => {
    let result = tasks;
    if (statusFilter !== "all") result = result.filter((t) => t.status === statusFilter);
    if (priorityFilter !== "all")
      result = result.filter((t) => t.priority === priorityFilter);

    return [...result].sort((a, b) => {
      if (sortKey === "dueDate") return a.dueDate - b.dueDate;
      if (sortKey === "priority")
        return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      return a.status.localeCompare(b.status);
    });
  }, [tasks, statusFilter, priorityFilter, sortKey]);

  if (!profile || !user) return null;

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) ?? null;
  const editingTask = tasks.find((t) => t.id === editingTaskId) ?? null;

  return (
    <div className="flex-1 flex flex-col">
      <Navbar />
      <main className="mx-auto max-w-6xl w-full px-4 py-6 flex-1">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">
            {isManager ? "All tasks you manage" : "Your assigned tasks"}
          </h1>
          {isManager && (
            <button
              onClick={() => {
                setEditingTaskId(null);
                setFormOpen(true);
              }}
              className="px-4 py-2 text-sm rounded-md bg-gray-900 text-white"
            >
              + New task
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TaskStatus | "all")}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
          >
            <option value="all">All statuses</option>
            {TASK_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(e.target.value as TaskPriority | "all")
            }
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
          >
            <option value="all">All priorities</option>
            {(Object.keys(PRIORITY_LABELS) as TaskPriority[]).map((p) => (
              <option key={p} value={p}>
                {PRIORITY_LABELS[p]}
              </option>
            ))}
          </select>

          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
          >
            <option value="dueDate">Sort by due date</option>
            <option value="priority">Sort by priority</option>
            <option value="status">Sort by status</option>
          </select>
        </div>

        {visibleTasks.length === 0 ? (
          <p className="text-sm text-gray-400 mt-8">No tasks match these filters.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {visibleTasks.map((t) => (
              <TaskCard key={t.id} task={t} onClick={() => setSelectedTaskId(t.id)} />
            ))}
          </div>
        )}
      </main>

      {formOpen && (
        <TaskFormModal
          key={editingTaskId ?? "new"}
          open={formOpen}
          onClose={() => setFormOpen(false)}
          users={users}
          currentUserUid={user.uid}
          currentUserEmail={profile.email}
          editingTask={editingTask}
        />
      )}

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTaskId(null)}
          onEdit={() => {
            setEditingTaskId(selectedTask.id);
            setSelectedTaskId(null);
            setFormOpen(true);
          }}
          currentUserEmail={profile.email}
          isManager={isManager}
        />
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
